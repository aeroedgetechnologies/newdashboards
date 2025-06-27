import React, { useState, useEffect, createContext, useContext } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeSwitcher = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply theme to document for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigProvider theme={{
        algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: theme === 'dark' ? '#1f1f1f' : '#ffffff',
          colorBgLayout: theme === 'dark' ? '#141414' : '#f5f5f5',
          colorText: theme === 'dark' ? '#ffffff' : '#000000',
          colorTextSecondary: theme === 'dark' ? '#d9d9d9' : '#666666',
        }
      }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeSwitcher; 