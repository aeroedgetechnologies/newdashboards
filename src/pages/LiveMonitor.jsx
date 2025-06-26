import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin, Tag } from 'antd';
import axios from 'axios';
import { getToken } from '../utils/auth';

const LiveMonitor = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/live/active', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setData(res.data);
    } catch {
      message.error('Failed to fetch live streams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleForceStop = async (id) => {
    try {
      await axios.post(`/api/live/admin/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      message.success('Stream force-stopped');
      fetchData();
    } catch {
      message.error('Action failed');
    }
  };

  const columns = [
    { title: 'User', dataIndex: ['userId', 'name'], key: 'user' },
    { title: 'Email', dataIndex: ['userId', 'email'], key: 'email' },
    { title: 'Started', dataIndex: 'createdAt', key: 'createdAt', render: (t) => new Date(t).toLocaleString() },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color="green">{status}</Tag> },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <Button danger onClick={() => handleForceStop(record._id)}>Force Stop</Button>
    ) },
  ];

  if (loading) return <Spin />;

  return <Table rowKey="_id" columns={columns} dataSource={data} />;
};

export default LiveMonitor; 