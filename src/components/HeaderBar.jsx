import React from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useTheme } from './ThemeSwitcher';

const { Header } = Layout;

const HeaderBar = ({ onToggleSidebar, mobile, sidebarOpen, onLogout }) => {
  const { theme, setTheme } = useTheme();
  return (
    <Header
      style={{
        background: theme === 'dark' ? 'rgba(30,30,30,0.95)' : '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 12px',
        height: 56,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        zIndex: 1100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {mobile && !sidebarOpen && (
          <Button
            icon={<MenuOutlined style={{ color: theme === 'dark' ? '#fff' : '#222', fontSize: 22 }} />}
            onClick={onToggleSidebar}
            style={{ marginRight: 12, border: 'none', background: 'transparent', boxShadow: 'none' }}
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ marginRight: 8 }}
        >
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
        {!mobile && (
          <Button type="primary" onClick={onLogout} style={{ minWidth: 80 }}>
            Logout
          </Button>
        )}
      </div>
    </Header>
  );
};

export default HeaderBar; 