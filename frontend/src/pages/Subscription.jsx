import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanComparison from '../components/subscription/PlanComparison';
import SubscriptionStatus from '../components/subscription/SubscriptionStatus';
import PaymentForm from '../components/subscription/PaymentForm';
import Modal from '../components/common/Modal';
import { FadeIn } from '../components/animations/ScrollAnimations';

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSelectPlan = (plan) => {
    if (plan.price === 0) return;
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    navigate('/subscription');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-4xl font-bold mb-4 text-center">Subscription Plans</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Choose the perfect plan for your journey
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <PlanComparison onSelectPlan={handleSelectPlan} />
            </FadeIn>
          </div>
          <div className="lg:col-span-1">
            <FadeIn delay={0.2}>
              <SubscriptionStatus />
            </FadeIn>
          </div>
        </div>

        {/* Payment Modal */}
        <Modal
          isOpen={showPayment}
          onClose={() => {
            setShowPayment(false);
            setSelectedPlan(null);
          }}
          title="Complete Your Purchase"
        >
          {selectedPlan && (
            <PaymentForm
              plan={selectedPlan}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Subscription;
