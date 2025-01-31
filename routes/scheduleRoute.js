import { Router } from "express";
import { createScheduledCard, getScheduledCards, cancelScheduledCard } from '../controllers/schedulerController.js';
  
 
const scheduleRoute = Router();


scheduleRoute.post('/', createScheduledCard);
scheduleRoute.get('/', getScheduledCards);
scheduleRoute.delete('/:id', cancelScheduledCard);


export default scheduleRoute;