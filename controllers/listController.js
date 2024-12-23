import Board from '../models/Board.js';
import List from '../models/List.js'; 
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI);


// Create List Function

export const createlist = async (event) => {
  try {
    const { boardId } = event.pathParameters
    const { title} = JSON.parse(event.body);

    if (!boardId || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Board ID and Title are required' }),
      };
    }

    // Check if the board exists and belongs to the user
    const board = await Board.findById(boardId);
    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'You are not authorized to add lists to this board' }),
      };
    }

    // Create the new list
    const newList = new List({
      title,
      boardId,
    });

    await newList.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'List created successfully', list: newList }),
    };
  } catch (error) {
    console.error('Error creating list:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};



// Get All List Functions

export const getlists = async (event) => {
  try {
    const { boardId } = event.pathParameters;

    // Fetch lists associated with the board
    const lists = await List.find({ boardId });

    return {
      statusCode: 200,
      body: JSON.stringify({ lists }),
    };
  } catch (error) {
    console.error('Error fetching lists:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};


// Get Listby Id Functions
export const getlistsbyid = async (event) => {
  try {
    const { id } = event.pathParameters;

    // Fetch the list by ID
    const list = await List.findById(id);

    if (!list) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'List not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ list }),
    };
  } catch (error) {
    console.error('Error fetching list:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

//Update List Functions
export const updatelist = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title } = JSON.parse(event.body);

    // Find the list by ID
    const list = await List.findById(id);

    if (!list) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'List not found' }),
      };
    }

    // Update the list's title
    list.title = title || list.title;

    // Save the updated list
    await list.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'List updated successfully', list }),
    };
  } catch (error) {
    console.error('Error updating list:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Delete List Function
export const deletelist = async (event) => {
  try {
    const { id } = event.pathParameters;

    // Find and delete the list by ID
    const deletedList = await List.findByIdAndDelete(id);

    if (!deletedList) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'List not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'List deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting list:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};