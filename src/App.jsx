import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
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

const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobile(isMobile);
      setCollapsed(isMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth={mobile ? 0 : 80}
        trigger={null}
        style={{ position: mobile ? 'fixed' : 'relative', zIndex: 1001, height: '100vh', left: 0, top: 0 }}
        width={200}
      >
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
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
      </Sider>
      <Layout style={{ marginLeft: mobile && !collapsed ? 200 : 0, transition: 'margin-left 0.2s' }}>
        <HeaderBar onToggleSidebar={() => setCollapsed(!collapsed)} mobile={mobile} />
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