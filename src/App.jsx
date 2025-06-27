import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveRequests from './pages/LiveRequests';
import Users from './pages/Users';
import WalletRequests from './pages/WalletRequests';
import Analytics from './pages/Analytics';
import PrivateRoute from './components/PrivateRoute';
import HeaderBar from './components/HeaderBar';
import LiveMonitor from './pages/LiveMonitor';
import AuditLogs from './pages/AuditLogs';
import SocketListener from './components/SocketListener';
import { BrowserRouter } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { removeToken } from './utils/auth';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobile(isMobile);
      setCollapsed(isMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    if (!mobile || collapsed) return;
    const handleClick = (e) => {
      const sidebar = document.querySelector('.ant-layout-sider');
      if (sidebar && !sidebar.contains(e.target)) {
        setCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobile, collapsed]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth={mobile ? 0 : 80}
        trigger={null}
        style={{ position: mobile ? 'fixed' : 'relative', zIndex: 1001, height: '100vh', left: 0, top: 0, background: '#001529' }}
        width={200}
      >
        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>Menu</span>
            <Button
              icon={<CloseOutlined style={{ color: '#fff', fontSize: 20 }} />}
              onClick={() => setCollapsed(true)}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
            />
          </div>
        )}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} style={{ marginTop: mobile ? 0 : 16 }}>
          <Menu.Item key="dashboard">
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="live">
            <Link to="/live-requests">Live Requests</Link>
          </Menu.Item>
          <Menu.Item key="users">
            <Link to="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="wallet">
            <Link to="/wallet-requests">Wallet Requests</Link>
          </Menu.Item>
          <Menu.Item key="analytics">
            <Link to="/analytics">Analytics</Link>
          </Menu.Item>
          <Menu.Item key="live-monitor">
            <Link to="/live-monitor">Live Monitor</Link>
          </Menu.Item>
          <Menu.Item key="audit-logs">
            <Link to="/audit-logs">Audit Logs</Link>
          </Menu.Item>
        </Menu>
        {mobile && (
          <Button
            type="primary"
            onClick={handleLogout}
            style={{ width: '90%', margin: '16px 5%', position: 'absolute', bottom: 16, left: 0, right: 0 }}
          >
            Logout
          </Button>
        )}
      </Sider>
      {/* Overlay for mobile sidebar */}
      {mobile && !collapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1000,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
      <Layout style={{ marginLeft: mobile && !collapsed ? 200 : 0, transition: 'margin-left 0.2s' }}>
        <HeaderBar onToggleSidebar={() => setCollapsed(!collapsed)} mobile={mobile} sidebarOpen={!collapsed} />
        <Content style={{ margin: '16px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/live-requests" element={<PrivateRoute><LiveRequests /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/wallet-requests" element={<PrivateRoute><WalletRequests /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/live-monitor" element={<PrivateRoute><LiveMonitor /></PrivateRoute>} />
            <Route path="/audit-logs" element={<PrivateRoute><AuditLogs /></PrivateRoute>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const AppWrapper = () => {
  return (
    <>
      <SocketListener />
      <App />
    </>
  );
};

export default AppWrapper; 