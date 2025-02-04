import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Board owner is required'],
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Board = mongoose.model('Board', boardSchema);

export default Board;




// import mongoose from "mongoose";

// const boardSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Board title is required"],
//     },
//     description: {
//       type: String,
//       default: "",
//     },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Board owner is required"],
//     },
//     collaborators: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     deletedAt: {
//       type: Date,
//       default: null, // Null means the board is active
//     },
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// // Instance method for soft delete
// boardSchema.methods.softDelete = function () {
//   this.deletedAt = new Date(); // Mark as deleted by setting the current timestamp
//   return this.save();
// };

// // Static method to find only active (non-deleted) boards
// boardSchema.statics.findActive = function () {
//   return this.find({ deletedAt: null });
// };

// const Board = mongoose.model("Board", boardSchema);

// export default Board;
