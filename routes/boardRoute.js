import { Router } from "express";
import { createboard, getboard, getboardbyid, updateboard, deleteboard } from '../controllers/boardController.js';


const boardRoute = Router();


boardRoute.post('/',createboard );
boardRoute.get('/', getboard);
boardRoute.get('/:id', getboardbyid);
boardRoute.put('/:id', updateboard);
boardRoute.delete('/:id', deleteboard);


export default boardRoute;

