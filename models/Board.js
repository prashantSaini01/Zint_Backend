import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  const Board = mongoose.model('Board', boardSchema);

  export default Board;