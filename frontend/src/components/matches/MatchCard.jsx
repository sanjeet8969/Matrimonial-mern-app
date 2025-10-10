import React, { useState } from 'react';
import ProfileCard from '../profile/ProfileCard';
import Badge from '../common/Badge';

const MatchCard = ({ match }) => {
  const profile = match.profile;
  const matchScore = match.matchScore;

  return (
    <div className="relative">
      {matchScore && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant={matchScore >= 80 ? 'success' : matchScore >= 60 ? 'primary' : 'warning'}>
            {matchScore}% Match
          </Badge>
        </div>
      )}
      <ProfileCard profile={profile} />
    </div>
  );
};

export default MatchCard;
