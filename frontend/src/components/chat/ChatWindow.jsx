import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';
import { markAsRead } from '../../api/chatApi';
import ChatHeader from './ChatHeader';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import Loader from '../common/Loader';

const ChatWindow = ({ chat }) => {
  const { messages, loading, sendMessage } = useChat(chat._id);
  const { socket, emitTyping, emitStopTyping } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  const otherUser = chat.participants.find(p => p._id !== chat.currentUserId);

  useEffect(() => {
    scrollToBottom();
    markChatAsRead();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('userTyping', (data) => {
        if (data.chatId === chat._id) {
          setIsTyping(true);
          setTypingUser(data.userId);
        }
      });

      socket.on('userStopTyping', (data) => {
        if (data.chatId === chat._id) {
          setIsTyping(false);
          setTypingUser(null);
        }
      });

      return () => {
        socket.off('userTyping');
        socket.off('userStopTyping');
      };
    }
  }, [socket, chat._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markChatAsRead = async () => {
    try {
      await markAsRead(chat._id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      await sendMessage(content);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = () => {
    emitTyping(chat._id, otherUser._id);
  };

  const handleStopTyping = () => {
    emitStopTyping(chat._id, otherUser._id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader user={otherUser} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            isOwn={message.sender._id === chat.currentUserId}
          />
        ))}
        
        {isTyping && typingUser === otherUser._id && (
          <TypingIndicator userName={otherUser.email?.split('@')[0]} />
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </div>
  );
};

export default ChatWindow;
