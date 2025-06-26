import { useEffect } from 'react';
import { notification } from 'antd';
import { io } from 'socket.io-client';

const SocketListener = () => {
  useEffect(() => {
    const socket = io(window.location.origin);
    socket.on('newLiveRequest', ({ user, live }) => {
      notification.info({
        message: 'New Live Request',
        description: `${user.name} requested to go live.`,
        duration: 4,
      });
    });
    socket.on('newWalletRequest', ({ user, wr }) => {
      notification.info({
        message: 'New Wallet Request',
        description: `${user.name} requested a wallet withdrawal.`,
        duration: 4,
      });
    });
    return () => socket.disconnect();
  }, []);
  return null;
};

export default SocketListener; 