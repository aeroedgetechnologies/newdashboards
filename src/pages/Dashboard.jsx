import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, message, Button, Modal, Checkbox, List, Avatar, Tag } from 'antd';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserOutlined, VideoCameraOutlined, WalletOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../utils/axiosInstance';

const widgetKeys = [
  { key: 'users', label: 'Total Users' },
  { key: 'lives', label: 'Live Streams' },
  { key: 'pendingLives', label: 'Pending Live Requests' },
  { key: 'walletReqs', label: 'Pending Wallet Requests' },
];

const getWidgetPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem('dashboardWidgets')) || widgetKeys.map(w => w.key);
  } catch {
    return widgetKeys.map(w => w.key);
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleWidgets, setVisibleWidgets] = useState(getWidgetPrefs());
  const [modalOpen, setModalOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/admin/analytics');
        setData(res.data);
        
        // Mock recent activity data
        setRecentActivity([
          { id: 1, type: 'user', action: 'New user registered', user: 'Alice Smith', time: '2 minutes ago' },
          { id: 2, type: 'live', action: 'Live stream started', user: 'Bob Johnson', time: '5 minutes ago' },
          { id: 3, type: 'wallet', action: 'Wallet request approved', user: 'Charlie Brown', time: '10 minutes ago' },
          { id: 4, type: 'user', action: 'User blocked', user: 'Diana Prince', time: '15 minutes ago' },
          { id: 5, type: 'live', action: 'Live request pending', user: 'Eve Wilson', time: '20 minutes ago' },
        ]);
      } catch (err) {
        message.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWidgetChange = (checkedValues) => {
    setVisibleWidgets(checkedValues);
    localStorage.setItem('dashboardWidgets', JSON.stringify(checkedValues));
  };

  // Chart data
  const userGrowthData = [
    { day: 'Mon', users: 120, newUsers: 15 },
    { day: 'Tue', users: 135, newUsers: 18 },
    { day: 'Wed', users: 150, newUsers: 20 },
    { day: 'Thu', users: 165, newUsers: 22 },
    { day: 'Fri', users: 180, newUsers: 25 },
    { day: 'Sat', users: 200, newUsers: 30 },
    { day: 'Sun', users: 220, newUsers: 35 },
  ];

  const activityData = [
    { hour: '00:00', liveStreams: 2, users: 45 },
    { hour: '04:00', liveStreams: 1, users: 25 },
    { hour: '08:00', liveStreams: 3, users: 80 },
    { hour: '12:00', liveStreams: 5, users: 120 },
    { hour: '16:00', liveStreams: 4, users: 95 },
    { hour: '20:00', liveStreams: 6, users: 150 },
    { hour: '24:00', liveStreams: 3, users: 75 },
  ];

  const statusData = [
    { status: 'Active Users', count: data?.users ? Math.floor(data.users * 0.85) : 0 },
    { status: 'Blocked Users', count: data?.users ? Math.floor(data.users * 0.15) : 0 },
  ];

  if (loading) return <Spin size="large" />;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <UserOutlined style={{ color: '#1890ff' }} />;
      case 'live': return <VideoCameraOutlined style={{ color: '#52c41a' }} />;
      case 'wallet': return <WalletOutlined style={{ color: '#faad14' }} />;
      default: return <ClockCircleOutlined style={{ color: '#722ed1' }} />;
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      height: '100%', 
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Row gutter={[16, 16]} style={{ flex: 1 }}>
        {/* Summary Cards */}
        {visibleWidgets.includes('users') && (
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Total Users" 
                value={data?.users || 0} 
                valueStyle={{ color: '#3f8600' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        )}
        {visibleWidgets.includes('lives') && (
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Live Streams" 
                value={data?.lives || 0} 
                valueStyle={{ color: '#1890ff' }}
                prefix={<VideoCameraOutlined />}
              />
            </Card>
          </Col>
        )}
        {visibleWidgets.includes('pendingLives') && (
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Pending Live Requests" 
                value={data?.pendingLives || 0} 
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        )}
        {visibleWidgets.includes('walletReqs') && (
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Pending Wallet Requests" 
                value={data?.walletReqs || 0} 
                valueStyle={{ color: '#cf1322' }}
                prefix={<WalletOutlined />}
              />
            </Card>
          </Col>
        )}

        {/* User Growth Chart */}
        <Col xs={24} lg={12}>
          <Card 
            title="User Growth (Last 7 Days)" 
            style={{ height: 400 }}
            extra={
              <Button size="small" onClick={() => setModalOpen(true)}>
                Customize
              </Button>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Total Users" />
                <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Activity Chart */}
        <Col xs={24} lg={12}>
          <Card title="24-Hour Activity" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="liveStreams" stackId="1" stroke="#8884d8" fill="#8884d8" name="Live Streams" />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* User Status Distribution */}
        <Col xs={24} lg={8}>
          <Card title="User Status Distribution" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={16}>
          <Card title="Recent Activity" style={{ height: 400 }}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivity}
              style={{ overflow: 'auto', maxHeight: 320 }}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    avatar={<Avatar icon={getActivityIcon(item.type)} />}
                    title={
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 500,
                        wordBreak: 'break-word',
                        lineHeight: '1.4'
                      }}>
                        {item.action}
                      </div>
                    }
                    description={
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        wordBreak: 'break-word',
                        lineHeight: '1.3'
                      }}>
                        {item.user} • {item.time}
                      </div>
                    }
                  />
                  <Tag 
                    color={item.type === 'user' ? 'blue' : item.type === 'live' ? 'green' : 'orange'}
                    style={{ 
                      flexShrink: 0,
                      marginLeft: '8px'
                    }}
                  >
                    {item.type.toUpperCase()}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Customize Widgets Modal */}
      <Modal
        title="Customize Dashboard Widgets"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
      >
        <Checkbox.Group
          options={widgetKeys.map(w => ({ label: w.label, value: w.key }))}
          value={visibleWidgets}
          onChange={handleWidgetChange}
        />
      </Modal>
    </div>
  );
};

export default Dashboard; 