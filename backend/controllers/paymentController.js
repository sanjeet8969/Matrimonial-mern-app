import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a new order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency, receipt, subscriptionPlanId } = req.body;

  const options = {
    amount: amount * 100, // amount in smallest currency unit (e.g., paise for INR)
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);

    // Save payment details to database
    const payment = new Payment({
      user: req.user._id,
      orderId: order.id,
      amount,
      currency,
      status: 'created',
      subscriptionPlan: subscriptionPlanId,
    });
    await payment.save();

    res.status(201).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, subscriptionPlanId } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'completed';
    payment.paidAt = Date.now();
    await payment.save();

    // Update user's subscription status
    const user = await User.findById(req.user._id);
    if (user) {
      const subscriptionPlan = await Subscription.findById(subscriptionPlanId);
      if (subscriptionPlan) {
        user.isPremium = true;
        user.subscription = subscriptionPlan._id;
        user.subscriptionExpires = new Date(Date.now() + subscriptionPlan.duration * 24 * 60 * 60 * 1000); // duration in days
        await user.save();
      }
    }

    res.json({ message: 'Payment verified successfully', success: true });
  } else {
    const payment = await Payment.findOne({ orderId });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }
    res.status(400).json({ message: 'Payment verification failed', success: false });
  }
});

// @desc    Get payment history for a user
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({ paidAt: -1 });
  res.json(payments);
});

export { createOrder, verifyPayment, getPaymentHistory };