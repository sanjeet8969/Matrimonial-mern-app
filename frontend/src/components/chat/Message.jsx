import React from 'react';
import { format } from 'date-fns';
import { CheckIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

const Message = ({ message, isOwn }) => {
  const isRead = message.readBy && message.readBy.length > 0;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-love text-white rounded-br-none'
              : 'bg-white text-gray-900 rounded-bl-none shadow-md'
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>
        
        <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 ${
          isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
          {isOwn && (
            <span>
              {isRead ? (
                <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
