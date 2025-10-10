import React, { useState, useEffect } from 'react';
import { getPreferences } from '../../api/userApi';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PencilIcon } from '@heroicons/react/24/outline';

const PreferenceList = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await getPreferences();
      setPreferences(response.data.preferences);
    } catch (error) {
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!preferences) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600 mb-4">You haven't set your partner preferences yet</p>
        <Link to="/settings?tab=preferences">
          <Button>Set Preferences</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Your Partner Preferences</h3>
        <Link to="/settings?tab=preferences">
          <Button size="sm" variant="outline" className="flex items-center space-x-2">
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Age Range */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Age Range</h4>
          <p className="text-gray-900">
            {preferences.ageRange?.min} - {preferences.ageRange?.max} years
          </p>
        </div>

        {/* Height Range */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Height Range</h4>
          <p className="text-gray-900">
            {preferences.heightRange?.min} - {preferences.heightRange?.max} cm
          </p>
        </div>

        {/* Marital Status */}
        {preferences.maritalStatus && preferences.maritalStatus.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Marital Status</h4>
            <div className="flex flex-wrap gap-2">
              {preferences.maritalStatus.map((status, index) => (
                <Badge key={index} variant="primary">
                  {status.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Religion */}
        {preferences.religion && preferences.religion.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Religion</h4>
            <div className="flex flex-wrap gap-2">
              {preferences.religion.map((rel, index) => (
                <Badge key={index} variant="info">
                  {rel}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {preferences.education && preferences.education.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Education</h4>
            <div className="flex flex-wrap gap-2">
              {preferences.education.map((edu, index) => (
                <Badge key={index} variant="success">
                  {edu}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {preferences.location && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Preferred Location</h4>
            <div className="space-y-1">
              {preferences.location.country && preferences.location.country.length > 0 && (
                <p className="text-gray-900">
                  <span className="font-medium">Countries:</span>{' '}
                  {preferences.location.country.join(', ')}
                </p>
              )}
              {preferences.location.state && preferences.location.state.length > 0 && (
                <p className="text-gray-900">
                  <span className="font-medium">States:</span>{' '}
                  {preferences.location.state.join(', ')}
                </p>
              )}
              {preferences.location.city && preferences.location.city.length > 0 && (
                <p className="text-gray-900">
                  <span className="font-medium">Cities:</span>{' '}
                  {preferences.location.city.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferenceList;
