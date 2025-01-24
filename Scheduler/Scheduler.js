// Need to add to take BoardId Refrence from the Template and create the card in that board

import Cron from 'croner';
import Template from '../models/Template.js';
import Card from '../models/Card.js'; // Assuming you have a Card model

const scheduleCardCreation = async () => {
  const templates = await Template.find({ frequency: { $ne: 'none' } });

  templates.forEach((template) => {
    const { frequency, frequencyDetails } = template;

    let cronExpressions = [];

    switch (frequency) {
      case 'weekly':
        // Every week on the selected day at 9 AM
        cronExpressions.push(`0 9 * * ${frequencyDetails.day || 1}`);
        break;
      case 'biweekly':
        // Twice a week on the selected days at 9 AM
        if (frequencyDetails.day1 && frequencyDetails.day2) {
          cronExpressions.push(`0 9 * * ${frequencyDetails.day1}`);
          cronExpressions.push(`0 9 * * ${frequencyDetails.day2}`);
        }
        break;
      case 'monthly':
        // On the selected date of every month at 9 AM
        cronExpressions.push(`0 9 ${frequencyDetails.date || 1} * *`);
        break;
      case 'quarterly':
        // On the selected date of every 3rd month at 9 AM
        cronExpressions.push(`0 9 ${frequencyDetails.date || 1} */3 *`);
        break;
      case 'fortnightly':
        // Every 14 days at 9 AM
        cronExpressions.push(`0 9 */14 * *`);
        break;
      case 'yearly':
        // On the selected date (MM-DD) at 9 AM
        if (frequencyDetails.date) {
          const [month, day] = frequencyDetails.date.split('-');
          cronExpressions.push(`0 9 ${day} ${month} *`);
        }
        break;
      default:
        return;
    }

    cronExpressions.forEach((cronExpression) => {
      Cron(cronExpression, async () => {
        // Create a new card based on the template
        const newCard = new Card({
          title: template.name,
          description: template.description,
          subtasks: template.subtasks,
        });

        await newCard.save();
        console.log(`Card created from template: ${template.name}`);
      });
    });
  });
};

// Run the scheduler when the server starts
scheduleCardCreation();
