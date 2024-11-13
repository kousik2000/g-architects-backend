const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');  // Import the CORS package
const app = express();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const PORT = 3000;
require('dotenv').config();

// const connection  = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "garchitects",
//   connectionLimit: 10
// })

app.use(cors());
app.use(cors({
  origin: ['https://192.168.0.105:4200', 'https://garchitectsanddevelopers.in', 'http://localhost:4200/'],  // Allowed domains
  methods: ['GET', 'POST'],  // Allowed HTTP methods
}));
// Middleware to parse JSON body
app.use(express.json());

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err.stack);
//     return;
//   }
//   console.log('Connected to the database as ID ' + connection.threadId);
// });

const base64Encoded = "SGVsbG8sIFdvcmxkIQ==";
const decodedStr = Buffer.from(base64Encoded, 'base64').toString('utf-8');

const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@garchitectsanddevelopers.in',
    pass: 'Saichand765899#',
  },
});

// API to send the email after form submission
app.post('/send-email', async (req, res) => {
  // console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS )
  const { name, phone, email, message,requirementType,areaValue,areaUnit } = req.body;
  
  const templatePath = path.join(__dirname, 'replyemail.html');
  let contactmail = fs.readFileSync(templatePath, 'utf-8');
  contactmail = contactmail.replace('{{name}}', name);
  contactmail = contactmail.replace('{{phone}}', phone);
  contactmail = contactmail.replace('{{email}}', email);
  contactmail = contactmail.replace('{{message}}', message);
  contactmail = contactmail.replace('{{requirementType}}', requirementType);
  contactmail = contactmail.replace('{{areaValue}}', areaValue);
  contactmail = contactmail.replace('{{areaUnit}}', areaUnit);
  // Email to the business (from user's email)
  const mailToBusiness = {
    from: 'contact@garchitectsanddevelopers.in',
    to: 'contact@garchitectsanddevelopers.in',
    subject: `New Contact Form Submission from ${name}`,
    html: contactmail
  };

  try {
    await transporter.sendMail(mailToBusiness);
    await sendReplyEmail(name, phone, email, message,requirementType,areaValue,areaUnit);

    // Respond with success message
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email: ', error);
    return res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// Function to send reply email to the user
const sendReplyEmail = async (name, phone, email, message,requirementType,areaValue,areaUnit) => {
  const templatePath = path.join(__dirname, 'replyemail.html');
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');
  htmlContent = htmlContent.replace('{{name}}', name);
  htmlContent = htmlContent.replace('{{name}}', name);
  htmlContent = htmlContent.replace('{{phone}}', phone);
  htmlContent = htmlContent.replace('{{email}}', email);
  htmlContent = htmlContent.replace('{{message}}', message);
  htmlContent = htmlContent.replace('{{requirementType}}', requirementType);
  htmlContent = htmlContent.replace('{{areaValue}}', areaValue);
  htmlContent = htmlContent.replace('{{areaUnit}}', areaUnit);
  const mailToUser = {
    from: 'contact@garchitectsanddevelopers.in', // Set the valid from address
    to: 'kousik.ramachandruni@gmail.com', 
    subject: 'Thank You for Contacting Us!',
    html:htmlContent 
  };

  try {
    await transporter.sendMail(mailToUser);
    console.log('Reply email sent successfully');
  } catch (err) {
    console.error('Error sending reply email: ', err);
  }
};

app.get('/getProjects', async (req, res)=>{
  connection.query('select * from projects', (error, results, fields) => {
    if (error) throw error;
    console.log('Results:', results);
  });
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
