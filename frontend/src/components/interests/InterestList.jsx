import React from 'react';
import InterestCard from './InterestCard';
import Loader from '../common/Loader';

const InterestList = ({ interests, loading, type = 'received', onUpdate }) => {
  if (loading) return <Loader />;

  if (!interests || interests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {type === 'received' ? 'No interests received yet' : 'No interests sent yet'}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          {type === 'received' 
            ? 'When someone sends you an interest, it will appear here' 
            : 'Send interests to profiles you like'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interests.map((interest) => (
        <InterestCard
          key={interest._id}
          interest={interest}
          type={type}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default InterestList;
