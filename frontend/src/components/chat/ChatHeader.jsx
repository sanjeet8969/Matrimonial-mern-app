import React from 'react';
import { useSocket } from '../../hooks/useSocket';
import OnlineStatus from './OnlineStatus';
import { PhoneIcon, VideoCameraIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const ChatHeader = ({ user }) => {
  const { isUserOnline } = useSocket();
  const online = isUserOnline(user._id);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={user.profilePhoto || '/default-avatar.png'}
              alt={user.email}
              className="h-10 w-10 rounded-full object-cover"
            />
            <OnlineStatus isOnline={online} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.email?.split('@')[0]}
            </h3>
            <p className="text-sm text-gray-500">
              {online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <PhoneIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <VideoCameraIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
