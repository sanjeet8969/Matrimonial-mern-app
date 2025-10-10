import React from 'react';
import SuggestedMatches from '../components/matches/SuggestedMatches';
import { FadeIn } from '../components/animations/ScrollAnimations';

const Matches = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SuggestedMatches />
        </FadeIn>
      </div>
    </div>
  );
};

export default Matches;
