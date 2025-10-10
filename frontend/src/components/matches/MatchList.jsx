import React from 'react';
import MatchCard from './MatchCard';
import Loader from '../common/Loader';

const MatchList = ({ matches, loading }) => {
  if (loading) return <Loader />;

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No matches found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard key={match.profile._id} match={match} />
      ))}
    </div>
  );
};

export default MatchList;
