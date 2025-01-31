import mongoose from 'mongoose';
import List from '../models/List.js';
import Card from '../models/Card.js';
import User from '../models/User.js';

// Create Card Function
export const createcard = async (req, res) => {
  try {
    const { id } = req.params;
    const listId = id;
    const { title, description, position, subtasks } = req.body;

    if (!title || !listId || position === undefined) {
      return res.status(400).json({ message: 'Title, List ID, and Position are required' });
    }

    const list = await List.findById(listId).populate('boardId');
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const boardId = list.boardId?._id;
    if (!boardId) {
      return res.status(400).json({ message: 'List must belong to a board' });
    }

    const newCard = new Card({
      title,
      description,
      list: listId,
      board: boardId,
      subtasks: subtasks || [],
      position,  // Set the position of the card
    });
    await newCard.save();

    return res.status(201).json({ message: 'Card created successfully', card: newCard });
  } catch (error) {
    console.error('Error creating card:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all Cards Function
export const getcards = async (req, res) => {
  try {
    const { id } = req.params;
    const listId = id;

    if (!listId || !mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: 'Invalid or missing List ID' });
    }

    const cards = await Card.find({ list: listId });
    if (cards.length === 0) {
      return res.status(404).json({ message: 'No cards found for this List ID' });
    }

    return res.status(200).json({ cards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get Card by ID
export const getcardbyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Card ID' });
    }

    const card = await Card.findById(id).populate({
      path: 'assignedUsers',
      select: 'email',
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const assignedUsers = card.assignedUsers.map(user => user.email);

    return res.status(200).json({ card: { ...card.toObject(), assignedUsers } });
  } catch (error) {
    console.error('Error fetching card:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update Card Function
export const updatecard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, listId, position, assignedUsers, subtasks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Card ID' });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const userObjectIds = [];
    if (assignedUsers && Array.isArray(assignedUsers)) {
      for (const email of assignedUsers) {
        const user = await User.findOne({ email });
        if (user) {
          userObjectIds.push(user._id);
        }
      }
    }

    if (listId && listId !== card.list.toString()) {
      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(400).json({ message: 'Invalid List ID' });
      }

      const newList = await List.findById(listId);
      if (!newList) {
        return res.status(404).json({ message: 'New list not found' });
      }

      await List.findByIdAndUpdate(card.list, { $pull: { cards: card._id } });

      if (!Array.isArray(newList.cards)) {
        newList.cards = [];
      }

      newList.cards.splice(position || 0, 0, card._id);
      await newList.save();

      card.list = listId;
    }

    card.title = title || card.title;
    card.description = description || card.description;
    card.assignedUsers = userObjectIds;

    if (subtasks && Array.isArray(subtasks)) {
      card.subtasks = subtasks.map(subtask => ({
        title: subtask.title,
        dueDate: subtask.dueDate,
        assignedTo: subtask.assignedTo,
        completed: subtask.completed || false,
      }));
    }

    await card.save();

    return res.status(200).json({ message: 'Card updated successfully', card });
  } catch (error) {
    console.error('Error updating card:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete Card Function
export const deletecard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Card ID' });
    }

    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    return res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update Card Order Function
export const updateCardOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const listId = id;
    const { cardOrders } = req.body;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: 'Invalid List ID' });
    }

    if (!Array.isArray(cardOrders)) {
      return res.status(400).json({ message: 'cardOrders must be an array' });
    }

    const cards = await Card.find({ list: listId });
    const cardIds = cards.map(card => card._id.toString());

    const validCards = cardOrders.every(order => 
      cardIds.includes(order.cardId) && 
      typeof order.position === 'number'
    );

    if (!validCards) {
      return res.status(400).json({ message: 'Invalid card IDs or positions' });
    }

    const updatePromises = cardOrders.map(({ cardId, position }) => 
      Card.findByIdAndUpdate(
        cardId,
        { position },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    const updatedCards = await Card.find({ list: listId }).sort('position');

    return res.status(200).json({
      message: 'Card positions updated successfully',
      cards: updatedCards
    });
  } catch (error) {
    console.error('Error updating card positions:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
