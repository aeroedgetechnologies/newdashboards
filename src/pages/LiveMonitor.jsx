import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin, Tag } from 'antd';
import axiosInstance from '../utils/axiosInstance';

const LiveMonitor = () => {
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
      const res = await axiosInstance.get('/live/active');
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
      await axiosInstance.post(`/live/admin/${id}/reject`);
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
          scroll={{ x: mobile ? 600 : undefined }}
          size={mobile ? 'small' : 'default'}
          pagination={{
            size: mobile ? 'small' : 'default',
            showSizeChanger: !mobile,
            showQuickJumper: !mobile
          }}
          style={{ minWidth: mobile ? 600 : 'auto' }}
        />
      </div>
    </div>
  );
};

export default LiveMonitor; 