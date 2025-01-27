import nodemailer from 'nodemailer';


// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "sainiprashant300@gmail.com",
    pass: "cecv xlds kitr yfen" // Use App Password, not regular Gmail password
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
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};