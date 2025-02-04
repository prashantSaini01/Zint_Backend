import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Board title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Board owner is required"],
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deleted: {
      type: Boolean,
      default: false, // False means the board is active, true means it is deleted
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Instance method for soft delete
boardSchema.methods.softDelete = function () {
  this.deleted = true; // Mark as deleted by setting deleted to true
  return this.save();
};

// Static method to find only active (non-deleted) boards
boardSchema.statics.findActive = function () {
  return this.find({ deleted: false });
};

const Board = mongoose.model("Board", boardSchema);

export default Board;


