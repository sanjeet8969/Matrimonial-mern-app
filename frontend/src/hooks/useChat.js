import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import * as chatApi from '../api/chatApi';

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (chatId) {
      loadMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if (socket && chatId) {
      socket.on('receiveMessage', (data) => {
        if (data.chatId === chatId) {
          setMessages(prev => [...prev, data.message]);
        }
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, chatId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatApi.getMessages(chatId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    try {
      const response = await chatApi.sendMessage(chatId, content);
      setMessages(prev => [...prev, response.data.message]);
      return response.data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    loadMessages
  };
};
