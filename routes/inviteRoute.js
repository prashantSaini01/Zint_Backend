import { Router } from "express";
import { getBoardInvites, acceptInvite, deleteInvite, createInvite,rejectInvite} from '../controllers/inviteHandlers.js';

const inviteRoute = Router();

inviteRoute.post('/boards/:id', createInvite);
inviteRoute.get('/boards/:id', getBoardInvites);
inviteRoute.post('/:token/accept', acceptInvite);
inviteRoute.post('/:token/reject', rejectInvite);
inviteRoute.delete('/:id/:inviteId', deleteInvite);

export default inviteRoute;
