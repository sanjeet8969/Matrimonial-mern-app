import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { HeartIcon, BellIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <HeartIcon className="h-8 w-8 text-love animate-heartbeat" />
              <span className="text-2xl font-bold text-love">Matrimonial</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-700 hover:text-love transition-colors">
              Dashboard
            </Link>
            <Link to="/matches" className="text-gray-700 hover:text-love transition-colors">
              Matches
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-love transition-colors">
              Search
            </Link>
            <Link to="/interests" className="text-gray-700 hover:text-love transition-colors">
              Interests
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-love transition-colors">
              Messages
            </Link>
            
            {/* Notifications */}
            <Link to="/notifications" className="relative">
              <BellIcon className="h-6 w-6 text-gray-700 hover:text-love transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-love transition-colors">
                <UserIcon className="h-6 w-6" />
                <span>{user?.email?.split('@')[0]}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/profile/me"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  to="/subscription"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Subscription
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Dashboard
            </Link>
            <Link to="/matches" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Matches
            </Link>
            <Link to="/search" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Search
            </Link>
            <Link to="/interests" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Interests
            </Link>
            <Link to="/messages" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Messages
            </Link>
            <Link to="/notifications" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </Link>
            <Link to="/profile/me" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              My Profile
            </Link>
            <Link to="/settings" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
