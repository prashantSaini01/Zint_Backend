import { Router } from "express";
import { validateInvite } from "../controllers/inviteHandlers.js";
import { checkUser } from "../controllers/check.js";

const validRoute = Router();


validRoute.get('/invites/:token', validateInvite);
validRoute.get('/users/check', checkUser);




export default validRoute;