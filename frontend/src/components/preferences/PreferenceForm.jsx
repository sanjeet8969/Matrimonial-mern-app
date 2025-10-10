import React, { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from '../../api/profileApi';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const PreferenceForm = () => {
  const [preferences, setPreferences] = useState({
    ageRange: { min: 21, max: 35 },
    heightRange: { min: 150, max: 180 },
    maritalStatus: [],
    religion: [],
    location: { country: [], state: [], city: [] }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await getPreferences();
      if (response.data.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPreferences({
        ...preferences,
        [parent]: {
          ...preferences[parent],
          [child]: value
        }
      });
    } else {
      setPreferences({ ...preferences, [name]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences(preferences);
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Partner Preferences</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Minimum Age"
          type="number"
          name="ageRange.min"
          value={preferences.ageRange.min}
          onChange={handleChange}
          min="18"
          max="100"
        />
        <Input
          label="Maximum Age"
          type="number"
          name="ageRange.max"
          value={preferences.ageRange.max}
          onChange={handleChange}
          min="18"
          max="100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Minimum Height (cm)"
          type="number"
          name="heightRange.min"
          value={preferences.heightRange.min}
          onChange={handleChange}
        />
        <Input
          label="Maximum Height (cm)"
          type="number"
          name="heightRange.max"
          value={preferences.heightRange.max}
          onChange={handleChange}
        />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
};

export default PreferenceForm;
