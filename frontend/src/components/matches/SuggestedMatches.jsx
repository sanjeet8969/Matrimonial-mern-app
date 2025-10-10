import React, { useState, useEffect } from 'react';
import { getSuggestedMatches } from '../../api/matchApi';
import MatchList from './MatchList';
import toast from 'react-hot-toast';

const SuggestedMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await getSuggestedMatches();
      setMatches(response.data.matches);
    } catch (error) {
      toast.error('Failed to load suggested matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Suggested Matches</h2>
      <MatchList matches={matches} loading={loading} />
    </div>
  );
};

export default SuggestedMatches;
