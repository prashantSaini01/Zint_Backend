// import Template from '../models/Template.js';
// import Card from '../models/Card.js';
// import { Cron } from 'croner';

// import Board from '../models/Board.js';
// import List from '../models/List.js';

// const formatDate = () => {
//     const now = new Date();
//     const day = now.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
//     const date = now.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }); // e.g., "01.03.2025"
//     return `${date}`;
//   };
  
  
  
//   const scheduleCardCreation = async () => {
//     const scheduledCards = await Template.find()
//       .populate('boardId');
  
//     scheduledCards.forEach((scheduledCard) => {g
//       const { frequency, frequencyDetails } = scheduledCard;
//       let cronExpressions = [];
  
//       switch (frequency) {
//         case 'weekly':
//           // For Testing Purpose
//           cronExpressions.push(`*/1 * * * *`);
//           // cronExpressions.push(`0 9 * * ${frequencyDetails.day || 1}`);
//           break;
//         case 'biweekly':
//           if (frequencyDetails.day1 && frequencyDetails.day2) {
//             cronExpressions.push(`0 9 * * ${frequencyDetails.day1}`);
//             cronExpressions.push(`0 9 * * ${frequencyDetails.day2}`);
//           }
//           break;
//         case 'monthly':
//           cronExpressions.push(`0 9 ${frequencyDetails.date || 1} * *`);
//           break;
//         case 'quarterly':
//           cronExpressions.push(`0 9 ${frequencyDetails.date || 1} ${frequencyDetails.month || 1} *`);
//           break;
//         case 'fortnightly':
//           if (frequencyDetails.days) {
//             frequencyDetails.days.forEach(day => {
//               cronExpressions.push(`0 9 */14 * * ${day}`);
//             });
//           }
//           break;
//         case 'yearly':
//           if (frequencyDetails.date) {
//             const [month, day] = frequencyDetails.date.split('-');
//             cronExpressions.push(`0 9 ${day} ${month} *`);
//           }
//           break;
//         default:
//           return;
//       }
  
//       cronExpressions.forEach((cronExpression) => {
//         new Cron(cronExpression, async () => {
//           try {
//             const currentDateSuffix = formatDate(); 
//             const newCard = new Card({
//               title: `${scheduledCard.name} ${frequency} ${currentDateSuffix}`,
//               description: scheduledCard.description,
//               subtasks: scheduledCard.subtasks,
//               list: scheduledCard.listId,
//               board: scheduledCard.boardId,
//               position: 0,
//               assignedUsers: scheduledCard.assignedUsers,
//             });
  
//             await newCard.save();
//             console.log(`Card created from scheduled card: ${scheduledCard.name}`);
//           } catch (error) {
//             console.error('Error Creating Schedule', error);
//           }
//         });
//       });
//     });
//   };
  
  
//   export const startScheduler = () => {
//     console.log("Starting scheduler...");
//     scheduleCardCreation();
//   };


  
import Template from '../models/Template.js';
import Card from '../models/Card.js';
import Board from '../models/Board.js';
import List from '../models/List.js';

const formatDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

const getCurrentDay = () => new Date().getDay(); // 0 (Sunday) - 6 (Saturday)


const scheduleCardCreation = async () => {
  console.log("📚 Running scheduled card creation...");
  
  // Fetch scheduled templates
  const scheduledCards = await Template.find({ deleted: false }).populate('boardId');

  console.log(`🔍 Found ${scheduledCards.length} scheduled templates`);

  for (const scheduledCard of scheduledCards) {
      console.log(`📌 Checking template: ${scheduledCard.name}, Frequency: ${scheduledCard.frequency}`);

      const { frequency, frequencyDetails } = scheduledCard;
      const currentDate = new Date();
      let shouldCreateCard = false;

      switch (frequency) {
          case 'weekly':
              console.log(`📆 Today is ${String(getCurrentDay())}, Expected: ${frequencyDetails.day}`);
              if (String(getCurrentDay()) === frequencyDetails.day) {
                  shouldCreateCard = true;
              }
              break;
          case 'biweekly':
              console.log(`📆 Today is ${String(getCurrentDay())}, Expected: ${frequencyDetails.day1}, ${frequencyDetails.day2}`);
              if ([frequencyDetails.day1, frequencyDetails.day2].includes(String(getCurrentDay()))) {
                  shouldCreateCard = true;
              }
              break;
          case 'monthly':
              // console.log( "  Type of month ",typeof(frequencyDetails.date), frequencyDetails.date);
              console.log(`📆 Today is ${(currentDate.getDate())}, Expected: ${frequencyDetails.date}`);
              if ((currentDate.getDate()) === frequencyDetails.date) {
                  shouldCreateCard = true;
              }
              // console.log(shouldCreateCard)
              break;
          case 'quarterly':
            console.log(typeof(frequencyDetails.date), frequencyDetails.date);
            console.log(typeof(frequencyDetails.month), frequencyDetails.month);

              console.log(`📆 Today is ${String(currentDate.getDate())} / ${String(currentDate.getMonth() + 1)}, Expected: ${frequencyDetails.date} / ${frequencyDetails.month}`);
              if (
                  (currentDate.getDate()) === frequencyDetails.date &&
                  String(currentDate.getMonth() + 1) === frequencyDetails.month
              ) {
                  shouldCreateCard = true;
              }
              // console.log(shouldCreateCard)
              break;
            
          case 'fortnightly':
              console.log(`📆 Today is ${String(getCurrentDay())}, Expected in: ${frequencyDetails.days}`);
              if (frequencyDetails.days.includes(String(getCurrentDay()))) {
                  shouldCreateCard = true;
              }
              break;
          case 'yearly':
              console.log(`📆 Today is ${String(formatDate())}, Expected: ${frequencyDetails.date}`);
              if (formatDate().endsWith(frequencyDetails.date)) {
                  shouldCreateCard = true;
              }
              break;
      }

      if (shouldCreateCard) {
          try {
              console.log(`✅ Creating card for: ${scheduledCard.name}`);
              const currentDateSuffix = formatDate();
              const newCard = new Card({
                  title: `${scheduledCard.name} ${frequency} ${currentDateSuffix}`,
                  description: scheduledCard.description,
                  subtasks: scheduledCard.subtasks,
                  list: scheduledCard.listId,
                  board: scheduledCard.boardId,
                  position: 0,
                  assignedUsers: scheduledCard.assignedUsers,
              });

              await newCard.save();
              console.log(`🎉 Card successfully created: ${newCard.title}`);
          } catch (error) {
              console.error('❌ Error creating scheduled card:', error);
          }
      } else {
          console.log(`🚫 Skipping card creation for: ${scheduledCard.name}`);
      }
  }
};



export const startScheduler = async () => {
    console.log('🚀 Running scheduled card creation...');
    await scheduleCardCreation();
};
