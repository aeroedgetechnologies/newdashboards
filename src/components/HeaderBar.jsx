import React from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const HeaderBar = ({ onToggleSidebar, mobile }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
  return (
    <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
      {mobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={onToggleSidebar}
          style={{ marginRight: 16 }}
        />
      )}
      <div style={{ flex: 1 }} />
      <Button type="primary" onClick={handleLogout}>Logout</Button>
    </Header>
  );
};

export default HeaderBar; 