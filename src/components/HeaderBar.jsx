import React from 'react';
import { Layout, Button } from 'antd';
import { removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const HeaderBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
  return (
    <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Button type="primary" onClick={handleLogout}>Logout</Button>
    </Header>
  );
};

export default HeaderBar; 