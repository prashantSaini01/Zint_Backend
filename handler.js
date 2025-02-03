import serverlessHttp from 'serverless-http';
import serverless from 'serverless-http'
import { app } from './index.js';
import { connectDB } from './utils/db.js';
import { startScheduler } from './controllers/schedulerController.js';


let isConnected = false;
let scheduleStart = false;

// Initialize database connection
const initializeDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('Database connection initialized');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      isConnected = false;
      throw error;
    }
  }
};

// Initialize scheduler
const initializeScheduler = async () => {
  if (!scheduleStart) {
    try {
      await startScheduler();
      scheduleStart = true;
      console.log('Starting scheduler...');
    } catch (error) {
      console.error('Failed to start scheduler:', error);
      scheduleStart = false;
      throw error;
    }
  }
};

// Lambda handler
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Initialize resources
  await initializeDB();
  await initializeScheduler();

  // Create serverless handler
  console.log("Before ServerlessHnadler")

 
  // Handle the request


  // const handler = serverlessHttp(app);
  const handler = serverless(app);

  console.log("After ServerlessHnadler")


  // Handle the request
  return handler(event, context);
};

