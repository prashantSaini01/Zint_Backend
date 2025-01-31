import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET; // Replace with your actual secret key

// Middleware to verify JWT token
export const verifyJwt = (req, res, next) => {
  try {
    // Retrieve token from request headers
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'JWT token is missing' });
    }

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Add decoded user information to the request object
    
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
