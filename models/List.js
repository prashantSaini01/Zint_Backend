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
