import Board from "../models/Board.js";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI);

// Create Board Function
export const createboard  = async (event) => {
  try {
    // Parse the request body
    const { title, description } = JSON.parse(event.body);

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Title and description are required' }),
      };
    }

    // Create a new board
    const newBoard = new Board({
      title,
      description,
      owner: event.requestContext.authorizer.principalId, // Get the user ID from the token
    });

    // Save the board to the database
    await newBoard.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Board created successfully', board: newBoard }),
    };
  } catch (error) {
    console.error('Error creating board:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};




// Get Boards Function

export const getboard = async (event) => {
  try {
    const userId = event.requestContext.authorizer.principalId; // Get the user ID from the token

    // Fetch the boards created by the current user
    const boards = await Board.find({ owner: userId });

    return {
      statusCode: 200,
      body: JSON.stringify({ boards }),
    };
  } catch (error) {
    console.error('Error fetching boards:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};


// Get Board By ID Function


export const getboardbyid = async (event) => {
  try {
    const { id } = event.pathParameters;

    // Fetch the board by its ID
    const board = await Board.findById(id);

    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ board }),
    };
  } catch (error) {
    console.error('Error fetching board:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};


// Upadte Board Function

export const updateboard = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, description } = JSON.parse(event.body);

    // Find the board by ID
    const board = await Board.findById(id);

    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    // Ensure the user is the creator of the board
    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'You are not authorized to update this board' }),
      };
    }

    // Update the board
    board.title = title || board.title;
    board.description = description || board.description;

    // Save the updated board
    await board.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Board updated successfully', board }),
    };
  } catch (error) {
    console.error('Error updating board:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};


// Delete Board Function

export const deleteboard = async (event) => {
  try {
    const { id } = event.pathParameters;

    // Find the board by ID
    const board = await Board.findById(id);

    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    // Ensure the user is the creator of the board
    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'You are not authorized to delete this board' }),
      };
    }

    // Delete the board using findByIdAndDelete
    await Board.findByIdAndDelete(id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Board deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting board:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
