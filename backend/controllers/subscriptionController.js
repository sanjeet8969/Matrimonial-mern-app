import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
export const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        plan: 'free',
        name: 'Free',
        price: 0,
        duration: 0,
        features: {
          contactViewLimit: 0,
          chatLimit: 5,
          profileBoost: false,
          featuredProfile: false,
          advancedSearch: false,
          hideAds: false
        },
        description: 'Basic features to get started'
      },
      {
        plan: 'silver',
        name: 'Silver',
        price: 999,
        duration: 30,
        features: {
          contactViewLimit: 20,
          chatLimit: 100,
          profileBoost: false,
          featuredProfile: false,
          advancedSearch: true,
          hideAds: true
        },
        description: 'Perfect for active users'
      },
      {
        plan: 'gold',
        name: 'Gold',
        price: 2499,
        duration: 90,
        features: {
          contactViewLimit: 50,
          chatLimit: -1, // unlimited
          profileBoost: true,
          featuredProfile: false,
          advancedSearch: true,
          hideAds: true
        },
        description: 'Most popular choice'
      },
      {
        plan: 'platinum',
        name: 'Platinum',
        price: 4999,
        duration: 180,
        features: {
          contactViewLimit: -1, // unlimited
          chatLimit: -1, // unlimited
          profileBoost: true,
          featuredProfile: true,
          advancedSearch: true,
          hideAds: true
        },
        description: 'Premium features for serious seekers'
      }
    ];

    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current subscription
// @route   GET /api/subscriptions/current
// @access  Private
export const getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      isActive: true
    });

    if (!subscription) {
      // Return default free plan
      return res.status(200).json({
        success: true,
        subscription: {
          plan: 'free',
          features: {
            contactViewLimit: 0,
            chatLimit: 5,
            profileBoost: false,
            featuredProfile: false,
            advancedSearch: false,
            hideAds: false
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Private
export const createSubscription = async (req, res) => {
  try {
    const { plan, duration, price, features } = req.body;

    // Check if user has active subscription
    const activeSubscription = await Subscription.findOne({
      user: req.user.id,
      isActive: true
    });

    if (activeSubscription) {
      return res.status(400).json({ 
        message: 'You already have an active subscription' 
      });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const subscription = await Subscription.create({
      user: req.user.id,
      plan,
      features,
      price,
      duration,
      endDate,
      isActive: true
    });

    // Update user subscription reference
    await User.findByIdAndUpdate(req.user.id, {
      subscription: subscription._id
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/cancel
// @access  Private
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      isActive: true
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    subscription.autoRenew = false;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription will not auto-renew',
      subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get subscription history
// @route   GET /api/subscriptions/history
// @access  Private
export const getSubscriptionHistory = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    console.error('Get subscription history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
