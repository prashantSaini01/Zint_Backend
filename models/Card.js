import mongoose from 'mongoose';

// const cardSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Card title is required'],
//     },
//     description: {
//       type: String,
//       default: '',
//     },
//     board: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Board',
//       required: [true, 'Board reference is required'],
//     },
//     list: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'List',
//       required: [true, 'List reference is required'],
//     },
//     assignedUsers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//     ],
//     dueDate: {
//       type: Date,
//     },
//     labels: [
//       {
//         type: String,
//       },
//     ],
//     position:{
//       type:Number,
//       required: true,
//     }
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// const Card = mongoose.model('Card', cardSchema);

// export default Card;

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