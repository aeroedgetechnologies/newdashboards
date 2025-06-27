import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, message } from 'antd';
import axiosInstance from '../utils/axiosInstance';

const AuditLogs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/audit-logs');
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

  return (
    <div style={{ padding: mobile ? '8px' : '20px' }}>
      <div style={{ 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        borderRadius: 8,
        border: '1px solid #f0f0f0'
      }}>
        <Table 
          rowKey="_id" 
          columns={columns} 
          dataSource={data}
          scroll={{ x: mobile ? 800 : undefined }}
          size={mobile ? 'small' : 'default'}
          pagination={{
            size: mobile ? 'small' : 'default',
            showSizeChanger: !mobile,
            showQuickJumper: !mobile
          }}
          style={{ minWidth: mobile ? 800 : 'auto' }}
        />
      </div>
    </div>
  );
};

export default AuditLogs; 