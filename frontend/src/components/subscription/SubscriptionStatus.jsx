import React, { useState, useEffect } from 'react';
import { getCurrentSubscription, cancelSubscription } from '../../api/subscriptionApi';
import { format } from 'date-fns';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await getCurrentSubscription();
      setSubscription(response.data.subscription);
    } catch (error) {
      toast.error('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel auto-renewal?')) return;

    try {
      await cancelSubscription();
      toast.success('Auto-renewal cancelled');
      loadSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  if (loading) return <Loader />;

  const isFree = !subscription || subscription.plan === 'free';

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Current Subscription</h3>
        <Badge variant={isFree ? 'default' : 'primary'}>
          {subscription?.plan?.toUpperCase() || 'FREE'}
        </Badge>
      </div>

      {!isFree && (
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <Badge variant={subscription.isActive ? 'success' : 'danger'}>
              {subscription.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {subscription.startDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">
                {format(new Date(subscription.startDate), 'dd MMM yyyy')}
              </span>
            </div>
          )}

          {subscription.endDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium">
                {format(new Date(subscription.endDate), 'dd MMM yyyy')}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Auto Renewal:</span>
            <span className="font-medium">
              {subscription.autoRenew ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <h4 className="font-semibold mb-3">Features Included:</h4>
        <ul className="space-y-2">
          {subscription?.features && (
            <>
              <li className="flex items-center text-sm">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                {subscription.features.contactViewLimit === -1 
                  ? 'Unlimited Contact Views' 
                  : `${subscription.features.contactViewLimit} Contact Views`}
              </li>
              <li className="flex items-center text-sm">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                {subscription.features.chatLimit === -1 
                  ? 'Unlimited Messages' 
                  : `${subscription.features.chatLimit} Messages/Day`}
              </li>
              {subscription.features.advancedSearch && (
                <li className="flex items-center text-sm">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Advanced Search Filters
                </li>
              )}
              {subscription.features.profileBoost && (
                <li className="flex items-center text-sm">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Profile Boost
                </li>
              )}
              {subscription.features.featuredProfile && (
                <li className="flex items-center text-sm">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Featured Profile
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      {!isFree && subscription?.autoRenew && (
        <div className="mt-6">
          <Button onClick={handleCancel} variant="danger" fullWidth>
            Cancel Auto-Renewal
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
