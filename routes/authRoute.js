import { Router } from 'express';

import { login,logout,signup } from '../controllers/authController.js';

const authRoute = Router();

authRoute.post('/login', login);
authRoute.post('/signup', signup);
authRoute.post('/logout',logout);


export default authRoute;
