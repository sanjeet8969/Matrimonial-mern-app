import User from '../models/User.js';
import Profile from '../models/Profile.js';
import PartnerPreference from '../models/PartnerPreference.js';

// @desc    Get partner preferences
// @route   GET /api/users/preferences
// @access  Private
export const getPreferences = async (req, res) => {
  try {
    const preferences = await PartnerPreference.findOne({ user: req.user.id });

    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    res.status(200).json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create/Update partner preferences
// @route   POST /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    let preferences = await PartnerPreference.findOne({ user: req.user.id });

    if (preferences) {
      // Update existing preferences
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          preferences[key] = req.body[key];
        }
      });
      await preferences.save();
    } else {
      // Create new preferences
      preferences = await PartnerPreference.create({
        user: req.user.id,
        ...req.body
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Block user
// @route   POST /api/users/block/:userId
// @access  Private
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot block yourself' });
    }

    const user = await User.findById(req.user.id);
    
    if (user.blockedUsers.includes(userId)) {
      return res.status(400).json({ message: 'User already blocked' });
    }

    user.blockedUsers.push(userId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unblock user
// @route   DELETE /api/users/block/:userId
// @access  Private
export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(req.user.id);
    
    if (!user.blockedUsers.includes(userId)) {
      return res.status(400).json({ message: 'User is not blocked' });
    }

    user.blockedUsers = user.blockedUsers.filter(
      id => id.toString() !== userId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get blocked users
// @route   GET /api/users/blocked
// @access  Private
export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'blockedUsers',
        select: 'email',
        populate: {
          path: 'profile',
          model: 'Profile'
        }
      });

    res.status(200).json({
      success: true,
      blockedUsers: user.blockedUsers
    });
  } catch (error) {
    console.error('Get blocked users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Report user
// @route   POST /api/users/report
// @access  Private
export const reportUser = async (req, res) => {
  try {
    const { reportedUserId, reason, description } = req.body;

    if (!reportedUserId || !reason || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const Report = (await import('../models/Report.js')).default;

    const report = await Report.create({
      reporter: req.user.id,
      reported: reportedUserId,
      reason,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    console.error('Report user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update account settings
// @route   PUT /api/users/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Update email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password required' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password incorrect' });
      }

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Deactivate account
// @route   PUT /api/users/deactivate
// @access  Private
export const deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
