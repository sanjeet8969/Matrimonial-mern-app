import React from 'react';
import Badge from '../common/Badge';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const VerificationStatus = ({ status, rejectionReason }) => {
  const statusConfig = {
    pending: {
      icon: ClockIcon,
      badge: 'warning',
      text: 'Verification Pending',
      message: 'Your verification request is under review. This usually takes 24-48 hours.'
    },
    approved: {
      icon: CheckCircleIcon,
      badge: 'success',
      text: 'Verified Profile',
      message: 'Your profile has been verified successfully!'
    },
    rejected: {
      icon: XCircleIcon,
      badge: 'danger',
      text: 'Verification Rejected',
      message: rejectionReason || 'Your verification was rejected. Please resubmit with valid documents.'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="card p-6">
      <div className="flex items-start space-x-4">
        <Icon className={`h-12 w-12 ${
          status === 'approved' ? 'text-green-500' :
          status === 'rejected' ? 'text-red-500' :
          'text-yellow-500'
        }`} />
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold">{config.text}</h3>
            <Badge variant={config.badge}>{status}</Badge>
          </div>
          <p className="text-gray-600">{config.message}</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
