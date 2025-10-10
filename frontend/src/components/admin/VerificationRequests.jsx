import React, { useState, useEffect } from 'react';
import { getVerificationRequests, approveVerification, rejectVerification } from '../../api/adminApi';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await getVerificationRequests();
      setRequests(response.data.profiles);
    } catch (error) {
      toast.error('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profileId) => {
    try {
      await approveVerification(profileId);
      toast.success('Profile verified successfully');
      loadRequests();
    } catch (error) {
      toast.error('Failed to approve verification');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await rejectVerification(selectedRequest._id, rejectionReason);
      toast.success('Verification rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
      loadRequests();
    } catch (error) {
      toast.error('Failed to reject verification');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Verification Requests</h2>
      
      {requests.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No pending verification requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((profile) => (
            <div key={profile._id} className="card p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={profile.photos?.find(p => p.isPrimary)?.url || '/default-avatar.png'}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.user.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {profile.age} years • {profile.address?.city}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">ID Type:</span> {profile.idProof?.type?.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">ID Number:</span> {profile.idProof?.number}
                </p>
                {profile.idProof?.document?.url && (
                  <a
                    href={profile.idProof.document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-love hover:underline"
                  >
                    View Document →
                  </a>
                )}
              </div>

              <div className="mt-4 flex space-x-3">
                <Button
                  size="sm"
                  onClick={() => handleApprove(profile._id)}
                  fullWidth
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setSelectedRequest(profile);
                    setShowRejectModal(true);
                  }}
                  fullWidth
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
          setSelectedRequest(null);
        }}
        title="Reject Verification"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Provide a reason for rejecting this verification request.
          </p>
          <Input
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g., Document not clear, Invalid ID, etc."
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VerificationRequests;
