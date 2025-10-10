import React, { useState, useEffect } from 'react';
import { getChats } from '../../api/chatApi';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isUserOnline } = useSocket();

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', () => {
        loadChats();
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);

  const loadChats = async () => {
    try {
      const response = await getChats();
      setChats(response.data.chats);
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Start chatting with your matches!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {chats.map((chat) => {
        const otherUser = chat.participants.find(p => p._id !== chat.currentUserId);
        const isOnline = isUserOnline(otherUser?._id);
        const unreadCount = chat.unreadCount?.[chat.currentUserId] || 0;

        return (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedChatId === chat._id ? 'bg-love-light bg-opacity-10' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative flex-shrink-0">
                <img
                  src={otherUser?.profilePhoto || '/default-avatar.png'}
                  alt={otherUser?.email}
                  className="h-12 w-12 rounded-full object-cover"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {otherUser?.email?.split('@')[0]}
                  </p>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
                
                {chat.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.content}
                  </p>
                )}
                
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-love rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
