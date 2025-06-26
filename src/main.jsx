import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppWrapper from './App';
import 'antd/dist/reset.css';
import ThemeSwitcher from './components/ThemeSwitcher';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeSwitcher>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </ThemeSwitcher>
  </React.StrictMode>
);
