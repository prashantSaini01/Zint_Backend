import ScheduledCard from '../models/Schedule.js';
import Template from '../models/Template.js';
import Card from '../models/Card.js';
import {Cron} from 'croner';



const formatDate = () => {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
  const date = now.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }); // e.g., "01.03.2025"
  return `${day} - ${date}`;
};

const dateSuffix = formatDate();
export const createScheduledCard = async (event) => {
  try {
    const { templateId, cardTitle, boardId, listId } = JSON.parse(event.body);

    console.log("Received data:", { templateId, cardTitle, boardId, listId }); // Debugging

    // Find the template to get frequency details
    const template = await Template.findById(templateId);
    if (!template) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Template not found' })
      };
    }

    // Create scheduled card
    const scheduledCard = new ScheduledCard({
      templateId,
      cardTitle,
      boardId,
      listId,
      frequency: template.frequency,
      frequencyDetails: template.frequencyDetails
    });

    await scheduledCard.save();

    console.log("Scheduled card saved:", scheduledCard); // Debugging

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Scheduled card created successfully',
        scheduledCard
      })
    };
  } catch (error) {
    console.error('Error creating scheduled card:', error); // Debugging
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating scheduled card',
        error: error.message
      })
    };
  }
};

// Scheduler function
const scheduleCardCreation = async () => {
  const scheduledCards = await ScheduledCard.find({ status: 'active' })
  .populate('templateId')
  .populate('boardId');

  scheduledCards.forEach((scheduledCard) => {
    const { frequency, frequencyDetails } = scheduledCard;
    let cronExpressions = [];

    switch (frequency) {
      case 'every2minutes':
        cronExpressions.push('*/2 * * * *');
        break;
      case 'weekly':
        cronExpressions.push(`0 9 * * ${frequencyDetails.day || 1}`);
        // cronExpressions.push('*/1 * * * *');
        break;
      case 'biweekly':
        if (frequencyDetails.day1 && frequencyDetails.day2) {
          cronExpressions.push(`0 9 * * ${frequencyDetails.day1}`);
          cronExpressions.push(`0 9 * * ${frequencyDetails.day2}`);
        }
        break;
      case 'monthly':
        cronExpressions.push(`0 9 ${frequencyDetails.date || 1} * *`);
        break;
      case 'quarterly':
        cronExpressions.push(`0 9 ${frequencyDetails.date || 1} */3 *`);
        break;
      case 'fortnightly':
        cronExpressions.push(`0 9 */14 * *`);
        break;
      case 'yearly':
        if (frequencyDetails.date) {
          const [month, day] = frequencyDetails.date.split('-');
          cronExpressions.push(`0 9 ${day} ${month} *`);
        }
        break;
      default:
        return;
    }

    cronExpressions.forEach((cronExpression) => {
      new Cron(cronExpression, async () => {
        try {
          // Create a new card based on the scheduled card details
          
  
          const newCard = new Card({
            title: `${scheduledCard.cardTitle} - ${dateSuffix}`,
            description: scheduledCard.templateId.description,
            subtasks: scheduledCard.templateId.subtasks,
            list: scheduledCard.listId,
            board: scheduledCard.boardId,
            position: 0
          });

          await newCard.save();
          console.log(`Card created from scheduled card: ${scheduledCard.cardTitle}`);
        } catch (error) {
          console.error('Yaha Error ha', error);
        }
      });
    });
  });
};

// Get all scheduled cards
export const getScheduledCards = async (event) => {
  try {
    // const scheduledCards = await ScheduledCard.find().populate('templateId');
    const scheduledCards = await ScheduledCard.find({ status: 'active' })
    .populate('templateId')
    .populate('boardId')
    .populate('listId');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scheduled cards retrieved successfully',
        scheduledCards: scheduledCards.map((card) => ({
          id: card._id,
          cardTitle: card.cardTitle,
          boardId: card.boardId,
          // boardName: card.boardId ? card.boardId.title : 'AAA', // Add board name
          boardName: card.boardId && card.boardId.title ? card.boardId.title : 'Unknown Board',
          listName: card.listId ? card.listId.title : 'Unknown List',
          listId: card.listId,
          status: card.status,
          frequency: card.frequency,
          frequencyDetails: card.frequencyDetails,
          templateName: card.templateId ? card.templateId.name : 'N/A'
        }))
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error retrieving scheduled cards',
        error: error.message
      })
    };
  }
};

// Optional: Cancel a scheduled card
export const cancelScheduledCard = async (event) => {
  try {
    const { id } = event.pathParameters;
    console.log("Cancelling scheduled card with ID:", id); // Add logging


    const scheduledCard = await ScheduledCard.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!scheduledCard) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Scheduled card not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scheduled card cancelled successfully',
        scheduledCard
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error cancelling scheduled card',
        error: error.message
      })
    };
  }
};

export const startScheduler = () => {
  console.log("Starting scheduler...");
  scheduleCardCreation();
};