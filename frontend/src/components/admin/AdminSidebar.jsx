import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

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
    <div className="w-64 bg-white shadow-lg min-h-screen sticky top-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-love">Admin Panel</h2>
      </div>
      
      <nav className="p-4">
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
    </div>
  );
};

export default AdminSidebar;
