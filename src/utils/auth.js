import jwt_decode from 'jwt-decode';

export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
export const isAuthenticated = () => !!getToken();

export const getRole = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwt_decode(token);
    return decoded.role;
  } catch {
    return null;
  }
}; 