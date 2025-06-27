import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin } from 'antd';
import axiosInstance from '../utils/axiosInstance';
import { exportToExcel } from '../utils/export';

const LiveRequests = () => {
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
      const res = await axiosInstance.get('/admin/live-requests');
      setData(res.data);
    } catch {
      message.error('Failed to fetch live requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, action) => {
    try {
      await axiosInstance.post(`/live/admin/${id}/${action}`);
      message.success(`Request ${action}d`);
      fetchData();
    } catch {
      message.error('Action failed');
    }
  };

  const columns = [
    { title: 'User', dataIndex: ['userId', 'name'], key: 'user' },
    { title: 'Email', dataIndex: ['userId', 'email'], key: 'email' },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <>
        <Button type="primary" onClick={() => handleAction(record._id, 'approve')} style={{ marginRight: 8, marginBottom: mobile ? 4 : 0 }}>Approve</Button>
        <Button danger onClick={() => handleAction(record._id, 'reject')}>Reject</Button>
      </>
    ) },
  ];

  if (loading) return <Spin />;

  return (
    <div style={{ padding: mobile ? '8px' : '20px' }}>
      <Button 
        onClick={() => exportToExcel(data, 'live_requests.xlsx')} 
        style={{ marginBottom: 16 }}
      >
        Export to Excel
      </Button>
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
          scroll={{ x: mobile ? 500 : undefined }}
          size={mobile ? 'small' : 'default'}
          pagination={{
            size: mobile ? 'small' : 'default',
            showSizeChanger: !mobile,
            showQuickJumper: !mobile
          }}
          style={{ minWidth: mobile ? 500 : 'auto' }}
        />
      </div>
    </div>
  );
};

export default LiveRequests; 