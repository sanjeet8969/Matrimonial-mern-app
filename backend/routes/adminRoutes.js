import express from 'express';
import {
  getAllUsers,
  getVerificationRequests,
  approveVerification,
  rejectVerification,
  getAllReports,
  resolveReport,
  getDashboardStats,
  banUser,
  unbanUser
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/verification-requests', getVerificationRequests);
router.put('/verification/:profileId/approve', approveVerification);
router.put('/verification/:profileId/reject', rejectVerification);
router.get('/reports', getAllReports);
router.put('/reports/:reportId/resolve', resolveReport);
router.get('/stats', getDashboardStats);
router.put('/users/:userId/ban', banUser);
router.put('/users/:userId/unban', unbanUser);

export default router;
