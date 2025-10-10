import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Report from '../models/Report.js';
import Subscription from '../models/Subscription.js';
import Payment from '../models/Payment.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get verification requests
// @route   GET /api/admin/verification-requests
// @access  Private/Admin
export const getVerificationRequests = async (req, res) => {
  try {
    const profiles = await Profile.find({
      'idProof.verificationStatus': 'pending'
    })
      .populate('user', 'email')
      .sort({ 'idProof.uploadedAt': -1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Get verification requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve verification
// @route   PUT /api/admin/verification/:profileId/approve
// @access  Private/Admin
export const approveVerification = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.idProof.verificationStatus = 'approved';
    profile.idProof.verifiedAt = new Date();
    profile.isProfileVerified = true;
    await profile.save();

    // Create notification
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.create({
      recipient: profile.user,
      type: 'profile_verified',
      title: 'Profile Verified',
      message: 'Your profile has been verified successfully'
    });

    res.status(200).json({
      success: true,
      message: 'Profile verified successfully'
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reject verification
// @route   PUT /api/admin/verification/:profileId/reject
// @access  Private/Admin
export const rejectVerification = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason required' });
    }

    const profile = await Profile.findById(req.params.profileId);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.idProof.verificationStatus = 'rejected';
    profile.idProof.rejectionReason = reason;
    await profile.save();

    // Create notification
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.create({
      recipient: profile.user,
      type: 'profile_verified',
      title: 'Verification Rejected',
      message: `Your verification was rejected: ${reason}`
    });

    res.status(200).json({
      success: true,
      message: 'Verification rejected'
    });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getAllReports = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = status ? { status } : {};

    const reports = await Report.find(query)
      .populate('reporter', 'email')
      .populate('reported', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resolve report
// @route   PUT /api/admin/reports/:reportId/resolve
// @access  Private/Admin
export const resolveReport = async (req, res) => {
  try {
    const { actionTaken, adminNotes } = req.body;

    const report = await Report.findById(req.params.reportId);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'resolved';
    report.actionTaken = actionTaken;
    report.adminNotes = adminNotes;
    report.resolvedBy = req.user.id;
    report.resolvedAt = new Date();
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report resolved successfully',
      report
    });
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedProfiles = await Profile.countDocuments({ isProfileVerified: true });
    const pendingVerifications = await Profile.countDocuments({
      'idProof.verificationStatus': 'pending'
    });
    const activeSubscriptions = await Subscription.countDocuments({ isActive: true });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Users joined in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        verifiedProfiles,
        pendingVerifications,
        activeSubscriptions,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingReports,
        newUsers
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Ban user
// @route   PUT /api/admin/users/:userId/ban
// @access  Private/Admin
export const banUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'User banned successfully'
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unban user
// @route   PUT /api/admin/users/:userId/unban
// @access  Private/Admin
export const unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isActive: true });

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully'
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
