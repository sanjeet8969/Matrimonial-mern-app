import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { FadeIn } from '../components/animations/ScrollAnimations';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const Messages = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(location.state?.chatId || null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-4xl font-bold mb-8 text-center">Messages</h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="card overflow-hidden" style={{ height: '70vh' }}>
            <div className="grid grid-cols-12 h-full">
              {/* Chat List */}
              <div className="col-span-12 md:col-span-4 border-r border-gray-200 overflow-y-auto">
                <ChatList
                  onSelectChat={setSelectedChat}
                  selectedChatId={selectedChat?._id}
                />
              </div>

              {/* Chat Window */}
              <div className="col-span-12 md:col-span-8">
                {selectedChat ? (
                  <ChatWindow chat={selectedChat} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <ChatBubbleLeftIcon className="h-24 w-24 mb-4 text-love opacity-50" />
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Messages;
