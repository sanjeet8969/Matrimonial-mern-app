import express from 'express';
import {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
  cancelInterest
} from '../controllers/interestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendInterest);
router.get('/received', protect, getReceivedInterests);
router.get('/sent', protect, getSentInterests);
router.put('/:id/accept', protect, acceptInterest);
router.put('/:id/reject', protect, rejectInterest);
router.delete('/:id', protect, cancelInterest);

export default router;
