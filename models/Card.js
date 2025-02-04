import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: [50, 'Title cannot exceed 50 characters'],
      required: [true, 'Card title is required'],
    },
    description: {
      type: String,
      default: '',
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board reference is required'],
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: [true, 'List reference is required'],
    },
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
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
    dueDate: {
      type: Date,
    },
    labels: [
      {
        type: String,
      },
    ],
    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const Card = mongoose.model('Card', cardSchema);

export default Card;







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
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         completed: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//     deletedAt: {
//       type: Date,
//       default: null, // Null means the card is active
//     },
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// // Instance method for soft delete
// cardSchema.methods.softDelete = function () {
//   this.deletedAt = new Date(); // Mark as deleted
//   return this.save();
// };

// // Static method to find only active (non-deleted) cards
// cardSchema.statics.findActive = function () {
//   return this.find({ deletedAt: null });
// };

// const Card = mongoose.model("Card", cardSchema);

// export default Card;
