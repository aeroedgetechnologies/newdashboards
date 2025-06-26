import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tag, Spin, Input, Drawer } from 'antd';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { exportToExcel } from '../utils/export';

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const token = getToken();
    console.log('Sending token:', token);  // Log token here

    const res = await axios.get('https://h-x6ti.onrender.com/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(res.data);
  } catch (error) {
    console.error('Fetch error:', error.response?.data || error.message);
    message.error('Failed to fetch users');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => { fetchData(); }, []);

  const handleBlock = async (id) => {
    try {
      await axios.post(`https://h-x6ti.onrender.com/api/admin/users/${id}/block`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      message.success('User status updated');
      fetchData();
    } catch {
      message.error('Action failed');
    }
  };

  // Search and filter logic
  const filteredData = data.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Blocked', value: 'blocked' },
      ],
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'blocked' ? 'red' : 'green'}>{status}</Tag>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <Button onClick={() => handleBlock(record._id)}>
        {record.status === 'blocked' ? 'Unblock' : 'Block'}
      </Button>
    ) },
  ];

  const handleTableChange = (pag, filters) => {
    setPagination(pag);
    setStatusFilter(filters.status ? filters.status[0] : null);
  };

  const onRow = (record) => ({
    onClick: () => {
      setSelectedUser(record);
      setDrawerVisible(true);
    }
  });

  if (loading) return <Spin />;

  return (
    <>
      <Button onClick={() => exportToExcel(filteredData, 'users.xlsx')} style={{ marginBottom: 16, marginLeft: 16 }}>Export to Excel</Button>
      <Input.Search
        placeholder="Search by name or email"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ ...pagination, total: filteredData.length }}
        onChange={handleTableChange}
        onRow={onRow}
      />
      <Drawer
        title={selectedUser?.name}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={350}
      >
        {selectedUser && (
          <>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Status:</b> {selectedUser.status}</p>
            <p><b>Reward Points:</b> {selectedUser.rewardPoints}</p>
            <p><b>Wallets:</b></p>
            <ul>
              {selectedUser.wallets?.map(w => (
                <li key={w.type}>{w.type}: {w.balance}</li>
              ))}
            </ul>
            <p><b>Created:</b> {new Date(selectedUser.createdAt).toLocaleString()}</p>
          </>
        )}
      </Drawer>
    </>
  );
};

export default Users; 