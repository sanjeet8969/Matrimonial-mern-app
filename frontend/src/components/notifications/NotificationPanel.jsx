import React, { useState, useEffect } from 'react';
import { getNotifications, markAllAsRead } from '../../api/notificationApi';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import Button from '../common/Button';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { resetUnreadCount, loadUnreadCount } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications(page);
      setNotifications(response.data.notifications);
      setHasMore(response.data.page < response.data.pages);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
      resetUnreadCount();
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationUpdate = () => {
    loadNotifications();
    loadUnreadCount();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <Button size="sm" variant="secondary" onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-2">
            You'll be notified about interests, messages, and profile updates
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onUpdate={handleNotificationUpdate}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={() => setPage(page + 1)}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
