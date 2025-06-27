import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, message, DatePicker } from 'antd';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../utils/axiosInstance';

const { RangePicker } = DatePicker;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/admin/analytics');
        setData(res.data);
      } catch (err) {
        message.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  // Mock data for charts (replace with real API data)
  const userGrowthData = [
    { month: 'Jan', users: 120, newUsers: 20 },
    { month: 'Feb', users: 150, newUsers: 30 },
    { month: 'Mar', users: 180, newUsers: 25 },
    { month: 'Apr', users: 220, newUsers: 40 },
    { month: 'May', users: 280, newUsers: 60 },
    { month: 'Jun', users: 350, newUsers: 70 },
  ];

  const walletActivityData = [
    { day: 'Mon', deposits: 1200, withdrawals: 800, pending: 300 },
    { day: 'Tue', deposits: 1500, withdrawals: 900, pending: 400 },
    { day: 'Wed', deposits: 1800, withdrawals: 1100, pending: 500 },
    { day: 'Thu', deposits: 1400, withdrawals: 950, pending: 350 },
    { day: 'Fri', deposits: 2000, withdrawals: 1200, pending: 600 },
    { day: 'Sat', deposits: 2200, withdrawals: 1400, pending: 700 },
    { day: 'Sun', deposits: 1900, withdrawals: 1000, pending: 450 },
  ];

  const liveStreamData = [
    { status: 'Pending', count: data?.pendingLives || 0 },
    { status: 'Live', count: data?.lives || 0 },
    { status: 'Ended', count: 45 },
    { status: 'Approved', count: 78 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 15000, expenses: 8000, profit: 7000 },
    { month: 'Feb', revenue: 18000, expenses: 9000, profit: 9000 },
    { month: 'Mar', revenue: 22000, expenses: 11000, profit: 11000 },
    { month: 'Apr', revenue: 25000, expenses: 12000, profit: 13000 },
    { month: 'May', revenue: 30000, expenses: 14000, profit: 16000 },
    { month: 'Jun', revenue: 35000, expenses: 16000, profit: 19000 },
  ];

  if (loading) return <Spin size="large" />;

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
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={data?.users || 0} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Live Streams" 
              value={data?.lives || 0} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Pending Live Requests" 
              value={data?.pendingLives || 0} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Pending Wallet Requests" 
              value={data?.walletReqs || 0} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        {/* User Growth Chart */}
        <Col xs={24} lg={12}>
          <Card title="User Growth Trend" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Wallet Activity Chart */}
        <Col xs={24} lg={12}>
          <Card title="Wallet Activity (Weekly)" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={walletActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="deposits" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="withdrawals" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="pending" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Live Stream Status Distribution */}
        <Col xs={24} lg={8}>
          <Card title="Live Stream Status Distribution" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={liveStreamData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {liveStreamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Revenue Analytics */}
        <Col xs={24} lg={16}>
          <Card title="Revenue Analytics" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
                <Bar dataKey="profit" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Real-time Metrics */}
        <Col xs={24}>
          <Card title="Real-time Metrics">
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Statistic title="Active Sessions" value={data?.activeSessions || 45} />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic title="Today's Revenue" value={`$${data?.todayRevenue || 2500}`} />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic title="Avg. Session Duration" value={`${data?.avgSessionDuration || 12}m`} />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic title="Conversion Rate" value={`${data?.conversionRate || 3.2}%`} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics; 