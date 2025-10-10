import React, { useState } from 'react';
import { createPaymentOrder, verifyPayment } from '../../api/subscriptionApi';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const PaymentForm = ({ plan, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Failed to load payment gateway');
        setProcessing(false);
        return;
      }

      // Create order
      const orderResponse = await createPaymentOrder({
        amount: plan.price,
        plan: plan.plan,
        duration: plan.duration,
        features: plan.features
      });

      const { order, subscriptionId } = orderResponse.data;

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Matrimonial',
        description: `${plan.name} Plan Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId
            });
            toast.success('Payment successful! Your subscription is now active.');
            if (onSuccess) onSuccess();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#ff1744'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Plan:</span>
          <span className="font-semibold">{plan.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration:</span>
          <span className="font-semibold">{plan.duration} days</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-3">
          <span>Total Amount:</span>
          <span className="text-love">₹{plan.price}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handlePayment}
          disabled={processing}
          fullWidth
        >
          {processing ? 'Processing...' : 'Proceed to Payment'}
        </Button>
        <Button
          onClick={onCancel}
          variant="secondary"
          fullWidth
        >
          Cancel
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
