import React, { useState, useEffect } from 'react';
import { getPlans, getCurrentSubscription } from '../../api/subscriptionApi';
import PlanCard from './PlanCard';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const PlanComparison = ({ onSelectPlan }) => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await getPlans();
      setPlans(response.data.plans);
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await getCurrentSubscription();
      setCurrentPlan(response.data.subscription?.plan);
    } catch (error) {
      console.error('Failed to load current subscription');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Perfect Plan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upgrade to premium and get access to exclusive features to find your perfect match faster
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.plan}
            plan={plan}
            isPopular={plan.plan === 'gold'}
            isCurrentPlan={currentPlan === plan.plan}
            onSelect={onSelectPlan}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          All plans come with a 7-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default PlanComparison;
