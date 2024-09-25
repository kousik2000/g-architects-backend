const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');  // Import the CORS package
const app = express();
const PORT = 3000;
require('dotenv').config();

app.use(cors());
app.use(cors({
  origin: ['https://192.168.0.105:4200', 'https://garchitectsanddevelopers.in'],  // Allowed domains
  methods: ['GET', 'POST'],  // Allowed HTTP methods
}));
// Middleware to parse JSON body
app.use(express.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API to send the email after form submission
app.post('/send-email', async (req, res) => {
  console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS )
  const { name, email, message } = req.body;

  // Email to the business (from user's email)
  const mailToBusiness = {
    from: 'contact@garchitectsanddevelopers.in', // Set the valid from address
    to: 'contact@garchitectsanddevelopers.in',
    subject: `New Contact Form Submission from ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailToBusiness);
    await sendReplyEmail(name, email);  // Await the reply email function

    // Respond with success message
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email: ', error);
    return res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// Function to send reply email to the user
const sendReplyEmail = async (name, userEmail) => {
  const mailToUser = {
    from: 'contact@garchitectsanddevelopers.in', // Set the valid from address
    to: 'thirupathiannamaneni20@gmail.com', 
    subject: 'Thank You for Contacting Us!',
    html: `
      <h2>Hello,</h2>
      <p>An auto created mail that comes from website. 'kousik'</p>
      <p>Best regards,</p>
      <p>Your Business Team</p>
    `, 
  };

  try {
    await transporter.sendMail(mailToUser);
    console.log('Reply email sent successfully');
  } catch (err) {
    console.error('Error sending reply email: ', err);
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
