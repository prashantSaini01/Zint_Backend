// import jwt from 'jsonwebtoken';

// const SECRET_KEY = process.env.JWT_SECRET; // Replace with your actual secret key

// // Middleware to verify JWT token
// export const verifyJwt = (req, res, next) => {
//   try {
//     // Retrieve token from request headers
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) {
//       return res.status(401).json({ message: 'Authorization header is missing' });
//     }

//     const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
//     if (!token) {
//       return res.status(401).json({ message: 'JWT token is missing' });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded; // Add decoded user information to the request object
    
//     next(); // Pass control to the next middleware or route handler
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };


// export const verifyApiKey = (req, res, next) => {
//   try {
//     // Retrieve the API key from the request headers
//     const apiKey = req.headers['x-api-key'];

//     // Define your expected API key (can be moved to env variables for better security)
//     const expectedApiKey = process.env.X_KEY;

//     // Check if API key is missing or incorrect
//     if (!apiKey) {
//       return res.status(401).json({ message: 'API key is missing' });
//     }

//     if (apiKey !== expectedApiKey) {
//       return res.status(401).json({ message: 'Invalid API key' });
//     }

//     // If the API key is valid, continue to the next middleware or route handler
//     next();
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET; // Replace with your actual secret key
const EXPECTED_API_KEY = process.env.X_KEY; // Replace with your actual API key

// Unified middleware for authentication
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const apiKey = req.headers['x-api-key'];

    // Verify API key if provided
    if (apiKey) {
      if (apiKey === EXPECTED_API_KEY) {
        return next(); // Valid API key, proceed
      } else {
        return res.status(401).json({ message: 'Invalid API key' });
      }
    }

    // Verify JWT if Authorization header is provided
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
      if (!token) {
        return res.status(401).json({ message: 'JWT token is missing' });
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // Add decoded user information to the request object

      return next(); // Valid JWT, proceed
    }

    // If neither API key nor JWT is provided, deny access
    return res.status(401).json({ message: 'Authorization is required' });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};