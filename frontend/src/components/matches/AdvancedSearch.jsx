import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const AdvancedSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    gender: '',
    ageMin: '',
    ageMax: '',
    heightMin: '',
    heightMax: '',
    religion: '',
    maritalStatus: '',
    city: '',
    state: '',
    education: '',
    occupation: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleReset = () => {
    setFilters({
      gender: '',
      ageMin: '',
      ageMax: '',
      heightMin: '',
      heightMax: '',
      religion: '',
      maritalStatus: '',
      city: '',
      state: '',
      education: '',
      occupation: ''
    });
  };

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">Advanced Search</h3>
      
      <Select
        label="Gender"
        name="gender"
        value={filters.gender}
        onChange={handleChange}
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' }
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Age From"
          type="number"
          name="ageMin"
          value={filters.ageMin}
          onChange={handleChange}
          placeholder="Min"
        />
        <Input
          label="Age To"
          type="number"
          name="ageMax"
          value={filters.ageMax}
          onChange={handleChange}
          placeholder="Max"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Height From (cm)"
          type="number"
          name="heightMin"
          value={filters.heightMin}
          onChange={handleChange}
          placeholder="Min"
        />
        <Input
          label="Height To (cm)"
          type="number"
          name="heightMax"
          value={filters.heightMax}
          onChange={handleChange}
          placeholder="Max"
        />
      </div>

      <Input
        label="Religion"
        name="religion"
        value={filters.religion}
        onChange={handleChange}
      />

      <Select
        label="Marital Status"
        name="maritalStatus"
        value={filters.maritalStatus}
        onChange={handleChange}
        options={[
          { value: 'never_married', label: 'Never Married' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' }
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          value={filters.city}
          onChange={handleChange}
        />
        <Input
          label="State"
          name="state"
          value={filters.state}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Education"
        name="education"
        value={filters.education}
        onChange={handleChange}
      />

      <Input
        label="Occupation"
        name="occupation"
        value={filters.occupation}
        onChange={handleChange}
      />

      <div className="flex space-x-3">
        <Button onClick={handleSearch} fullWidth>
          Search
        </Button>
        <Button variant="secondary" onClick={handleReset} fullWidth>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSearch;
