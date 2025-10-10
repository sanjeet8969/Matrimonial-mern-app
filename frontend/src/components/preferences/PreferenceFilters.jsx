import React from 'react';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';

const PreferenceFilters = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">Filter Matches</h3>

      {/* Age Filter */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Min Age"
          type="number"
          name="ageMin"
          value={filters.ageMin || ''}
          onChange={handleChange}
          placeholder="18"
          min="18"
          max="100"
        />
        <Input
          label="Max Age"
          type="number"
          name="ageMax"
          value={filters.ageMax || ''}
          onChange={handleChange}
          placeholder="60"
          min="18"
          max="100"
        />
      </div>

      {/* Height Filter */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Min Height (cm)"
          type="number"
          name="heightMin"
          value={filters.heightMin || ''}
          onChange={handleChange}
          placeholder="150"
        />
        <Input
          label="Max Height (cm)"
          type="number"
          name="heightMax"
          value={filters.heightMax || ''}
          onChange={handleChange}
          placeholder="200"
        />
      </div>

      {/* Marital Status */}
      <Select
        label="Marital Status"
        name="maritalStatus"
        value={filters.maritalStatus || ''}
        onChange={handleChange}
        options={[
          { value: 'never_married', label: 'Never Married' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' },
          { value: 'separated', label: 'Separated' }
        ]}
      />

      {/* Religion */}
      <Select
        label="Religion"
        name="religion"
        value={filters.religion || ''}
        onChange={handleChange}
        options={[
          { value: 'hindu', label: 'Hindu' },
          { value: 'muslim', label: 'Muslim' },
          { value: 'christian', label: 'Christian' },
          { value: 'sikh', label: 'Sikh' },
          { value: 'jain', label: 'Jain' },
          { value: 'buddhist', label: 'Buddhist' }
        ]}
      />

      {/* Location */}
      <Input
        label="City"
        name="city"
        value={filters.city || ''}
        onChange={handleChange}
        placeholder="Enter city"
      />

      <Input
        label="State"
        name="state"
        value={filters.state || ''}
        onChange={handleChange}
        placeholder="Enter state"
      />

      {/* Education */}
      <Select
        label="Education"
        name="education"
        value={filters.education || ''}
        onChange={handleChange}
        options={[
          { value: 'high_school', label: 'High School' },
          { value: 'bachelors', label: "Bachelor's Degree" },
          { value: 'masters', label: "Master's Degree" },
          { value: 'phd', label: 'PhD' },
          { value: 'diploma', label: 'Diploma' }
        ]}
      />

      {/* Occupation */}
      <Input
        label="Occupation"
        name="occupation"
        value={filters.occupation || ''}
        onChange={handleChange}
        placeholder="e.g., Software Engineer"
      />

      {/* Verified Only */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="verifiedOnly"
          name="verifiedOnly"
          checked={filters.verifiedOnly || false}
          onChange={(e) =>
            onFilterChange({ ...filters, verifiedOnly: e.target.checked })
          }
          className="h-4 w-4 text-love focus:ring-love border-gray-300 rounded"
        />
        <label htmlFor="verifiedOnly" className="text-sm font-medium text-gray-700">
          Show only verified profiles
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button onClick={onApplyFilters} fullWidth>
          Apply Filters
        </Button>
        <Button onClick={onResetFilters} variant="secondary" fullWidth>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PreferenceFilters;
