// controllers/check.js
import User from "../models/User.js";
import mongoose from "mongoose";

export const checkUser = async (req, res) => {
  const email = req.query.email;  // Accessing query parameter from req.query

  console.log('Checking user with email:', email); // Log the email

  // Ensure Mongoose is connected to the database
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    const userExists = await User.findOne({ email });

    console.log('User exists:', !!userExists); // Log whether the user exists

    if (userExists) {
      return res.status(200).json({ exists: true });  // Responding with JSON
    } else {
      return res.status(200).json({ exists: false });  // Responding with JSON
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ message: "Error checking user" });  // Sending error response
  }
};
