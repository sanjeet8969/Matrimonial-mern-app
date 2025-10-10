import express from 'express';
import {
  getChats,
  getOrCreateChat,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, getOrCreateChat);
router.get('/:chatId/messages', protect, getMessages);
router.post('/:chatId/messages', protect, sendMessage);
router.put('/:chatId/read', protect, markAsRead);
router.delete('/:chatId/messages/:messageId', protect, deleteMessage);

export default router;
