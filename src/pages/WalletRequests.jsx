import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tag, Spin } from 'antd';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { exportToExcel } from '../utils/export';

const WalletRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://h-x6ti.onrender.com/api/admin/wallet-requests', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setData(res.data);
    } catch {
      message.error('Failed to fetch wallet requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.post(`https://h-x6ti.onrender.com/api/admin/wallet-requests/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      message.success(`Request ${action}d`);
      fetchData();
    } catch {
      message.error('Action failed');
    }
  };

  const columns = [
    { title: 'User', dataIndex: ['userId', 'name'], key: 'user' },
    { title: 'Email', dataIndex: ['userId', 'email'], key: 'email' },
    { title: 'Wallet Type', dataIndex: 'walletType', key: 'walletType' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => (
      <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>{status}</Tag>
    ) },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <>
        <Button type="primary" onClick={() => handleAction(record._id, 'approve')} style={{ marginRight: 8 }}>Approve</Button>
        <Button danger onClick={() => handleAction(record._id, 'reject')}>Reject</Button>
      </>
    ) },
  ];

  if (loading) return <Spin />;

  return (
    <>
      <Button onClick={() => exportToExcel(data, 'wallet_requests.xlsx')} style={{ marginBottom: 16 }}>Export to Excel</Button>
      <Table rowKey="_id" columns={columns} dataSource={data} />
    </>
  );
};

export default WalletRequests; 