import { Router } from "express";
import { getTemplates,createTemplate,updateTemplate,getTemplateById,deleteTemplate } from '../controllers/templateController.js';


const templateRoute = Router();


templateRoute.get('/', getTemplates);
templateRoute.post('/', createTemplate);
templateRoute.put('/:id', updateTemplate);
templateRoute.get('/:id', getTemplateById);
templateRoute.delete('/:id', deleteTemplate);


export default templateRoute;