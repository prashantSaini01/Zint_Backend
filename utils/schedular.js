import Template from '../models/Template.js';
import Card from '../models/Card.js';
import { Cron } from 'croner';

import Board from '../models/Board.js';
import List from '../models/List.js';

const formatDate = () => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
    const date = now.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }); // e.g., "01.03.2025"
    return `${day} - ${date}`;
  };
  
  
  
  const scheduleCardCreation = async () => {
    const scheduledCards = await Template.find()
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
            const currentDateSuffix = formatDate(); 
            const newCard = new Card({
              title: `${scheduledCard.cardTitle} - ${currentDateSuffix}`,
              description: scheduledCard.description,
              subtasks: scheduledCard.subtasks,
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
  
  
  export const startScheduler = () => {
    console.log("Starting scheduler...");
    scheduleCardCreation();
  };
  