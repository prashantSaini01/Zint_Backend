import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { formatJSONResponse } from '../utils/apigateway.js';

// Helper to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Signup Function
export const signup = async (event) => {
  try {
    const { name, email, password } = JSON.parse(event.body);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return formatJSONResponse(400, {
       message: 'Email already exists' 
      });
    }

    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    
    return formatJSONResponse(200, {
     
        message: 'Signup successful', 
        user: { name, email } 
      
    }, token);
  } catch (error) {
    return formatJSONResponse(500, {
       message: error.message 
    });
  }
};

// Login Function
export const login = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return formatJSONResponse(401, {
        message: 'Invalid email or password' 
      });
    }

    const token = createToken(user._id);
    return formatJSONResponse(200, {
      
        message: 'Login successful', 
        user: { name: user.name, email } 
      
    }, token);
  } catch (error) {
    return formatJSONResponse(500, {
     message: error.message 
    });
  }
};

// Logout Function
export const logout = async (event) => {
  try {
    return formatJSONResponse(200, {
      message: 'Logout successful' 
    });
  } catch (error) {
    return formatJSONResponse(500, {
      message: error.message 
    });
  }
};