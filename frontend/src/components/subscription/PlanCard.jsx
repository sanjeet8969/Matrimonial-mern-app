import React from 'react';
import Button from '../common/Button';
import { CheckIcon } from '@heroicons/react/24/solid';

const PlanCard = ({ plan, isPopular = false, onSelect, isCurrentPlan = false }) => {
  const features = [
    {
      key: 'contactViewLimit',
      label: plan.features.contactViewLimit === -1 ? 'Unlimited Contact Views' : `View ${plan.features.contactViewLimit} Contacts`,
      included: plan.features.contactViewLimit > 0 || plan.features.contactViewLimit === -1
    },
    {
      key: 'chatLimit',
      label: plan.features.chatLimit === -1 ? 'Unlimited Messages' : `${plan.features.chatLimit} Messages/Day`,
      included: true
    },
    {
      key: 'advancedSearch',
      label: 'Advanced Search Filters',
      included: plan.features.advancedSearch
    },
    {
      key: 'profileBoost',
      label: 'Profile Boost',
      included: plan.features.profileBoost
    },
    {
      key: 'featuredProfile',
      label: 'Featured Profile',
      included: plan.features.featuredProfile
    },
    {
      key: 'hideAds',
      label: 'Ad-Free Experience',
      included: plan.features.hideAds
    }
  ];

  return (
    <div
      className={`card p-6 relative ${
        isPopular ? 'border-2 border-love shadow-2xl transform scale-105' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-love text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Current Plan
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center space-x-2">
          <span className="text-4xl font-bold text-love">₹{plan.price}</span>
          {plan.duration > 0 && (
            <span className="text-gray-500">/ {plan.duration} days</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature) => (
          <li key={feature.key} className="flex items-start space-x-3">
            <CheckIcon
              className={`h-5 w-5 flex-shrink-0 ${
                feature.included ? 'text-green-500' : 'text-gray-300'
              }`}
            />
            <span
              className={`text-sm ${
                feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
              }`}
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelect(plan)}
        variant={isPopular ? 'primary' : 'outline'}
        fullWidth
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Free Forever' : 'Select Plan'}
      </Button>
    </div>
  );
};

export default PlanCard;
