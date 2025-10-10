import React, { useState } from 'react';
import { searchProfiles } from '../api/matchApi';
import AdvancedSearch from '../components/matches/AdvancedSearch';
import FilterPanel from '../components/matches/FilterPanel';
import MatchList from '../components/matches/MatchList';
import { FadeIn } from '../components/animations/ScrollAnimations';
import toast from 'react-hot-toast';

const Search = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const response = await searchProfiles({
        ...filters,
        sortBy,
        verifiedOnly
      });
      setProfiles(response.data.profiles.map(p => ({ profile: p })));
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-4xl font-bold mb-8 text-center">Advanced Search</h1>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FadeIn delay={0.1}>
              <AdvancedSearch onSearch={handleSearch} />
            </FadeIn>
          </div>

          <div className="lg:col-span-3">
            <FadeIn delay={0.2}>
              <FilterPanel
                sortBy={sortBy}
                onSortChange={setSortBy}
                verifiedOnly={verifiedOnly}
                onVerifiedChange={setVerifiedOnly}
              />
              <MatchList matches={profiles} loading={loading} />
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
