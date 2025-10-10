import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/notifications"
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BellIcon
        className={`h-6 w-6 transition-all ${
          isHovered ? 'text-love scale-110' : 'text-gray-700'
        }`}
      />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
