import { Router } from "express";
import { createlist, getlists, getlistsbyid, updatelist, deletelist, updateListOrder } from '../controllers/listController.js';


const listRoute = Router();


listRoute.post('/boards/:id', createlist);
listRoute.get('/boards/:id', getlists);
listRoute.get('/:id', getlistsbyid);
listRoute.put('/:id', updatelist);
listRoute.delete('/:id', deletelist);
listRoute.put('/boards/:id/order', updateListOrder);


export default listRoute;