import mongoose from 'mongoose';

const partnerPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  ageRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  heightRange: {
    min: Number, // in cm
    max: Number
  },
  maritalStatus: [{
    type: String,
    enum: ['never_married', 'divorced', 'widowed', 'separated']
  }],
  religion: [String],
  caste: [String],
  motherTongue: [String],
  education: [String],
  occupation: [String],
  employedIn: [{
    type: String,
    enum: ['private', 'government', 'business', 'self_employed', 'not_working']
  }],
  annualIncome: [{
    type: String,
    enum: ['0-2L', '2-5L', '5-10L', '10-20L', '20-50L', '50L+']
  }],
  location: {
    country: [String],
    state: [String],
    city: [String]
  },
  diet: [{
    type: String,
    enum: ['vegetarian', 'non_vegetarian', 'eggetarian']
  }],
  smoking: [{
    type: String,
    enum: ['no', 'yes', 'occasionally']
  }],
  drinking: [{
    type: String,
    enum: ['no', 'yes', 'occasionally']
  }],
  manglik: {
    type: String,
    enum: ['yes', 'no', 'doesnt_matter']
  },
  preferenceDescription: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.model('PartnerPreference', partnerPreferenceSchema);
