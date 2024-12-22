import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email already exists' }),
      };
    }

    const user = await User.create({ name, email, password });

    const token = createToken(user._id);
    return {
      statusCode: 201,
      headers: {
        'Set-Cookie': `jwt=${token}; HttpOnly; Path=/; Secure`,
      },
      body: JSON.stringify({ message: 'Signup successful', user: { name, email } }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

// Login Function
export const login = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }

    const token = createToken(user._id);
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `jwt=${token}; HttpOnly; Path=/; Secure`,
      },
      body: JSON.stringify({ message: 'Login successful', user: { name: user.name, email } }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
