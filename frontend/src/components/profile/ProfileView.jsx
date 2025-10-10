import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileById } from '../../api/profileApi';
import { sendInterest } from '../../api/interestApi';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { 
  MapPinIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const ProfileView = ({ profileId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (profileId) {
      loadProfile();
    }
  }, [profileId]);

  const loadProfile = async () => {
    try {
      const response = await getProfileById(profileId);
      setProfile(response.data.profile);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async () => {
    setSending(true);
    try {
      await sendInterest(profile.user._id, interestMessage);
      toast.success('Interest sent successfully!');
      setShowInterestModal(false);
      setInterestMessage('');
    } catch (error) {
      toast.error('Failed to send interest');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <div>Profile not found</div>;

  const age = profile.age;
  const primaryPhoto = profile.photos?.find(p => p.isPrimary)?.url || '/default-avatar.png';

  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-love-light to-love p-6 text-white rounded-t-lg">
          <div className="flex items-center space-x-6">
            <img
              src={primaryPhoto}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-lg mt-1">{age} years • {profile.height} cm</p>
              <div className="flex items-center mt-2">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>{profile.address?.city}, {profile.address?.state}</span>
              </div>
              {profile.isProfileVerified && (
                <Badge variant="success" className="mt-2">Verified Profile</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* About Section */}
          {profile.aboutMe && (
            <div>
              <h3 className="text-xl font-semibold mb-3">About</h3>
              <p className="text-gray-700">{profile.aboutMe}</p>
            </div>
          )}

          {/* Basic Details */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Basic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Marital Status</p>
                <p className="font-medium capitalize">{profile.maritalStatus?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Religion</p>
                <p className="font-medium">{profile.religion}</p>
              </div>
              {profile.caste && (
                <div>
                  <p className="text-gray-500 text-sm">Caste</p>
                  <p className="font-medium">{profile.caste}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-sm">Diet</p>
                <p className="font-medium capitalize">{profile.lifestyle?.diet}</p>
              </div>
            </div>
          </div>

          {/* Education & Career */}
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <AcademicCapIcon className="h-6 w-6 mr-2 text-love" />
              Education & Career
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm">Highest Qualification</p>
                <p className="font-medium">{profile.education?.highestQualification}</p>
              </div>
              {profile.education?.institution && (
                <div>
                  <p className="text-gray-500 text-sm">Institution</p>
                  <p className="font-medium">{profile.education.institution}</p>
                </div>
              )}
              {profile.education?.occupation && (
                <div>
                  <p className="text-gray-500 text-sm">Occupation</p>
                  <p className="font-medium">{profile.education.occupation}</p>
                </div>
              )}
              {profile.education?.organization && (
                <div>
                  <p className="text-gray-500 text-sm">Organization</p>
                  <p className="font-medium">{profile.education.organization}</p>
                </div>
              )}
              {profile.education?.annualIncome && (
                <div>
                  <p className="text-gray-500 text-sm">Annual Income</p>
                  <p className="font-medium">{profile.education.annualIncome}</p>
                </div>
              )}
            </div>
          </div>

          {/* Family Details */}
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <UserGroupIcon className="h-6 w-6 mr-2 text-love" />
              Family Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {profile.family?.fatherName && (
                <div>
                  <p className="text-gray-500 text-sm">Father's Name</p>
                  <p className="font-medium">{profile.family.fatherName}</p>
                </div>
              )}
              {profile.family?.fatherOccupation && (
                <div>
                  <p className="text-gray-500 text-sm">Father's Occupation</p>
                  <p className="font-medium">{profile.family.fatherOccupation}</p>
                </div>
              )}
              {profile.family?.motherName && (
                <div>
                  <p className="text-gray-500 text-sm">Mother's Name</p>
                  <p className="font-medium">{profile.family.motherName}</p>
                </div>
              )}
              {profile.family?.familyType && (
                <div>
                  <p className="text-gray-500 text-sm">Family Type</p>
                  <p className="font-medium capitalize">{profile.family.familyType}</p>
                </div>
              )}
              {profile.family?.familyValues && (
                <div>
                  <p className="text-gray-500 text-sm">Family Values</p>
                  <p className="font-medium capitalize">{profile.family.familyValues}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery */}
          {profile.photos && profile.photos.length > 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {profile.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button
              onClick={() => setShowInterestModal(true)}
              className="flex items-center space-x-2"
              fullWidth
            >
              <HeartIcon className="h-5 w-5" />
              <span>Send Interest</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      <Modal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        title="Send Interest"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Send an interest to {profile.firstName}. Add a personal message to introduce yourself.
          </p>
          <textarea
            value={interestMessage}
            onChange={(e) => setInterestMessage(e.target.value)}
            rows="4"
            className="input-field resize-none"
            placeholder="Write a brief message (optional)..."
            maxLength={500}
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowInterestModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInterest} disabled={sending}>
              {sending ? 'Sending...' : 'Send Interest'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileView;
