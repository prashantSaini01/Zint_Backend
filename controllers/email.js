

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// import { formatJSONResponse } from '../utils/apigateway.js';


// // Load environment variables from .env file
// dotenv.config();

// // Create reusable transporter object using Gmail SMTP
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USER, // Use environment variable for email user
//     pass: process.env.EMAIL_PASS  // Use environment variable for email password
//   }
// });

// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     // Verify SMTP connection configuration
//     await transporter.verify();
    
//     // Send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: `Zintle <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log('Message sent: %s', info.messageId);
//     return info;
//   } catch (error) {
//     console.error('Email sending error:', error);
//     throw new Error('Failed to send email');
//   }
// };

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { formatJSONResponse } from '../utils/apigateway.js';

// Load environment variables from .env file
dotenv.config();

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for email user
    pass: process.env.EMAIL_PASS  // Use environment variable for email password
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Verify SMTP connection configuration
    await transporter.verify();

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `Zintle <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);

    // Wrap the response in formatJSONResponse
    return formatJSONResponse(200, {
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email sending error:', error);

    // Wrap the error response in formatJSONResponse
    return formatJSONResponse(500, {
      error: 'Failed to send email',
      details: error.message,
    });
  }
};
