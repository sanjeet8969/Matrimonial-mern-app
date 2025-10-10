import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import {
  UsersIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      subtext: `${stats.newUsers} new this month`
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: SparklesIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Verified Profiles',
      value: stats.verifiedProfiles,
      icon: CheckBadgeIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: ClockIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: SparklesIcon,
      color: 'bg-pink-500'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`,
      icon: CurrencyRupeeIcon,
      color: 'bg-love'
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.subtext && (
                    <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
