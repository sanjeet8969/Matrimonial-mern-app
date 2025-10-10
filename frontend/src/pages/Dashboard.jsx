import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile } from '../api/profileApi';
import { getSuggestedMatches } from '../api/matchApi';
import { getReceivedInterests } from '../api/interestApi';
import MatchCard from '../components/matches/MatchCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import HeartParticles from '../components/animations/HeartParticles';
import { FadeIn, ScaleIn } from '../components/animations/ScrollAnimations';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileRes, matchesRes, interestsRes] = await Promise.all([
        getMyProfile(),
        getSuggestedMatches(),
        getReceivedInterests()
      ]);

      setProfile(profileRes.data.profile);
      setMatches(matchesRes.data.matches.slice(0, 6));
      setInterests(interestsRes.data.interests.filter(i => i.status === 'pending').slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const quickStats = [
    { label: 'Profile Views', value: profile?.profileViews || 0, icon: UserCircleIcon },
    { label: 'Interests Received', value: profile?.interestsReceived || 0, icon: HeartIcon },
    { label: 'Interests Sent', value: profile?.interestsSent || 0, icon: SparklesIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <FadeIn>
          <div className="card p-8 mb-8 bg-gradient-to-r from-love-light to-love text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <HeartIcon className="h-64 w-64" />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {profile?.firstName}! 💕
              </h1>
              <p className="text-lg opacity-90">
                Your journey to finding true love continues here
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScaleIn key={index} delay={index * 0.1}>
                <div className="card p-6 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="bg-love-light bg-opacity-20 p-3 rounded-full">
                      <Icon className="h-8 w-8 text-love" />
                    </div>
                  </div>
                </div>
              </ScaleIn>
            );
          })}
        </div>

        {/* Quick Actions */}
        <FadeIn delay={0.3}>
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/matches">
                <Button variant="outline" fullWidth className="flex flex-col items-center py-6 space-y-2">
                  <HeartIcon className="h-8 w-8" />
                  <span>Browse Matches</span>
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" fullWidth className="flex flex-col items-center py-6 space-y-2">
                  <MagnifyingGlassIcon className="h-8 w-8" />
                  <span>Advanced Search</span>
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" fullWidth className="flex flex-col items-center py-6 space-y-2">
                  <ChatBubbleLeftIcon className="h-8 w-8" />
                  <span>Messages</span>
                </Button>
              </Link>
              <Link to="/profile/me">
                <Button variant="outline" fullWidth className="flex flex-col items-center py-6 space-y-2">
                  <UserCircleIcon className="h-8 w-8" />
                  <span>My Profile</span>
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Pending Interests */}
        {interests.length > 0 && (
          <FadeIn delay={0.4}>
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Pending Interests</h2>
                <Link to="/interests">
                  <Button size="sm" variant="outline">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {interests.map((interest) => (
                  <div key={interest._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={interest.sender?.profile?.photos?.find(p => p.isPrimary)?.url || '/default-avatar.png'}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {interest.sender?.profile?.firstName} {interest.sender?.profile?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {interest.sender?.profile?.age} years • {interest.sender?.profile?.address?.city}
                        </p>
                      </div>
                    </div>
                    <Link to="/interests">
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Suggested Matches */}
        <FadeIn delay={0.5}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Suggested Matches For You</h2>
              <Link to="/matches">
                <Button variant="outline">View All Matches</Button>
              </Link>
            </div>

            {matches.length === 0 ? (
              <div className="card p-12 text-center">
                <HeartParticles />
                <p className="text-gray-500 mt-4">
                  Update your preferences to get better matches
                </p>
                <Link to="/profile/edit">
                  <Button className="mt-4">Update Preferences</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match, index) => (
                  <ScaleIn key={match.profile._id} delay={index * 0.1}>
                    <MatchCard match={match} />
                  </ScaleIn>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Dashboard;
