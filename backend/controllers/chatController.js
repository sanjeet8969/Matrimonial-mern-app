import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Interest from '../models/Interest.js';

// @desc    Get all chats
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
      .populate('participants', 'email')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'email'
        }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get or create chat
// @route   POST /api/chats
// @access  Private
export const getOrCreateChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.user.id;

    if (userId === receiverId) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    // Check if interest is accepted between users
    const interest = await Interest.findOne({
      $or: [
        { sender: userId, receiver: receiverId, status: 'accepted' },
        { sender: receiverId, receiver: userId, status: 'accepted' }
      ]
    });

    if (!interest) {
      return res.status(403).json({ 
        message: 'You can only chat with users who have accepted your interest' 
      });
    }

    // Check if chat exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, receiverId] }
    }).populate('participants', 'email');

    // Create chat if doesn't exist
    if (!chat) {
      chat = await Chat.create({
        participants: [userId, receiverId],
        unreadCount: { [userId]: 0, [receiverId]: 0 }
      });
      chat = await chat.populate('participants', 'email');
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get or create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get messages in a chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ chat: chatId });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send message
// @route   POST /api/chats/:chatId/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text', attachment } = req.body;

    if (!content && !attachment) {
      return res.status(400).json({ message: 'Message content or attachment required' });
    }

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create message
    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      content,
      messageType,
      attachment
    });

    // Update chat
    chat.lastMessage = message._id;
    
    // Update unread count for receiver
    const receiverId = chat.participants.find(
      id => id.toString() !== req.user.id
    ).toString();
    
    const currentUnread = chat.unreadCount.get(receiverId) || 0;
    chat.unreadCount.set(receiverId, currentUnread + 1);
    
    await chat.save();

    // Populate message
    await message.populate('sender', 'email');

    // Emit socket event
    const io = req.app.get('io');
    io.to(receiverId).emit('receiveMessage', {
      chatId,
      message
    });

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chats/:chatId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user.id },
        'readBy.user': { $ne: req.user.id }
      },
      {
        $push: {
          readBy: {
            user: req.user.id,
            readAt: new Date()
          }
        }
      }
    );

    // Reset unread count
    chat.unreadCount.set(req.user.id, 0);
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete message
// @route   DELETE /api/chats/:chatId/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      chat: chatId,
      sender: req.user.id
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
