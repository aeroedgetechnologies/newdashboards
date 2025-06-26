import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, message } from 'antd';
import axios from 'axios';
import { getToken } from '../utils/auth';

const AuditLogs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://h-x6ti.onrender.com/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setData(res.data);
    } catch {
      message.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: 'Admin', dataIndex: 'adminEmail', key: 'adminEmail' },
    { title: 'Action', dataIndex: 'action', key: 'action', render: (action) => <Tag color="blue">{action}</Tag> },
    { title: 'Target', dataIndex: 'target', key: 'target' },
    { title: 'Details', dataIndex: 'details', key: 'details', render: (details) => details ? JSON.stringify(details) : '' },
    { title: 'Time', dataIndex: 'createdAt', key: 'createdAt', render: (t) => new Date(t).toLocaleString() },
  ];

  if (loading) return <Spin />;

  return <Table rowKey="_id" columns={columns} dataSource={data} />;
};

export default AuditLogs; 