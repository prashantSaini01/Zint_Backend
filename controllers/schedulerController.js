import ScheduledCard from '../models/Schedule.js';
import Template from '../models/Template.js';
import Card from '../models/Card.js';
import { Cron } from 'croner';

const formatDate = () => {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
  const date = now.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }); // e.g., "01.03.2025"
  return `${day} - ${date}`;
};

const dateSuffix = formatDate();

export const createScheduledCard = async (req, res) => {
  try {
    const { templateId, cardTitle, boardId, listId } = req.body;

    console.log("Received data:", { templateId, cardTitle, boardId, listId });

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const scheduledCard = new ScheduledCard({
      templateId,
      cardTitle,
      boardId,
      listId,
      frequency: template.frequency,
      frequencyDetails: template.frequencyDetails
    });

    await scheduledCard.save();

    console.log("Scheduled card saved:", scheduledCard);

    return res.status(201).json({
      message: 'Scheduled card created successfully',
      scheduledCard
    });
  } catch (error) {
    console.error('Error creating scheduled card:', error);
    return res.status(500).json({
      message: 'Error creating scheduled card',
      error: error.message
    });
  }
};

const scheduleCardCreation = async () => {
  const scheduledCards = await ScheduledCard.find({ status: 'active' })
    .populate('templateId')
    .populate('boardId');

  scheduledCards.forEach((scheduledCard) => {
    const { frequency, frequencyDetails } = scheduledCard;
    let cronExpressions = [];

    switch (frequency) {
      case 'weekly':
        cronExpressions.push(`0 9 * * ${frequencyDetails.day || 1}`);
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
        cronExpressions.push(`0 9 ${frequencyDetails.date || 1} ${frequencyDetails.month || 1} *`);
        break;
      case 'fortnightly':
        if (frequencyDetails.days) {
          frequencyDetails.days.forEach(day => {
            cronExpressions.push(`0 9 */14 * * ${day}`);
          });
        }
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
          console.error('Error Creating Schedule', error);
        }
      });
    });
  });
};

export const getScheduledCards = async (req, res) => {
  try {
    const scheduledCards = await ScheduledCard.find({ status: 'active' })
      .populate('templateId')
      .populate('boardId')
      .populate('listId');

    return res.status(200).json({
      message: 'Scheduled cards retrieved successfully',
      scheduledCards: scheduledCards.map((card) => ({
        id: card._id,
        cardTitle: card.cardTitle,
        boardId: card.boardId,
        boardName: card.boardId && card.boardId.title ? card.boardId.title : 'Unknown Board',
        listName: card.listId ? card.listId.title : 'Unknown List',
        listId: card.listId,
        status: card.status,
        frequency: card.frequency,
        frequencyDetails: card.frequencyDetails,
        templateName: card.templateId ? card.templateId.name : 'N/A'
      }))
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving scheduled cards',
      error: error.message
    });
  }
};

export const cancelScheduledCard = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Cancelling scheduled card with ID:", id);

    const scheduledCard = await ScheduledCard.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!scheduledCard) {
      return res.status(404).json({ message: 'Scheduled card not found' });
    }

    return res.status(200).json({
      message: 'Scheduled card cancelled successfully',
      scheduledCard
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error cancelling scheduled card',
      error: error.message
    });
  }
};

export const startScheduler = () => {
  console.log("Starting scheduler...");
  scheduleCardCreation();
};
