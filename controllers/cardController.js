import Board from '../models/Board.js';
import List from '../models/List.js'; 
import Card from '../models/Card.js';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI);

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

    // Check if the list exists
    const list = await List.findById(listId).populate('boardId'); // Populate the board reference
    if (!list) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'List not found' }),
      };
    }

    // Ensure the list has an associated board
    const boardId = list.boardId._id;
    if (!boardId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'List must belong to a board' }),
      };
    }

    // Create the new card
    const newCard = new Card({
      title,
      description,
      list: listId,
      board: boardId,
    });

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

    if (!listId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'List ID is required' }),
      };
    }

    // Validate and convert listId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid List ID' }),
      };
    }

    const objectId = new mongoose.Types.ObjectId(listId);

    // Fetch cards associated with the list
    const cards = await Card.find({ list: objectId });

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








// Get Card By Id Function
export const getcardbyid= async (event) => {
  try {
    const { id } = event.pathParameters;

    // Fetch the card by ID
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

    // Find the card by ID
    const card = await Card.findById(id);

    if (!card) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Card not found' }),
      };
    }

    // Update the card's title and description
    card.title = title || card.title;
    card.description = description || card.description;

    // Save the updated card
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


// delete Card Function
export const deletecard = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Card ID is required' }),
      };
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid Card ID' }),
      };
    }

    // Find and delete the card by ID
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
