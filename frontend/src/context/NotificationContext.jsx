import React, { createContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { getUnreadCount } from '../api/notificationApi';
import toast from 'react-hot-toast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    loadUnreadCount();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newInterest', (data) => {
        toast.success(`New interest from ${data.sender.firstName}!`);
        setUnreadCount(prev => prev + 1);
      });

      socket.on('interestAccepted', (data) => {
        toast.success(`${data.acceptedBy.firstName} accepted your interest!`);
        setUnreadCount(prev => prev + 1);
      });

      socket.on('receiveMessage', (data) => {
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off('newInterest');
        socket.off('interestAccepted');
        socket.off('receiveMessage');
      }
    };
  }, [socket]);

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const decrementUnreadCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  const value = {
    unreadCount,
    setUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
    loadUnreadCount
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
