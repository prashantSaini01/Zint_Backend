import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      maxlength: [50, 'Template name cannot exceed 50 characters'],
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'fortnightly', 'yearly', 'none'],
      default: 'none',
    },
    frequencyDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    assignedUsers: [
      {
        type: String,
        default: '',
      },
    ],

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
        deleted: {
          type: Boolean,
          default: false, // Soft delete for subtasks
        },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Instance method to soft delete a template
templateSchema.methods.softDelete = function () {
  this.deleted = true; // Set the deleted flag
  return this.save();
};

// Instance method to soft delete a specific subtask
templateSchema.methods.softDeleteSubtask = function (subtaskId) {
  const subtask = this.subtasks.id(subtaskId); // Locate the subtask by ID
  if (subtask) {
    subtask.deleted = true; // Set the deleted flag for the subtask
    return this.save();
  }
  throw new Error('Subtask not found');
};

// Static method to find only active templates
templateSchema.statics.findActive = function (query = {}) {
  return this.find({ deleted: false, ...query }); // Filter by the deleted flag
};


// Helper method to filter active subtasks
templateSchema.methods.getActiveSubtasks = function () {
  return this.subtasks.filter((subtask) => subtask.deleted === false); // Filter by the deleted flag
};

const Template = mongoose.model('Template', templateSchema);

export default Template;
