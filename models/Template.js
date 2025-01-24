import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      maxlength: [50, 'Template name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      default: '', // Optional field
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'fortnightly', 'yearly', 'none'],
      default: 'none', // Default to no frequency
    },
    frequencyDetails: {
      type: mongoose.Schema.Types.Mixed, // Store frequency-specific details (e.g., days, dates)
      default: null,
    },
    subtasks: [
      {
        title: {
          type: String,
          required: [true, 'Subtask title is required'],
        },
        assignedTo: {
          type: String,
          default: '',
        },
        completed: {
          type: Boolean,
          default: false,
        },
        dueDate: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Template = mongoose.model('Template', templateSchema);

export default Template;
