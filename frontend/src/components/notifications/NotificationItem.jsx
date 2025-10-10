import React from 'react';
import { useNavigate } from 'react-router-dom';
import { markAsRead, deleteNotification } from '../../api/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  SparklesIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const NotificationItem = ({ notification, onUpdate }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    const iconClass = "h-6 w-6";
    switch (notification.type) {
      case 'interest_received':
        return <HeartIcon className={`${iconClass} text-love`} />;
      case 'interest_accepted':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'interest_rejected':
        return <ExclamationCircleIcon className={`${iconClass} text-red-500`} />;
      case 'new_message':
        return <ChatBubbleLeftIcon className={`${iconClass} text-blue-500`} />;
      case 'profile_view':
        return <EyeIcon className={`${iconClass} text-purple-500`} />;
      case 'profile_verified':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'new_match':
        return <SparklesIcon className={`${iconClass} text-yellow-500`} />;
      default:
        return <SparklesIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this notification?')) return;

    try {
      await deleteNotification(notification._id);
      toast.success('Notification deleted');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`card p-4 cursor-pointer transition-all hover:shadow-lg ${
        !notification.isRead ? 'bg-love-light bg-opacity-10 border-l-4 border-love' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>

            <button
              onClick={handleDelete}
              className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>

        {!notification.isRead && (
          <div className="flex-shrink-0">
            <span className="inline-block h-2 w-2 rounded-full bg-love"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
