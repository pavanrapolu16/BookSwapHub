import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config()
import admin from '../config/firebaseConfig.js';
const db = admin.firestore();

// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS
  }
});

// Function to send email
export const sendAskNowEmail = async (req, res) => {
  const { bookId, name, email, phone, id, class: userClass } = req.body;

  try {
    const bookDoc = await db.collection('books').doc(bookId).get();
    if (!bookDoc.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = bookDoc.data();
    const ownerEmail = book.owner.email;
    console.log(ownerEmail);

    const mailOptions = {
      from: process.env.MAIL,
      to: ownerEmail, // Send email to the book owner
      subject: 'Book Request',
      text: `You have a new book request for "${book.title}" from:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      ID: ${id}
      Class: ${userClass}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Request submitted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
};
