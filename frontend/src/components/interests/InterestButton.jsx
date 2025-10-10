import React, { useState } from 'react';
import { sendInterest } from '../../api/interestApi';
import Button from '../common/Button';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { HeartIcon } from '@heroicons/react/24/outline';

const InterestButton = ({ userId, userName, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendInterest = async () => {
    setSending(true);
    try {
      await sendInterest(userId, message);
      toast.success('Interest sent successfully!');
      setShowModal(false);
      setMessage('');
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send interest';
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2"
      >
        <HeartIcon className="h-5 w-5" />
        <span>Send Interest</span>
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Send Interest"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Send an interest to {userName}. Add a personal message to make a great first impression.
          </p>
          
          <div>
            <label className="label">Personal Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="input-field resize-none"
              placeholder="Introduce yourself and share why you're interested..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInterest}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Interest'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InterestButton;
