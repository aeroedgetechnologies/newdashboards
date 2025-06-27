import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tag, Spin, Input, Drawer } from 'antd';
import axiosInstance from '../utils/axiosInstance';
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
  const [mobile, setMobile] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/users');
      setData(res.data);
    } catch (error) {
      console.error('Fetch error:', error.response?.data || error.message);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBlock = async (id) => {
    try {
      await axiosInstance.post(`/admin/users/${id}/block`);
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
    <div style={{ padding: mobile ? '8px' : '20px' }}>
      <div style={{ marginBottom: 16, display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 8 }}>
        <Button 
          onClick={() => exportToExcel(filteredData, 'users.xlsx')} 
          style={{ marginBottom: mobile ? 8 : 0 }}
        >
          Export to Excel
        </Button>
        <Input.Search
          placeholder="Search by name or email"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: mobile ? '100%' : 300 }}
        />
      </div>
      <div style={{ 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        borderRadius: 8,
        border: '1px solid #f0f0f0'
      }}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ 
            ...pagination, 
            total: filteredData.length,
            size: mobile ? 'small' : 'default',
            showSizeChanger: !mobile,
            showQuickJumper: !mobile
          }}
          onChange={handleTableChange}
          onRow={onRow}
          scroll={{ x: mobile ? 600 : undefined }}
          size={mobile ? 'small' : 'default'}
          style={{ minWidth: mobile ? 600 : 'auto' }}
        />
      </div>
      <Drawer
        title={selectedUser?.name}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={mobile ? '100%' : 350}
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
    </div>
  );
};

export default Users; 