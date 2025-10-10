import express from 'express';
import {
  getSuggestedMatches,
  searchProfiles,
  getRecentProfiles,
  getNearbyProfiles
} from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/suggested', protect, getSuggestedMatches);
router.get('/search', protect, searchProfiles);
router.get('/recent', protect, getRecentProfiles);
router.get('/nearby', protect, getNearbyProfiles);

export default router;
