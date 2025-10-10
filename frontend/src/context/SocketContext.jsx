import React, { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connected, setConnected] = useState(false);
  const { token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (token && !socketRef.current) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('userOnline', ({ userId }) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      newSocket.on('userOffline', ({ userId }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
    };
  }, [token]);

  const emitTyping = (chatId, receiverId) => {
    if (socket) {
      socket.emit('typing', { chatId, receiverId });
    }
  };

  const emitStopTyping = (chatId, receiverId) => {
    if (socket) {
      socket.emit('stopTyping', { chatId, receiverId });
    }
  };

  const emitMessageSeen = (chatId, messageId, senderId) => {
    if (socket) {
      socket.emit('messageSeen', { chatId, messageId, senderId });
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const value = {
    socket,
    connected,
    onlineUsers,
    emitTyping,
    emitStopTyping,
    emitMessageSeen,
    isUserOnline
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
