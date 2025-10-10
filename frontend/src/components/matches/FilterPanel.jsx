import React from 'react';
import Select from '../common/Select';

const FilterPanel = ({ sortBy, onSortChange, verifiedOnly, onVerifiedChange }) => {
  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Select
            label="Sort By"
            name="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            options={[
              { value: 'recent', label: 'Recently Joined' },
              { value: 'age_asc', label: 'Age: Low to High' },
              { value: 'age_desc', label: 'Age: High to Low' },
              { value: 'views', label: 'Most Viewed' }
            ]}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="verified"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedChange(e.target.checked)}
            className="h-4 w-4 text-love focus:ring-love border-gray-300 rounded"
          />
          <label htmlFor="verified" className="text-sm font-medium text-gray-700">
            Verified Profiles Only
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
