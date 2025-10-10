import Profile from '../models/Profile.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create profile
// @route   POST /api/profiles
// @access  Private
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    // Create profile
    const profile = await Profile.create({
      user: userId,
      ...req.body
    });

    // Update user profile completion status
    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get own profile
// @route   GET /api/profiles/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'email role');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get profile by ID
// @route   GET /api/profiles/:id
// @access  Private
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', 'email');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Increment profile views (don't count own views)
    if (profile.user._id.toString() !== req.user.id) {
      profile.profileViews += 1;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile
// @route   PUT /api/profiles
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update profile fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        profile[key] = req.body[key];
      }
    });

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload profile photo
// @route   POST /api/profiles/photos
// @access  Private
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo' });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'matrimonial/profiles',
      width: 800,
      height: 800,
      crop: 'fill'
    });

    // Add photo to profile
    const photo = {
      url: result.secure_url,
      publicId: result.public_id,
      isPrimary: profile.photos.length === 0 // First photo is primary
    };

    profile.photos.push(photo);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete profile photo
// @route   DELETE /api/profiles/photos/:photoId
// @access  Private
export const deletePhoto = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const photo = profile.photos.id(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // Remove from profile
    profile.photos.pull(req.params.photoId);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Set primary photo
// @route   PUT /api/profiles/photos/:photoId/primary
// @access  Private
export const setPrimaryPhoto = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Set all photos to non-primary
    profile.photos.forEach(photo => {
      photo.isPrimary = false;
    });

    // Set selected photo as primary
    const photo = profile.photos.id(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.isPrimary = true;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Primary photo updated successfully'
    });
  } catch (error) {
    console.error('Set primary photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload ID proof
// @route   POST /api/profiles/id-proof
// @access  Private
export const uploadIdProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an ID proof' });
    }

    const { type, number } = req.body;

    if (!type || !number) {
      return res.status(400).json({ message: 'Please provide ID type and number' });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'matrimonial/id-proofs'
    });

    // Update ID proof
    profile.idProof = {
      type,
      number,
      document: {
        url: result.secure_url,
        publicId: result.public_id
      },
      verificationStatus: 'pending'
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'ID proof uploaded successfully. Verification pending.'
    });
  } catch (error) {
    console.error('Upload ID proof error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/profiles/privacy
// @access  Private
export const updatePrivacySettings = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.privacy = {
      ...profile.privacy,
      ...req.body
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Privacy settings updated successfully',
      privacy: profile.privacy
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
