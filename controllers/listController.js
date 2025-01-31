import Board from '../models/Board.js';
import List from '../models/List.js'; 

// Create List Function
export const createlist = async (req, res) => {
  try {
    const { id } = req.params;  // Access boardId from params
    const boardId = id;
    const { title, order } = req.body;

    if (!boardId || !title || order === undefined) {
      return res.status(400).json({ message: 'Board ID, Title, and Order are required' });
    }

    // Check if the board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Create the new list
    const newList = new List({
      title,
      boardId,
      order,
    });

    await newList.save();

    return res.status(201).json({ message: 'List created successfully', list: newList });
  } catch (error) {
    console.error('Error creating list:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All List Function
export const getlists = async (req, res) => {
  try {
    const { id } = req.params; // Access boardId from params
    const boardId = id;

    // Fetch lists associated with the board
    const lists = await List.find({ boardId });

    return res.status(200).json({ lists });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get List by ID Function
export const getlistsbyid = async (req, res) => {
  try {
    const { id } = req.params;  // Access listId from params

    // Fetch the list by ID
    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    return res.status(200).json({ list });
  } catch (error) {
    console.error('Error fetching list:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update List Function
export const updatelist = async (req, res) => {
  try {
    const { id } = req.params;  // Access listId from params
    const { title } = req.body;

    // Find the list by ID
    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Update the list's title
    list.title = title || list.title;

    // Save the updated list
    await list.save();

    return res.status(200).json({ message: 'List updated successfully', list });
  } catch (error) {
    console.error('Error updating list:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete List Function
export const deletelist = async (req, res) => {
  try {
    const { id } = req.params;  // Access listId from params

    // Find and delete the list by ID
    const deletedList = await List.findByIdAndDelete(id);

    if (!deletedList) {
      return res.status(404).json({ message: 'List not found' });
    }

    return res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update List Order Function
export const updateListOrder = async (req, res) => {
  try {
    const { id } = req.params;  // Access boardId from params
    const boardId = id;
    const { listIds } = req.body;

    if (!listIds || listIds.length === 0) {
      return res.status(400).json({ message: 'List IDs are required' });
    }

    // Find the board to make sure it exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Update the lists order in the board
    const updatePromises = listIds.map((id, index) => {
      return List.updateOne(
        { _id: id }, 
        { $set: { order: index } }  // Set the order based on the index in the listIds array
      );
    });

    await Promise.all(updatePromises); // Ensure all updates are completed

    return res.status(200).json({ message: 'List order updated successfully' });
  } catch (error) {
    console.error('Error updating list order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
