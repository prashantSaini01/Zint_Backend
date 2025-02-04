// import mongoose from "mongoose";

// const cardSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Card title is required"],
//     },
//     description: {
//       type: String,
//       default: "",
//     },
//     list: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "List",
//       required: true,
//     },
//     board: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Board",
//       required: true,
//     },
//     position: {
//       type: Number,
//       required: true,
//     },
//     assignedUsers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     subtasks: [
//       {
//         title: {
//           type: String,
//           required: true,
//         },
//         dueDate: {
//           type: Date,
//         },
//         assignedTo: {
//           type: String,
//           ref: "User",
//         },
//         completed: {
//           type: Boolean,
//           default: false,
//         },
//         deletedAt: {
//           type: Date,
//           default: null,
//         },
//       },
//     ],
//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Instance method to soft delete a card
// cardSchema.methods.softDelete = function () {
//   this.deletedAt = new Date();
//   return this.save();
// };

// // Instance method to soft delete a specific subtask
// cardSchema.methods.softDeleteSubtask = function (subtaskId) {
//   const subtask = this.subtasks.id(subtaskId);
//   if (subtask) {
//     subtask.deletedAt = new Date();
//     return this.save();
//   }
//   throw new Error("Subtask not found");
// };

// // Static method to find only active cards
// cardSchema.statics.findActive = function () {
//   return this.find({ deletedAt: null });
// };

// // Helper method to filter active subtasks
// cardSchema.methods.getActiveSubtasks = function () {
//   return this.subtasks.filter((subtask) => subtask.deletedAt === null);
// };

// const Card = mongoose.model("Card", cardSchema);

// export default Card;

import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Card title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
        },
        dueDate: {
          type: Date,
        },
        assignedTo: {
          type: String,
          ref: "User",
        },
        completed: {
          type: Boolean,
          default: false,
        },
        deleted: {
          type: Boolean,
          default: false, // Changed to Boolean flag
        },
      },
    ],
    deleted: {
      type: Boolean,
      default: false, // Changed to Boolean flag
    },
  },
  {
    timestamps: true,
  }
);

// Instance method to soft delete a card
cardSchema.methods.softDelete = function () {
  this.deleted = true; // Set the deleted flag
  return this.save();
};

// Instance method to soft delete a specific subtask
cardSchema.methods.softDeleteSubtask = function (subtaskId) {
  const subtask = this.subtasks.id(subtaskId);
  if (subtask) {
    subtask.deleted = true; // Set the deleted flag
    return this.save();
  }
  throw new Error("Subtask not found");
};

// Static method to find only active cards
cardSchema.statics.findActive = function () {
  return this.find({ deleted: false }); // Filter by the deleted flag
};

// Helper method to filter active subtasks
cardSchema.methods.getActiveSubtasks = function () {
  return this.subtasks.filter((subtask) => subtask.deleted === false); // Filter by the deleted flag
};

const Card = mongoose.model("Card", cardSchema);

export default Card;
