import mongoose from 'mongoose';

const scheduledCardSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  cardTitle: {
    type: String,
    required: true
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  frequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'fortnightly', 'yearly'],
    required: true
  },
  frequencyDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const ScheduledCard = mongoose.model('ScheduledCard', scheduledCardSchema);

export default ScheduledCard;