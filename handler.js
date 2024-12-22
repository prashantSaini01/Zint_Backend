import { signup, login } from './controllers/authController.js';

export const signupHandler = async (event) => signup(event);
export const loginHandler = async (event) => login(event);
