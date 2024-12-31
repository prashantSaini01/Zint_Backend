import mongoose from 'mongoose';
import Board from '../models/Board.js';
import List from '../models/List.js';
import Card from '../models/Card.js';

// Connect to MongoDB with async/await
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process if the connection fails
  }
};
connectDB();

// Create Card Function
export const createcard = async (event) => {
  try {
    const { listId } = event.pathParameters;
    const { title, description } = JSON.parse(event.body);

    if (!title || !listId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Title and List ID are required' }),
      };
    }

    const list = await List.findById(listId).populate('boardId');
    if (!list) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'List not found' }),
      };
    }

    const boardId = list.boardId?._id;
    if (!boardId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'List must belong to a board' }),
      };
    }

    const newCard = new Card({ title, description, list: listId, board: boardId });
    await newCard.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Card created successfully', card: newCard }),
    };
  } catch (error) {
    console.error('Error creating card:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Get all Cards Function
export const getcards = async (event) => {
  try {
    const { listId } = event.pathParameters;

    if (!listId || !mongoose.Types.ObjectId.isValid(listId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid or missing List ID' }),
      };
    }

    const cards = await Card.find({ list: listId });
    if (cards.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No cards found for this List ID' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ cards }),
    };
  } catch (error) {
    console.error('Error fetching cards:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Get Card By ID Function
export const getcardbyid = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid Card ID' }),
      };
    }

    const card = await Card.findById(id);
    if (!card) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Card not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ card }),
    };
  } catch (error) {
    console.error('Error fetching card:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Update Card Function
export const updatecard = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, description } = JSON.parse(event.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid Card ID' }),
      };
    }

    const card = await Card.findById(id);
    if (!card) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Card not found' }),
      };
    }

    card.title = title || card.title;
    card.description = description || card.description;

    await card.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Card updated successfully', card }),
    };
  } catch (error) {
    console.error('Error updating card:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Delete Card Function
export const deletecard = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid Card ID' }),
      };
    }

    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Card not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Card deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting card:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
