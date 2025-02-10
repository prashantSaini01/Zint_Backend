import { Router } from 'express';

import { updatePassword,updateName,getMe } from '../controllers/userController.js';

const userRoute = Router();

userRoute.post('/', getMe);
userRoute.post('/name', updateName);
userRoute.post('/password',updatePassword);


export default userRoute;
