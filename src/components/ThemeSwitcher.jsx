import React, { useState, useEffect } from 'react';
import { ConfigProvider, Button, theme as antdTheme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

const ThemeSwitcher = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ConfigProvider theme={{
      algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
    }}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      </div>
      {children}
    </ConfigProvider>
  );
};

export default ThemeSwitcher; 