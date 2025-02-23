// import serverlessHttp from 'serverless-http';
// import serverless from 'serverless-http'
// import { app } from './index.js';
// import { connectDB } from './utils/db.js';
// import { startScheduler } from './utils/schedular.js';


// let isConnected = false;
// let scheduleStart = false;

// // Initialize database connection
// const initializeDB = async () => {
//   if (!isConnected) {
//     try {
//       await connectDB();
//       isConnected = true;
//       console.log('Database connection initialized');
//     } catch (error) {
//       console.error('Failed to initialize database:', error);
//       isConnected = false;
//       throw error;
//     }
//   }
// };

// // Initialize scheduler
// const initializeScheduler = async () => {
//   if (!scheduleStart) {
//     try {
//       await startScheduler();
//       scheduleStart = true;
//       console.log('Starting scheduler...');
//     } catch (error) {
//       console.error('Failed to start scheduler:', error);
//       scheduleStart = false;
//       throw error;
//     }
//   }
// };

// // Lambda handler
// export const handler = async (event, context) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   // Initialize resources
//   await initializeDB();
//   await initializeScheduler();

//   // Create serverless handler
//   // console.log("Before ServerlessHnadler")

 
//   // Handle the request


//   // const handler = serverlessHttp(app);
//   const handler = serverless(app);

//   // console.log("After ServerlessHnadler")


//   // Handle the request
//   return handler(event, context);
// };



import serverlessHttp from 'serverless-http';
import serverless from 'serverless-http';
import { app } from './index.js';
import { connectDB } from './utils/db.js';
import { startScheduler } from './utils/schedular.js';

let isConnected = false;

// Initialize database connection
const initializeDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ Database connection initialized');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      isConnected = false;
      throw error;
    }
  }
};

// Lambda handler


export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await initializeDB();

  // Check if the event is from EventBridge
  if (event.source === "eventbridge" && event.action === "trigger_scheduled_cards") {
    console.log("✅ EventBridge Trigger Detected. Running Scheduler...");
    await startScheduler(); // Run only when triggered by EventBridge
  } else {
    console.log("🔄 Regular API Request. Skipping Scheduler...");
  }

  // Handle normal API requests
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

