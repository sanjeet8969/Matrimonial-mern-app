import React, { useState } from 'react';
import { MapPinIcon, BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import ProfileView from './ProfileView';

const ProfileCard = ({ profile }) => {
  const [showProfile, setShowProfile] = useState(false);
  
  const age = profile.age;
  const primaryPhoto = profile.photos?.find(p => p.isPrimary)?.url || '/default-avatar.png';

  return (
    <>
      <div className="card overflow-hidden cursor-pointer" onClick={() => setShowProfile(true)}>
        <div className="relative h-64">
          <img
            src={primaryPhoto}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-full h-full object-cover"
          />
          {profile.isProfileVerified && (
            <div className="absolute top-4 right-4">
              <Badge variant="success">Verified</Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-gray-600 mt-1">{age} years, {profile.height} cm</p>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>{profile.address?.city}, {profile.address?.state}</span>
            </div>
            
            {profile.education?.highestQualification && (
              <div className="flex items-center text-sm text-gray-600">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                <span>{profile.education.highestQualification}</span>
              </div>
            )}
            
            {profile.education?.occupation && (
              <div className="flex items-center text-sm text-gray-600">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                <span>{profile.education.occupation}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">{profile.religion}</span>
            <span className="text-xs text-gray-400">{profile.maritalStatus?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Profile Details"
        size="lg"
      >
        <ProfileView profileId={profile._id} onClose={() => setShowProfile(false)} />
      </Modal>
    </>
  );
};

export default ProfileCard;
