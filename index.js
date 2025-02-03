import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoute from './routes/authRoute.js';
import boardRoute from './routes/boardRoute.js';
import cardRoute from './routes/cardRoute.js';
import inviteRoute from './routes/inviteRoute.js';
import listRoute from './routes/listRoute.js';
import scheduleRoute from './routes/scheduleRoute.js';
import templateRoute from './routes/templateRoute.js';
import validRoute from './routes/vaildRoute.js';
import { verifyJwt,verifyApiKey } from './middleware/authMiddleware.js';

// Load environment variables from .env
dotenv.config();

const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: ['https://deployment.d3iar3akvow17y.amplifyapp.com','http://localhost:3000', 'http://localhost:3001'], // Add all allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Include custom headers if used
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Apply CORS middleware before any routes
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/auth', authRoute);
app.use('/board', verifyJwt, boardRoute);
app.use('/card', verifyJwt, cardRoute);
app.use('/invite', verifyJwt,inviteRoute);
app.use('/schedule', verifyJwt, scheduleRoute);
app.use('/template', verifyJwt, templateRoute);
app.use('/valid',validRoute);
app.use('/list', verifyJwt, listRoute);
app.use('/api/card',verifyApiKey,cardRoute)

// Root route
app.get('/', (req, res) => {
  res.send('Server is calling');
});

// Handle all other routes with a 404 error
app.all('*', (req, res) => {
  res.status(404).send({
    error: true,
    code: 404,
    msg: 'Api Not Found',
  });
});

// Export the app
export { app };
