import { signup, login } from './controllers/authController.js';
import jwt from 'jsonwebtoken';
import { createboard,getboard,getboardbyid,updateboard,deleteboard } from './controllers/boardController.js';
import { createlist,getlists,getlistsbyid,updatelist,deletelist } from './controllers/listController.js';
import mongoose from 'mongoose';


mongoose.connect(process.env.MONGO_URI);

// login and Signup Functions
export const signupHandler = async (event) => signup(event);
export const loginHandler = async (event) => login(event);

// Board Functions
export const createBoardHandler = async(event) => createboard(event); 
export const getBoardsHandler = async(event) => getboard(event);
export const getBoardByIdHandler = async(event) => getboardbyid(event);
export const updateBoardHandler = async(event) => updateboard(event);
export const deleteBoardHandler = async(event) => deleteboard(event);


// List Functions
export const createListHandler = async(event) => createlist(event);
export const getListsHandler = async(event) => getlists(event);
export const getListByIdHandler = async(event) => getlistsbyid(event);
export const updateListHandler = async(event) => updatelist(event);
export const deleteListHandler = async(event) => deletelist(event);




// Protected Routes Authorization Function
export const authorize = async (event) => {
  // Extract the 'jwt' cookie value from the request headers (not Set-Cookie)
  const cookies = event.headers.Cookie;  // Request headers (Cookie header)
  
  if (!cookies) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized: No cookie provided' }),
    };
  }

  // Extract the JWT token from the 'jwt' cookie in the request header
  const token = cookies.split(';').find(cookie => cookie.trim().startsWith('jwt='));
  
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized: No JWT token in cookie' }),
    };
  }

  const jwtToken = token.split('=')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
 

    // Return IAM policy allowing access to the requested resource
    return {
      principalId: decoded.id, // Ensure this is returned and available for the event context
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
      context: {
        role: "admin"
      }
    };
  } catch (err) {
    // If JWT is invalid or expired, deny access
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid or expired JWT token' ,decoded}),
    };
  }
};