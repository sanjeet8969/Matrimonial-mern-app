import express from 'express';
import {
  getPlans,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
  getSubscriptionHistory
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getPlans);
router.get('/current', protect, getCurrentSubscription);
router.post('/', protect, createSubscription);
router.put('/cancel', protect, cancelSubscription);
router.get('/history', protect, getSubscriptionHistory);

export default router;
