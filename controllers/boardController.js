import Board from "../models/Board.js";
import mongoose from 'mongoose';
import User from "../models/User.js";
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

// // Get Boards Function
// export const getboard = async (event) => {
//   try {
//     const userId = event.requestContext.authorizer.principalId; // User ID from token
//     const boards = await Board.find({ owner: userId });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ boards }),
//     };
//   } catch (error) {
//     console.error('Error fetching boards:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
// };


// Get Boards Function
export const getboard = async (event) => {
  try {
    const userId = event.requestContext.authorizer.principalId; // User ID from JWT token

    // Fetch boards where the user is either the owner or a collaborator
    const boards = await Board.find({
      $or: [
        { owner: userId }, // User is the owner of the board
        { collaborators: userId }, // User is a collaborator on the board
      ],
    });

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






export const getCollaborators = async (event) => {
  try {
    const boardId = event.pathParameters.boardId;
    const board = await Board.findById(boardId);

    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    const collaborators = board.collaborators.filter(collaborator => collaborator !== null);

    return {
      statusCode: 200,
      body: JSON.stringify({ collaborators }),
    };
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};



// Add Collaborator to Board based on Email
export const addCollaborator = async (event) => {
  try {
    const boardId = event.pathParameters.boardId;
    const board = await Board.findById(boardId);

    const { email } = JSON.parse(event.body); // Email of the user to add as collaborator

    // Find the board by ID

    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    // Check if the requester is the owner of the board
    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'You are not authorized to add collaborators' }),
      };
    }

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Check if the user is already a collaborator
    if (board.collaborators.includes(user._id.toString())) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User is already a collaborator' }),
      };
    }

    // Add the user as a collaborator on the board
    board.collaborators.push(user._id);
    await board.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Collaborator added successfully', board }),
    };
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};



// Remove Collaborator Function
export const removeCollaborator = async (event) => {
  try {
    const boardId = event.pathParameters.boardId;
    const board = await Board.findById(boardId);
    const { email } = JSON.parse(event.body); // Email of the user to remove as collaborator

    const userId = event.requestContext.authorizer.principalId; // User ID from JWT token


    if (!board) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Board not found' }),
      };
    }

    // Check if the requester is the owner of the board
    if (board.owner.toString() !== userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'You are not authorized to remove collaborators' }),
      };
    }

    // Find the user by email
    const userToRemove = await User.findOne({ email });
    if (!userToRemove) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Check if the user is already a collaborator
    const collaboratorIndex = board.collaborators.indexOf(userToRemove._id.toString());
    if (collaboratorIndex === -1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User is not a collaborator on this board' }),
      };
    }

    // Remove the user from the collaborators array
    board.collaborators.splice(collaboratorIndex, 1);

    // Save the updated board
    await board.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Collaborator removed successfully', board }),
    };
  } catch (error) {
    console.error('Error removing collaborator:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
