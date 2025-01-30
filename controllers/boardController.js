// import Board from "../models/Board.js";
// import { formatJSONResponse } from "../utils/apigateway.js";


// // Create Board Function
// export const createboard = async (event) => {
//   try {
//     const { title, description } = JSON.parse(event.body);

//     if (!title || !description) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Title and description are required' }),
//       };
//     }

//     const newBoard = new Board({
//       title,
//       description,
//       owner: event.requestContext.authorizer.principalId, // User ID from token
//     });

//     await newBoard.save();

//     return {
//       statusCode: 201,
//       body: JSON.stringify({ message: 'Board created successfully', board: newBoard }),
//     };
//   } catch (error) {
//     console.error('Error creating board:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
// };


// export const getboard = async (event) => {
//   try {
//     const userId = event.requestContext.authorizer.principalId; // User ID from token
//     const boards = await Board.find({
//       $or: [
//         { owner: userId },
//         { collaborators: userId } // Include boards where the user is a collaborator
//       ]
//     });

//     // Add the `isOwner` flag to each board
//     boards.forEach((board) => {
//       board.isOwner = String(board.owner) === userId; // Check if the current user is the owner
//     });

//     // Separate boards into my boards and shared boards
//     const myBoards = boards.filter((board) => board.isOwner);
//     const sharedBoards = boards.filter((board) => !board.isOwner);

//     return formatJSONResponse(200, {
//       myBoards,
//       sharedBoards, // Return both myBoards and sharedBoards
//     });
//   } catch (error) {
//     console.error('Error fetching boards:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
// };


// // Get Board By ID Function
// export const getboardbyid = async (event) => {
//   try {
//     const { id } = event.pathParameters;
//     const board = await Board.findById(id);

//     if (!board) {
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ message: 'Board not found' }),
//       };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ board }),
//     };
//   } catch (error) {
//     console.error('Error fetching board:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
// };

// // Update Board Function
// export const updateboard = async (event) => {
//   try {
//     const { id } = event.pathParameters;
//     const { title, description } = JSON.parse(event.body);

//     const board = await Board.findById(id);

//     if (!board) {
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ message: 'Board not found' }),
//       };
//     }

//     if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
//       return {
//         statusCode: 403,
//         body: JSON.stringify({ message: 'You are not authorized to update this board' }),
//       };
//     }

//     board.title = title || board.title;
//     board.description = description || board.description;

//     await board.save();

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'Board updated successfully', board }),
//     };
//   } catch (error) {
//     console.error('Error updating board:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
// };

// // Delete Board Function
// export const deleteboard = async (event) => {
//   try {
//     const { id } = event.pathParameters;

//     const board = await Board.findById(id);

//     if (!board) {
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ message: 'Board not found' }),
//       };
//     }

//     if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
//       return {
//         statusCode: 403,
//         body: JSON.stringify({ message: 'You are not authorized to delete this board' }),
//       };
//     }

//     await Board.findByIdAndDelete(id);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'Board deleted successfully' }),
//     };
//   } catch (error) {
//     console.error('Error deleting board:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
// };

import Board from "../models/Board.js";
import { formatJSONResponse } from "../utils/apigateway.js";

// Create Board Function
export const createboard = async (event) => {
  try {
    const { title, description } = JSON.parse(event.body);

    if (!title || !description) {
      return formatJSONResponse(400, {
        message: 'Title and description are required',
      });
    }

    const newBoard = new Board({
      title,
      description,
      owner: event.requestContext.authorizer.principalId, // User ID from token
    });

    await newBoard.save();

    return formatJSONResponse(201, {
      message: 'Board created successfully',
      board: newBoard,
    });
  } catch (error) {
    console.error('Error creating board:', error);
    return formatJSONResponse(500, {
      message: 'Internal Server Error',
    });
  }
};






