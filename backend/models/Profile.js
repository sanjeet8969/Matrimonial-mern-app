import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  age: Number,
  height: {
    type: Number, // in cm
    required: true
  },
  weight: Number, // in kg
  maritalStatus: {
    type: String,
    enum: ['never_married', 'divorced', 'widowed', 'separated'],
    required: true
  },
  bodyType: {
    type: String,
    enum: ['slim', 'average', 'athletic', 'heavy']
  },
  complexion: {
    type: String,
    enum: ['fair', 'wheatish', 'dark', 'very_fair']
  },
  physicalStatus: {
    type: String,
    enum: ['normal', 'physically_challenged']
  },
  
  // Contact & Location
  phone: {
    type: String,
    required: true
  },
  alternatePhone: String,
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    pincode: String
  },
  
  // Religious Information
  religion: {
    type: String,
    required: true
  },
  caste: String,
  subCaste: String,
  gothram: String,
  star: String,
  raasi: String,
  
  // Education & Career
  education: {
    highestQualification: {
      type: String,
      required: true
    },
    institution: String,
    employedIn: {
      type: String,
      enum: ['private', 'government', 'business', 'self_employed', 'not_working']
    },
    occupation: String,
    organization: String,
    annualIncome: {
      type: String,
      enum: ['0-2L', '2-5L', '5-10L', '10-20L', '20-50L', '50L+']
    }
  },
  
  // Family Details
  family: {
    fatherName: String,
    fatherOccupation: String,
    motherName: String,
    motherOccupation: String,
    brothers: Number,
    brothersMarried: Number,
    sisters: Number,
    sistersMarried: Number,
    familyType: {
      type: String,
      enum: ['joint', 'nuclear']
    },
    familyStatus: {
      type: String,
      enum: ['middle_class', 'upper_middle_class', 'rich', 'affluent']
    },
    familyValues: {
      type: String,
      enum: ['traditional', 'moderate', 'liberal']
    }
  },
  
  // Lifestyle
  lifestyle: {
    diet: {
      type: String,
      enum: ['vegetarian', 'non_vegetarian', 'eggetarian']
    },
    smoking: {
      type: String,
      enum: ['no', 'yes', 'occasionally']
    },
    drinking: {
      type: String,
      enum: ['no', 'yes', 'occasionally']
    }
  },
  
  // About
  aboutMe: {
    type: String,
    maxlength: 1000
  },
  hobbies: [String],
  
  // Photos
  photos: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Verification
  idProof: {
    type: {
      type: String,
      enum: ['aadhar', 'pan', 'passport', 'driving_license']
    },
    number: String,
    document: {
      url: String,
      publicId: String
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date,
    rejectionReason: String
  },
  
  // Privacy Settings
  privacy: {
    showPhotos: {
      type: String,
      enum: ['everyone', 'premium_members', 'accepted_interests'],
      default: 'everyone'
    },
    showContact: {
      type: String,
      enum: ['everyone', 'premium_members', 'accepted_interests'],
      default: 'accepted_interests'
    },
    profileVisibility: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible'
    }
  },
  
  // Profile Stats
  profileViews: {
    type: Number,
    default: 0
  },
  interestsReceived: {
    type: Number,
    default: 0
  },
  interestsSent: {
    type: Number,
    default: 0
  },
  
  // Profile Status
  isProfileVerified: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  profileScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate age before saving
profileSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});

export default mongoose.model('Profile', profileSchema);
