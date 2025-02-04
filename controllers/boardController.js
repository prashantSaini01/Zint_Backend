import Board from "../models/Board.js";


// Create Board Function
export const createboard = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }



    const newBoard = new Board({
      title,
      description,
      owner: req.user.id, // Use req.user.id from the decoded JWT payload
    });

    await newBoard.save();

    return res.status(201).json({ message: 'Board created successfully', board: newBoard });
  } catch (error) {
    console.error('Error creating board:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get Boards Function
export const getboard = async (req, res) => {
  try {
    console.log(req.user.id)
    const userId = req.user.id; // Access user.id from the decoded token
    const boards = await Board.find({
      $or: [
        { owner: userId },
        { collaborators: userId } // Include boards where the user is a collaborator
      ]
    });

    boards.forEach((board) => {
      board.isOwner = String(board.owner) === userId;
    });

    const myBoards = boards.filter((board) => board.isOwner);
    const sharedBoards = boards.filter((board) => !board.isOwner);

    return res.status(200).json({
      myBoards,
      sharedBoards,
    });
  } catch (error) {
    console.error('Error fetching boards:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get Board By ID Function
export const getboardbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    return res.status(200).json({ board });
  } catch (error) {
    console.error('Error fetching board:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update Board Function
export const updateboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== req.user.id.toString()) { // Check with req.user.id
      return res.status(403).json({ message: 'You are not authorized to update this board' });
    }

    board.title = title || board.title;
    board.description = description || board.description;

    await board.save();

    return res.status(200).json({ message: 'Board updated successfully', board });
  } catch (error) {
    console.error('Error updating board:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete Board Function
export const deleteboard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== req.user.id.toString()) { // Check with req.user.id
      return res.status(403).json({ message: 'You are not authorized to delete this board' });
    }

    await Board.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};









// import Board from "../models/Board.js";

// // Create Board
// export const createboard = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!title || !description) {
//       return res
//         .status(400)
//         .json({ message: "Title and description are required" });
//     }

//     const newBoard = new Board({
//       title,
//       description,
//       owner: req.user.id, // Use req.user.id from the decoded JWT payload
//     });

//     await newBoard.save();

//     return res
//       .status(201)
//       .json({ message: "Board created successfully", board: newBoard });
//   } catch (error) {
//     console.error("Error creating board:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Get Active Boards
// export const getboard = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const boards = await Board.findActive().or([
//       { owner: userId },
//       { collaborators: userId },
//     ]);

//     boards.forEach((board) => {
//       board.isOwner = String(board.owner) === userId;
//     });

//     const myBoards = boards.filter((board) => board.isOwner);
//     const sharedBoards = boards.filter((board) => !board.isOwner);

//     return res.status(200).json({
//       myBoards,
//       sharedBoards,
//     });
//   } catch (error) {
//     console.error("Error fetching boards:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Get Board By ID
// export const getboardbyid = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const board = await Board.findOne({ _id: id, deletedAt: null });

//     if (!board) {
//       return res.status(404).json({ message: "Board not found or deleted" });
//     }

//     return res.status(200).json({ board });
//   } catch (error) {
//     console.error("Error fetching board:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Update Board
// export const updateboard = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     const board = await Board.findOne({ _id: id, deletedAt: null });

//     if (!board) {
//       return res.status(404).json({ message: "Board not found or deleted" });
//     }

//     if (board.owner.toString() !== req.user.id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorized to update this board" });
//     }

//     board.title = title || board.title;
//     board.description = description || board.description;

//     await board.save();

//     return res
//       .status(200)
//       .json({ message: "Board updated successfully", board });
//   } catch (error) {
//     console.error("Error updating board:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Soft Delete Board
// export const deleteboard = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const board = await Board.findOne({ _id: id, deletedAt: null });

//     if (!board) {
//       return res
//         .status(404)
//         .json({ message: "Board not found or already deleted" });
//     }

//     if (board.owner.toString() !== req.user.id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorized to delete this board" });
//     }

//     await board.softDelete();

//     return res.status(200).json({ message: "Board deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting board:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