// Get Boards Function
export const getboard = async (event) => {
  try {
    // const userId = event.requestContext.authorizer.principalId; // User ID from token
    // console.log("Board Controllers UserId",userId)
    // if (!userId) {
    //   return formatJSONResponse(401, { message: 'Unauthorized: No user ID found' });
    // }
    // const boards = await Board.find({
    //   $or: [
    //     { owner: userId },
    //     { collaborators: userId }, // Include boards where the user is a collaborator
    //   ],
    // });

    // // Add the `isOwner` flag to each board
    // boards.forEach((board) => {
    //   board.isOwner = String(board.owner) === userId; // Check if the current user is the owner
    // });

    // Separate boards into my boards and shared boards
    // const myBoards = boards.filter((board) => board.isOwner);
    // const sharedBoards = boards.filter((board) => !board.isOwner);


    const sharedBoards = []



    const myBoards= [
      {
          "_id": "676e4a9d147f716b0d1fd8fd",
          "title": "Zintle Board",
          "description": "These Board is Trgarding all the things in Zintle Project",
          "owner": "676a9adbcf3d5cc1b2d6d1e0",
          "collaborators": [
              "677f6b73964c21051d4ab385",
              "6780f9e464ef7a3d5c6bc5c7"
          ],
          "createdAt": "2024-12-27T06:35:09.997Z",
          "__v": 2,
          "updatedAt": "2025-01-17T09:56:02.133Z"
      },
      {
          "_id": "6788d85d3e8054d20eadf77e",
          "title": "Jira Board",
          "description": "This Board is board for jira users",
          "owner": "676a9adbcf3d5cc1b2d6d1e0",
          "collaborators": [
              "67861d8bc562b14474f4868f",
              "6780f9e464ef7a3d5c6bc5c7"
          ],
          "createdAt": "2025-01-16T09:58:53.256Z",
          "updatedAt": "2025-01-16T16:17:14.516Z",
          "__v": 0
      },
      {
          "_id": "678a4491f35dd4d58ef00d6d",
          "title": "Miro Board",
          "description": "This is Example Board",
          "owner": "676a9adbcf3d5cc1b2d6d1e0",
          "collaborators": [],
          "createdAt": "2025-01-17T11:52:49.379Z",
          "updatedAt": "2025-01-17T11:52:49.379Z",
          "__v": 0
      },
      {
          "_id": "67972976832740a8906d29ba",
          "title": "Abrassio Board",
          "description": "Multi Scrapping Project",
          "owner": "676a9adbcf3d5cc1b2d6d1e0",
          "collaborators": [],
          "createdAt": "2025-01-27T06:36:38.274Z",
          "updatedAt": "2025-01-27T06:36:38.274Z",
          "__v": 0
      },
      {
          "_id": "6798d7aae218ece5eb6e949c",
          "title": "Testing Board",
          "description": "afcwcweavcdsc",
          "owner": "676a9adbcf3d5cc1b2d6d1e0",
          "collaborators": [],
          "createdAt": "2025-01-28T13:12:10.076Z",
          "updatedAt": "2025-01-28T13:12:10.076Z",
          "__v": 0
      }
  ]

  

  
  return formatJSONResponse(200, {
      myBoards: myBoards,
      sharedBoards: sharedBoards, // Return both myBoards and sharedBoards
    });

  } catch (error) {
    console.error('Error fetching boards:', error);
    return formatJSONResponse(500, {
      message: 'Internal Server Error',
    });
  }
};










// Get Board By ID Function
export const getboardbyid = async (event) => {
  try {
    const { id } = event.pathParameters;
    const board = await Board.findById(id);

    if (!board) {
      return formatJSONResponse(404, {
        message: 'Board not found',
      });
    }

    return formatJSONResponse(200, { board });
  } catch (error) {
    console.error('Error fetching board:', error);
    return formatJSONResponse(500, {
      message: 'Internal Server Error',
    });
  }
};

// Update Board Function
export const updateboard = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, description } = JSON.parse(event.body);

    const board = await Board.findById(id);

    if (!board) {
      return formatJSONResponse(404, {
        message: 'Board not found',
      });
    }

    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return formatJSONResponse(403, {
        message: 'You are not authorized to update this board',
      });
    }

    board.title = title || board.title;
    board.description = description || board.description;

    await board.save();

    return formatJSONResponse(200, {
      message: 'Board updated successfully',
      board,
    });
  } catch (error) {
    console.error('Error updating board:', error);
    return formatJSONResponse(500, {
      message: 'Internal Server Error',
    });
  }
};

// Delete Board Function
export const deleteboard = async (event) => {
  try {
    const { id } = event.pathParameters;

    const board = await Board.findById(id);

    if (!board) {
      return formatJSONResponse(404, {
        message: 'Board not found',
      });
    }

    if (board.owner.toString() !== event.requestContext.authorizer.principalId) {
      return formatJSONResponse(403, {
        message: 'You are not authorized to delete this board',
      });
    }

    await Board.findByIdAndDelete(id);

    return formatJSONResponse(200, {
      message: 'Board deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting board:', error);
    return formatJSONResponse(500, {
      message: 'Internal Server Error',
    });
  }
};
