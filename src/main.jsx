import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppWrapper from './App';
import 'antd/dist/reset.css';
import ThemeSwitcher from './components/ThemeSwitcher';

// Global CSS for full-height layout
const globalStyles = `
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  #root {
    display: flex;
    flex-direction: column;
  }
  
  .ant-layout {
    height: 100vh !important;
  }
  
  .ant-layout-sider {
    height: 100vh !important;
  }
  
  .ant-layout-content {
    height: 100vh !important;
    overflow: auto;
  }

  /* Dark mode enhancements */
  [data-theme="dark"] {
    background-color: #141414 !important;
    color: #fff !important;
  }

  [data-theme="dark"] .ant-layout {
    background-color: #141414 !important;
  }

  [data-theme="dark"] .ant-layout-content {
    background-color: #141414 !important;
  }

  [data-theme="dark"] .ant-card {
    background-color: #1f1f1f !important;
    border-color: #303030 !important;
  }

  [data-theme="dark"] .ant-card-head {
    background-color: #1f1f1f !important;
    border-bottom-color: #303030 !important;
  }

  [data-theme="dark"] .ant-card-head-title {
    color: #fff !important;
  }

  [data-theme="dark"] .ant-statistic-title {
    color: #d9d9d9 !important;
  }

  [data-theme="dark"] .ant-statistic-content {
    color: #fff !important;
  }

  [data-theme="dark"] .ant-list-item-meta-title {
    color: #fff !important;
  }

  [data-theme="dark"] .ant-list-item-meta-description {
    color: #d9d9d9 !important;
  }

  [data-theme="dark"] .ant-table {
    background-color: #1f1f1f !important;
  }

  [data-theme="dark"] .ant-table-thead > tr > th {
    background-color: #262626 !important;
    color: #fff !important;
    border-bottom-color: #303030 !important;
  }

  [data-theme="dark"] .ant-table-tbody > tr > td {
    background-color: #1f1f1f !important;
    color: #d9d9d9 !important;
    border-bottom-color: #303030 !important;
  }

  [data-theme="dark"] .ant-table-tbody > tr:hover > td {
    background-color: #262626 !important;
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeSwitcher>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </ThemeSwitcher>
  </React.StrictMode>
);
