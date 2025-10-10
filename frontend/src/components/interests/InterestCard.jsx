import React, { useState } from 'react';
import { acceptInterest, rejectInterest, cancelInterest } from '../../api/interestApi';
import { getOrCreateChat } from '../../api/chatApi';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import ProfileView from '../profile/ProfileView';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { CheckIcon, XMarkIcon, ChatBubbleLeftIcon, EyeIcon } from '@heroicons/react/24/outline';

const InterestCard = ({ interest, type, onUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const user = type === 'received' ? interest.sender : interest.receiver;
  const profile = user?.profile;

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptInterest(interest._id);
      toast.success('Interest accepted!');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to accept interest');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this interest?')) return;
    
    setLoading(true);
    try {
      await rejectInterest(interest._id);
      toast.success('Interest rejected');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to reject interest');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this interest?')) return;
    
    setLoading(true);
    try {
      await cancelInterest(interest._id);
      toast.success('Interest cancelled');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to cancel interest');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const response = await getOrCreateChat(user._id);
      navigate('/messages', { state: { chatId: response.data.chat._id } });
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const getStatusBadge = () => {
    const variants = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger',
      cancelled: 'default'
    };
    return (
      <Badge variant={variants[interest.status] || 'default'}>
        {interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <div className="card p-4">
        <div className="flex items-start space-x-4">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <img
              src={profile?.photos?.find(p => p.isPrimary)?.url || '/default-avatar.png'}
              alt={`${profile?.firstName} ${profile?.lastName}`}
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {profile?.age} years • {profile?.address?.city}, {profile?.address?.state}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {profile?.education?.occupation}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge()}
              </div>
            </div>

            {/* Message */}
            {interest.message && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 italic">"{interest.message}"</p>
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs text-gray-500 mt-2">
              {type === 'received' ? 'Received' : 'Sent'}{' '}
              {formatDistanceToNow(new Date(interest.createdAt), { addSuffix: true })}
            </p>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-1"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View Profile</span>
              </Button>

              {type === 'received' && interest.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={handleAccept}
                    disabled={loading}
                    className="flex items-center space-x-1"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>Accept</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={handleReject}
                    disabled={loading}
                    className="flex items-center space-x-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Reject</span>
                  </Button>
                </>
              )}

              {type === 'sent' && interest.status === 'pending' && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel Interest
                </Button>
              )}

              {interest.status === 'accepted' && (
                <Button
                  size="sm"
                  onClick={handleStartChat}
                  className="flex items-center space-x-1"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span>Start Chat</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Profile Details"
        size="lg"
      >
        <ProfileView profileId={profile?._id} onClose={() => setShowProfile(false)} />
      </Modal>
    </>
  );
};

export default InterestCard;
