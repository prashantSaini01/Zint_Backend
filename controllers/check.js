// controllers/check.js
import User from "../models/User.js";
import mongoose from "mongoose";

export const checkUser = async (event) => {
  const email = event.queryStringParameters.email;

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
      return {
        statusCode: 200,
        body: JSON.stringify({ exists: true }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ exists: false }),
      };
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error checking user" }),
    };
  }
};