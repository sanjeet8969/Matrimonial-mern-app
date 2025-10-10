import express from 'express';
import {
  createProfile,
  getMyProfile,
  getProfileById,
  updateProfile,
  uploadPhoto,
  deletePhoto,
  setPrimaryPhoto,
  uploadIdProof,
  updatePrivacySettings
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, createProfile);
router.get('/me', protect, getMyProfile);
router.get('/:id', protect, getProfileById);
router.put('/', protect, updateProfile);
router.post('/photos', protect, upload.single('photo'), uploadPhoto);
router.delete('/photos/:photoId', protect, deletePhoto);
router.put('/photos/:photoId/primary', protect, setPrimaryPhoto);
router.post('/id-proof', protect, upload.single('idProof'), uploadIdProof);
router.put('/privacy', protect, updatePrivacySettings);

export default router;
