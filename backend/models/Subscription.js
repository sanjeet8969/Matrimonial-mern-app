import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'silver', 'gold', 'platinum'],
    default: 'free'
  },
  features: {
    contactViewLimit: {
      type: Number,
      default: 0 // 0 for free, unlimited for premium
    },
    chatLimit: {
      type: Number,
      default: 5 // messages per day for free
    },
    profileBoost: {
      type: Boolean,
      default: false
    },
    featuredProfile: {
      type: Boolean,
      default: false
    },
    advancedSearch: {
      type: Boolean,
      default: false
    },
    hideAds: {
      type: Boolean,
      default: false
    }
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in days
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Subscription', subscriptionSchema);
