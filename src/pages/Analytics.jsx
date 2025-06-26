import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, message } from 'antd';
import axios from 'axios';
import { getToken } from '../utils/auth';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://h-x6ti.onrender.com/api/admin/analytics', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setData(res.data);
      } catch (err) {
        message.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spin />;

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card><Statistic title="Total Users" value={data?.users || 0} /></Card>
      </Col>
      <Col span={6}>
        <Card><Statistic title="Live Streams" value={data?.lives || 0} /></Card>
      </Col>
      <Col span={6}>
        <Card><Statistic title="Pending Live Requests" value={data?.pendingLives || 0} /></Card>
      </Col>
      <Col span={6}>
        <Card><Statistic title="Pending Wallet Requests" value={data?.walletReqs || 0} /></Card>
      </Col>
    </Row>
  );
};

export default Analytics; 