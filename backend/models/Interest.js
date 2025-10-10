import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 500
  },
  respondedAt: Date
}, {
  timestamps: true
});

// Ensure unique interest between two users
interestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export default mongoose.model('Interest', interestSchema);
