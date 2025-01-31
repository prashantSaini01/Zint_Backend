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
import { verifyJwt } from './middleware/authMiddleware.js';

// Load environment variables from .env
dotenv.config();

const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any custom headers you might be sending
};

// Apply CORS middleware before any routes
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/auth', authRoute);
app.use('/board', verifyJwt, boardRoute);
app.use('/card', verifyJwt, cardRoute);
app.use('/invite', verifyJwt, inviteRoute);
app.use('/schedule', verifyJwt, scheduleRoute);
app.use('/template', verifyJwt, templateRoute);
app.use('/valid', verifyJwt, validRoute);
app.use('/list', verifyJwt, listRoute);

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
