import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon, exact: true },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Verifications', path: '/admin/verifications', icon: CheckBadgeIcon },
    { name: 'Reports', path: '/admin/reports', icon: ExclamationTriangleIcon },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCardIcon },
    { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon }
  ];

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <HeartIcon className="h-6 w-6 text-love" />
          <h2 className="text-xl font-bold text-love">Admin Panel</h2>
        </div>
      </div>
      
      <nav className="p-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-love text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Back to Dashboard Button */}
      <div className="p-4 border-t">
        <Link
          to="/dashboard"
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-love hover:text-white rounded-lg transition-all duration-300 font-semibold"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
