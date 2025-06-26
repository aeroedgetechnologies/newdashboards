import React from 'react';
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
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
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
      <Layout>
        <HeaderBar />
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