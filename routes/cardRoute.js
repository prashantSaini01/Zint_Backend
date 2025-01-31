import { Router } from "express";
import { createcard, getcards, getcardbyid, updatecard, deletecard, updateCardOrder} from '../controllers/cardController.js';



const cardRoute = Router();


cardRoute.post('/lists/:id', createcard);
cardRoute.get('/lists/:id', getcards);
cardRoute.get('/:id', getcardbyid);
cardRoute.put('/:id', updatecard);
cardRoute.delete('/:id', deletecard);
cardRoute.put('/lists/:id/order', updateCardOrder);


export default cardRoute;