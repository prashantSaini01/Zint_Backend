// Import mongoose
import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
}, { timestamps: true });

// Define indexes safely
try {
  inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
} catch (error) {
  console.warn('Index already exists:', error.message);
}

// Export the model
const Invite = mongoose.model('Invite', inviteSchema);
export default Invite;
