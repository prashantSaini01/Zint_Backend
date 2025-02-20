

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';


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


// Outlook new Logic 
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create reusable transporter object using Outlook SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com', // Outlook SMTP server
  port: 587, // Use 587 for TLS
  secure: false, // Use `false` for port 587
  auth: {
    user: process.env.OUTLOOK_EMAIL, // Use environment variable for Outlook email
    pass: process.env.OUTLOOK_PASSWORD, // Use environment variable for Outlook password
  },
  tls: {
    rejectUnauthorized: false, // Allows self-signed certificates (optional)
  }
});

export const sendEmail = async ({ to,subject, html}) => {
  try {
    // Verify SMTP connection configuration
    await transporter.verify();

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.OUTLOOK_EMAIL,
      to,
      subject,
      html, // HTML version of the email
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};
