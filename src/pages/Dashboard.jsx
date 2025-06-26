import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, message, Button, Modal, Checkbox } from 'antd';
import axios from 'axios';
import { getToken } from '../utils/auth';

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

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleWidgets, setVisibleWidgets] = useState(getWidgetPrefs());
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleWidgetChange = (checkedValues) => {
    setVisibleWidgets(checkedValues);
    localStorage.setItem('dashboardWidgets', JSON.stringify(checkedValues));
  };

  if (loading) return <Spin />;

  return (
    <>
      <Button onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>Customize Widgets</Button>
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
      <Row gutter={16}>
        {visibleWidgets.includes('users') && (
          <Col span={6}><Card><Statistic title="Total Users" value={data?.users || 0} /></Card></Col>
        )}
        {visibleWidgets.includes('lives') && (
          <Col span={6}><Card><Statistic title="Live Streams" value={data?.lives || 0} /></Card></Col>
        )}
        {visibleWidgets.includes('pendingLives') && (
          <Col span={6}><Card><Statistic title="Pending Live Requests" value={data?.pendingLives || 0} /></Card></Col>
        )}
        {visibleWidgets.includes('walletReqs') && (
          <Col span={6}><Card><Statistic title="Pending Wallet Requests" value={data?.walletReqs || 0} /></Card></Col>
        )}
      </Row>
    </>
  );
};

export default Dashboard; 