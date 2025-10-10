import React from 'react';
import NotificationPanel from '../components/notifications/NotificationPanel';
import { FadeIn } from '../components/animations/ScrollAnimations';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <NotificationPanel />
        </FadeIn>
      </div>
    </div>
  );
};

export default Notifications;
