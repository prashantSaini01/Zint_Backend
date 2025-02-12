import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Signup Function
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = createToken(user._id);

    return res.status(200).json({
      message: 'Signup successful',
      user: { name, email },
      token, // Include the token in the response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Login Function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = createToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      user: { name: user.name, email,
        profilePicture: user.profilePicture,},
      token, // Include the token in the response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Logout Function
export const logout = async (req, res) => {
  try {
    // You can handle the logout process here (like removing the JWT token from the client-side or session)
    // For now, just sending a message back.
    return res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
