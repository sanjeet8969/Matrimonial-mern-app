import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { resendOTP } from '../../api/authApi';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const location = useLocation();
  const userId = location.state?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOTP(userId, otp);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(userId);
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Verify Your Email
          </h2>
          <p className="text-center text-gray-600 mb-8">
            We've sent a 6-digit code to your email. Please enter it below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="OTP Code"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              className="text-love hover:text-love-dark font-semibold"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
