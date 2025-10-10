import React, { useState, useEffect } from 'react';
import { getMyProfile, updatePrivacySettings } from '../../api/profileApi';
import Select from '../common/Select';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    showPhotos: 'everyone',
    showContact: 'accepted_interests',
    profileVisibility: 'visible'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await getMyProfile();
      if (response.data.profile.privacy) {
        setSettings(response.data.profile.privacy);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePrivacySettings(settings);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Select
        label="Who can see your photos?"
        name="showPhotos"
        value={settings.showPhotos}
        onChange={handleChange}
        options={[
          { value: 'everyone', label: 'Everyone' },
          { value: 'premium_members', label: 'Premium Members Only' },
          { value: 'accepted_interests', label: 'Only Accepted Interests' }
        ]}
      />

      <Select
        label="Who can see your contact details?"
        name="showContact"
        value={settings.showContact}
        onChange={handleChange}
        options={[
          { value: 'everyone', label: 'Everyone' },
          { value: 'premium_members', label: 'Premium Members Only' },
          { value: 'accepted_interests', label: 'Only Accepted Interests' }
        ]}
      />

      <Select
        label="Profile Visibility"
        name="profileVisibility"
        value={settings.profileVisibility}
        onChange={handleChange}
        options={[
          { value: 'visible', label: 'Visible to All' },
          { value: 'hidden', label: 'Hidden from Search' }
        ]}
      />

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
};

export default PrivacySettings;
