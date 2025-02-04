import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [50, 'Title cannot exceed 50 characters'],
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board', // Reference to the Board model
      required: [true, 'Board ID is required'],
    },
    order:{
      type:Number,
      default:0,
      required: true,
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const List = mongoose.model('List', listSchema);

export default List;




// import mongoose from "mongoose";

// const listSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Title is required"],
//       trim: true,
//       maxlength: [50, "Title cannot exceed 50 characters"],
//     },
//     boardId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Board", // Reference to the Board model
//       required: [true, "Board ID is required"],
//     },
//     order: {
//       type: Number,
//       default: 0,
//       required: true,
//     },
//     deletedAt: {
//       type: Date,
//       default: null, // Null means the list is active
//     },
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// // Instance method for soft delete
// listSchema.methods.softDelete = function () {
//   this.deletedAt = new Date(); // Mark as deleted
//   return this.save();
// };

// // Static method to find only active (non-deleted) lists
// listSchema.statics.findActive = function (query = {}) {
//   return this.find({ deletedAt: null, ...query });
// };

// const List = mongoose.model("List", listSchema);

// export default List;
