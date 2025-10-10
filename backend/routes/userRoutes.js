import express from 'express';
import {
  getPreferences,
  updatePreferences,
  blockUser,
  unblockUser,
  getBlockedUsers,
  reportUser,
  updateSettings,
  deactivateAccount
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/preferences', protect, getPreferences);
router.post('/preferences', protect, updatePreferences);
router.post('/block/:userId', protect, blockUser);
router.delete('/block/:userId', protect, unblockUser);
router.get('/blocked', protect, getBlockedUsers);
router.post('/report', protect, reportUser);
router.put('/settings', protect, updateSettings);
router.put('/deactivate', protect, deactivateAccount);

export default router;
