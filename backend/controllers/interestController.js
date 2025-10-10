import Interest from '../models/Interest.js';
import Profile from '../models/Profile.js';
import Notification from '../models/Notification.js';

// @desc    Send interest
// @route   POST /api/interests
// @access  Private
export const sendInterest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send interest to yourself' });
    }

    // Check if receiver exists
    const receiverProfile = await Profile.findOne({ user: receiverId });
    if (!receiverProfile) {
      return res.status(404).json({ message: 'Receiver profile not found' });
    }

    // Check if interest already exists
    const existingInterest = await Interest.findOne({
      sender: senderId,
      receiver: receiverId
    });

    if (existingInterest) {
      return res.status(400).json({ message: 'Interest already sent to this user' });
    }

    // Create interest
    const interest = await Interest.create({
      sender: senderId,
      receiver: receiverId,
      message
    });

    // Update profile stats
    await Profile.findOneAndUpdate(
      { user: senderId },
      { $inc: { interestsSent: 1 } }
    );
    await Profile.findOneAndUpdate(
      { user: receiverId },
      { $inc: { interestsReceived: 1 } }
    );

    // Create notification
    const senderProfile = await Profile.findOne({ user: senderId });
    await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: 'interest_received',
      title: 'New Interest Received',
      message: `${senderProfile.firstName} has sent you an interest`,
      link: `/profile/${senderProfile._id}`
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(receiverId).emit('newInterest', {
      interest,
      sender: senderProfile
    });

    res.status(201).json({
      success: true,
      message: 'Interest sent successfully',
      interest
    });
  } catch (error) {
    console.error('Send interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get received interests
// @route   GET /api/interests/received
// @access  Private
export const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      receiver: req.user.id
    })
      .populate({
        path: 'sender',
        select: 'email',
        populate: {
          path: 'profile',
          model: 'Profile'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interests.length,
      interests
    });
  } catch (error) {
    console.error('Get received interests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get sent interests
// @route   GET /api/interests/sent
// @access  Private
export const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      sender: req.user.id
    })
      .populate({
        path: 'receiver',
        select: 'email',
        populate: {
          path: 'profile',
          model: 'Profile'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interests.length,
      interests
    });
  } catch (error) {
    console.error('Get sent interests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Accept interest
// @route   PUT /api/interests/:id/accept
// @access  Private
export const acceptInterest = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);
    
    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    if (interest.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (interest.status !== 'pending') {
      return res.status(400).json({ message: 'Interest already responded to' });
    }

    interest.status = 'accepted';
    interest.respondedAt = new Date();
    await interest.save();

    // Create notification for sender
    const receiverProfile = await Profile.findOne({ user: req.user.id });
    await Notification.create({
      recipient: interest.sender,
      sender: req.user.id,
      type: 'interest_accepted',
      title: 'Interest Accepted',
      message: `${receiverProfile.firstName} has accepted your interest`,
      link: `/profile/${receiverProfile._id}`
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(interest.sender.toString()).emit('interestAccepted', {
      interest,
      acceptedBy: receiverProfile
    });

    res.status(200).json({
      success: true,
      message: 'Interest accepted successfully',
      interest
    });
  } catch (error) {
    console.error('Accept interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reject interest
// @route   PUT /api/interests/:id/reject
// @access  Private
export const rejectInterest = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);
    
    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    if (interest.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (interest.status !== 'pending') {
      return res.status(400).json({ message: 'Interest already responded to' });
    }

    interest.status = 'rejected';
    interest.respondedAt = new Date();
    await interest.save();

    // Create notification for sender
    await Notification.create({
      recipient: interest.sender,
      sender: req.user.id,
      type: 'interest_rejected',
      title: 'Interest Declined',
      message: 'Your interest request was declined'
    });

    res.status(200).json({
      success: true,
      message: 'Interest rejected successfully',
      interest
    });
  } catch (error) {
    console.error('Reject interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel interest
// @route   DELETE /api/interests/:id
// @access  Private
export const cancelInterest = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);
    
    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    if (interest.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (interest.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel responded interest' });
    }

    interest.status = 'cancelled';
    await interest.save();

    res.status(200).json({
      success: true,
      message: 'Interest cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
