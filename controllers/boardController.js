import Board from "../models/Board.js";


// Create Board Function
export const createboard = async (event) => {
  try {
    const { title, description } = JSON.parse(event.body);

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Title and description are required' }),
      };
    }

    const newBoard = new Board({
      title,
      description,
      owner: event.requestContext.authorizer.principalId, // User ID from token
    });

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


export const getboard = async (event) => {
  try {
    const userId = event.requestContext.authorizer.principalId; // User ID from token
    const boards = await Board.find({
      $or: [
        { owner: userId },
        { collaborators: userId } // Include boards where the user is a collaborator
      ]
    });

    // Add the `isOwner` flag to each board
    boards.forEach((board) => {
      board.isOwner = String(board.owner) === userId; // Check if the current user is the owner
    });

    // Separate boards into my boards and shared boards
    const myBoards = boards.filter((board) => board.isOwner);
    const sharedBoards = boards.filter((board) => !board.isOwner);

    return {
      statusCode: 200,
      body: JSON.stringify({ myBoards, sharedBoards }), // Return both myBoards and sharedBoards
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

// Update Board Function
export const updateboard = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, description } = JSON.parse(event.body);

    const board = await Board.findById(id);

    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'You are not authorized to update this board' }),
      };
    }

    board.title = title || board.title;
    board.description = description || board.description;

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

    const board = await Board.findById(id);

    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'You are not authorized to delete this board' }),
      };
    }

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

