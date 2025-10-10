import React, { useState, useEffect } from 'react';
import { getSentInterests } from '../../api/interestApi';
import InterestList from './InterestList';
import toast from 'react-hot-toast';

const SentInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const response = await getSentInterests();
      setInterests(response.data.interests);
    } catch (error) {
      toast.error('Failed to load sent interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sent Interests</h2>
        <span className="text-sm text-gray-500">
          {interests.length} {interests.length === 1 ? 'interest' : 'interests'}
        </span>
      </div>
      
      <InterestList
        interests={interests}
        loading={loading}
        type="sent"
        onUpdate={loadInterests}
      />
    </div>
  );
};

export default SentInterests;
