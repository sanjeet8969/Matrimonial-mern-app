import Profile from '../models/Profile.js';
import PartnerPreference from '../models/PartnerPreference.js';
import { calculateMatchScore } from '../utils/matchingAlgorithm.js';

// @desc    Get suggested matches
// @route   GET /api/matches/suggested
// @access  Private
export const getSuggestedMatches = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'Please complete your profile first' });
    }

    const preferences = await PartnerPreference.findOne({ user: req.user.id });
    if (!preferences) {
      return res.status(404).json({ message: 'Please set your partner preferences first' });
    }

    // Build query based on preferences
    const query = {
      user: { $ne: req.user.id },
      gender: userProfile.gender === 'male' ? 'female' : 'male',
      'privacy.profileVisibility': 'visible'
    };

    // Age range
    if (preferences.ageRange) {
      query.age = {
        $gte: preferences.ageRange.min,
        $lte: preferences.ageRange.max
      };
    }

    // Height range
    if (preferences.heightRange) {
      query.height = {
        $gte: preferences.heightRange.min,
        $lte: preferences.heightRange.max
      };
    }

    // Marital status
    if (preferences.maritalStatus && preferences.maritalStatus.length > 0) {
      query.maritalStatus = { $in: preferences.maritalStatus };
    }

    // Religion
    if (preferences.religion && preferences.religion.length > 0) {
      query.religion = { $in: preferences.religion };
    }

    // Location
    if (preferences.location) {
      const locationQuery = [];
      if (preferences.location.country && preferences.location.country.length > 0) {
        locationQuery.push({ 'address.country': { $in: preferences.location.country } });
      }
      if (preferences.location.state && preferences.location.state.length > 0) {
        locationQuery.push({ 'address.state': { $in: preferences.location.state } });
      }
      if (preferences.location.city && preferences.location.city.length > 0) {
        locationQuery.push({ 'address.city': { $in: preferences.location.city } });
      }
      if (locationQuery.length > 0) {
        query.$or = locationQuery;
      }
    }

    const matches = await Profile.find(query)
      .populate('user', 'email')
      .limit(50);

    // Calculate match scores
    const matchesWithScores = matches.map(match => ({
      profile: match,
      matchScore: calculateMatchScore(userProfile, match, preferences)
    }));

    // Sort by match score
    matchesWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matchesWithScores.length,
      matches: matchesWithScores
    });
  } catch (error) {
    console.error('Get suggested matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search profiles
// @route   GET /api/matches/search
// @access  Private
export const searchProfiles = async (req, res) => {
  try {
    const {
      gender,
      ageMin,
      ageMax,
      heightMin,
      heightMax,
      religion,
      caste,
      maritalStatus,
      education,
      occupation,
      country,
      state,
      city,
      diet,
      verifiedOnly,
      sortBy = 'recent'
    } = req.query;

    const query = {
      user: { $ne: req.user.id },
      'privacy.profileVisibility': 'visible'
    };

    // Gender
    if (gender) {
      query.gender = gender;
    }

    // Age range
    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = parseInt(ageMin);
      if (ageMax) query.age.$lte = parseInt(ageMax);
    }

    // Height range
    if (heightMin || heightMax) {
      query.height = {};
      if (heightMin) query.height.$gte = parseInt(heightMin);
      if (heightMax) query.height.$lte = parseInt(heightMax);
    }

    // Religion
    if (religion) {
      query.religion = religion;
    }

    // Caste
    if (caste) {
      query.caste = caste;
    }

    // Marital status
    if (maritalStatus) {
      query.maritalStatus = maritalStatus;
    }

    // Education
    if (education) {
      query['education.highestQualification'] = education;
    }

    // Occupation
    if (occupation) {
      query['education.occupation'] = occupation;
    }

    // Location
    if (country) {
      query['address.country'] = country;
    }
    if (state) {
      query['address.state'] = state;
    }
    if (city) {
      query['address.city'] = city;
    }

    // Diet
    if (diet) {
      query['lifestyle.diet'] = diet;
    }

    // Verified only
    if (verifiedOnly === 'true') {
      query.isProfileVerified = true;
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'recent':
        sort = { createdAt: -1 };
        break;
      case 'views':
        sort = { profileViews: -1 };
        break;
      case 'age_asc':
        sort = { age: 1 };
        break;
      case 'age_desc':
        sort = { age: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find(query)
      .populate('user', 'email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Profile.countDocuments(query);

    res.status(200).json({
      success: true,
      count: profiles.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      profiles
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get recently joined profiles
// @route   GET /api/matches/recent
// @access  Private
export const getRecentProfiles = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const oppositeGender = userProfile.gender === 'male' ? 'female' : 'male';

    const profiles = await Profile.find({
      user: { $ne: req.user.id },
      gender: oppositeGender,
      'privacy.profileVisibility': 'visible'
    })
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Get recent profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get nearby profiles
// @route   GET /api/matches/nearby
// @access  Private
export const getNearbyProfiles = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const oppositeGender = userProfile.gender === 'male' ? 'female' : 'male';

    const profiles = await Profile.find({
      user: { $ne: req.user.id },
      gender: oppositeGender,
      'address.city': userProfile.address.city,
      'privacy.profileVisibility': 'visible'
    })
      .populate('user', 'email')
      .limit(20);

    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Get nearby profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
