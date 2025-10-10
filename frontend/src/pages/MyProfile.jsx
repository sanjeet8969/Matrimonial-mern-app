import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile } from '../api/profileApi';
import PhotoGallery from '../components/profile/PhotoGallery';
import PhotoUpload from '../components/profile/PhotoUpload';
import VerificationStatus from '../components/profile/VerificationStatus';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { FadeIn } from '../components/animations/ScrollAnimations';
import toast from 'react-hot-toast';
import {
  PencilIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getMyProfile();
      setProfile(response.data.profile);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="card p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <img
                  src={profile.photos?.find(p => p.isPrimary)?.url || '/default-avatar.png'}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-love"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    {profile.age} years • {profile.height} cm
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">
                      {profile.address?.city}, {profile.address?.state}
                    </span>
                  </div>
                  {profile.isProfileVerified && (
                    <Badge variant="success" className="mt-2">
                      Verified Profile
                    </Badge>
                  )}
                </div>
              </div>
              <Link to="/profile/edit">
                <Button className="flex items-center space-x-2">
                  <PencilIcon className="h-5 w-5" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Verification Status */}
        {profile.idProof && (
          <FadeIn delay={0.1}>
            <div className="mb-8">
              <VerificationStatus
                status={profile.idProof.verificationStatus}
                rejectionReason={profile.idProof.rejectionReason}
              />
            </div>
          </FadeIn>
        )}

        {/* About Section */}
        {profile.aboutMe && (
          <FadeIn delay={0.2}>
            <div className="card p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{profile.aboutMe}</p>
            </div>
          </FadeIn>
        )}

        {/* Basic Details */}
        <FadeIn delay={0.3}>
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="font-semibold capitalize">
                  {profile.maritalStatus?.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Religion</p>
                <p className="font-semibold">{profile.religion}</p>
              </div>
              {profile.caste && (
                <div>
                  <p className="text-sm text-gray-500">Caste</p>
                  <p className="font-semibold">{profile.caste}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Diet</p>
                <p className="font-semibold capitalize">{profile.lifestyle?.diet}</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Education & Career */}
        <FadeIn delay={0.4}>
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AcademicCapIcon className="h-6 w-6 mr-2 text-love" />
              Education & Career
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Highest Qualification</p>
                <p className="font-semibold">{profile.education?.highestQualification}</p>
              </div>
              {profile.education?.occupation && (
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-semibold">{profile.education.occupation}</p>
                </div>
              )}
              {profile.education?.organization && (
                <div>
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="font-semibold">{profile.education.organization}</p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Family Details */}
        <FadeIn delay={0.5}>
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <UserGroupIcon className="h-6 w-6 mr-2 text-love" />
              Family Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.family?.fatherName && (
                <div>
                  <p className="text-sm text-gray-500">Father's Name</p>
                  <p className="font-semibold">{profile.family.fatherName}</p>
                </div>
              )}
              {profile.family?.motherName && (
                <div>
                  <p className="text-sm text-gray-500">Mother's Name</p>
                  <p className="font-semibold">{profile.family.motherName}</p>
                </div>
              )}
              {profile.family?.familyType && (
                <div>
                  <p className="text-sm text-gray-500">Family Type</p>
                  <p className="font-semibold capitalize">{profile.family.familyType}</p>
                </div>
              )}
              {profile.family?.familyValues && (
                <div>
                  <p className="text-sm text-gray-500">Family Values</p>
                  <p className="font-semibold capitalize">{profile.family.familyValues}</p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Photo Gallery */}
        <FadeIn delay={0.6}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Photo Gallery</h2>
              <Button onClick={() => setShowPhotoUpload(true)} size="sm">
                Add Photo
              </Button>
            </div>
            <PhotoGallery photos={profile.photos} onUpdate={loadProfile} />
          </div>
        </FadeIn>

        {/* Photo Upload Modal */}
        <Modal
          isOpen={showPhotoUpload}
          onClose={() => setShowPhotoUpload(false)}
          title="Upload Photo"
        >
          <PhotoUpload
            onUploadSuccess={() => {
              setShowPhotoUpload(false);
              loadProfile();
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default MyProfile;
