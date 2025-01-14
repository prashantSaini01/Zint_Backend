import mongoose from 'mongoose';
import Board from '../models/Board.js';
import List from '../models/List.js';
import Card from '../models/Card.js';


export const createcard = async (event) => {
  try {
    const { listId } = event.pathParameters;
    const { title, description, position } = JSON.parse(event.body);

    if (!title || !listId || position === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Title, List ID, and Position are required' }),
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

    const newCard = new Card({
      title,
      description,
      list: listId,
      board: boardId,
      position,  // Set the position of the card
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

export const updatecard = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, description, listId, position } = JSON.parse(event.body);

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

    if (listId && listId !== card.list.toString()) {
      // Handle moving the card to a new list
      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid List ID' }),
        };
      }

      const newList = await List.findById(listId);
      if (!newList) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'New list not found' }),
        };
      }

      // Remove card from current list
      await List.findByIdAndUpdate(card.list, { $pull: { cards: card._id } });

      // Ensure newList.cards is an array before using splice
      if (!Array.isArray(newList.cards)) {
        newList.cards = []; // Initialize if undefined
      }

      // Add card to new list at the specified position
      newList.cards.splice(position || 0, 0, card._id); // Insert at the specified position
      await newList.save();

      card.list = listId; // Update card's list ID
    }

    // Update other card details
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


// Add this to your card controllers file

export const updateCardOrder = async (event) => {
  try {
    const { listId } = event.pathParameters;
    const { cardOrders } = JSON.parse(event.body);

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid List ID' }),
      };
    }

    // Validate cardOrders array
    if (!Array.isArray(cardOrders)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'cardOrders must be an array' }),
      };
    }

    // Validate each card belongs to the list
    const cards = await Card.find({ list: listId });
    const cardIds = cards.map(card => card._id.toString());
    
    const validCards = cardOrders.every(order => 
      cardIds.includes(order.cardId) && 
      typeof order.position === 'number'
    );

    if (!validCards) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid card IDs or positions' }),
      };
    }

    // Update all card positions
    const updatePromises = cardOrders.map(({ cardId, position }) => 
      Card.findByIdAndUpdate(
        cardId,
        { position },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Fetch updated cards
    const updatedCards = await Card.find({ list: listId }).sort('position');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Card positions updated successfully',
        cards: updatedCards
      }),
    };
  } catch (error) {
    console.error('Error updating card positions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};