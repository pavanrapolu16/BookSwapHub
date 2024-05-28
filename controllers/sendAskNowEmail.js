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
    
    const generateRandomGreeting = () => {
      const greetings = [
        "Hello, Literary Hero!",
        "Hi there, Book Lover!",
        "Greetings, Avid Reader!",
        "Hey, Book Enthusiast!",
        "Salutations, Bibliophile!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    };
    
    const generateRandomSignOff = () => {
      const signOffs = [
        "With gratitude and bookish joy,",
        "Happy reading adventures,",
        "With warm regards and literary love,",
        "Thank you and happy sharing,",
        "Yours in the joy of reading,"
      ];
      return signOffs[Math.floor(Math.random() * signOffs.length)];
    };
    
    // Function to create the mailto link
    const createMailToLink = (to, subject, body) => {
      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return mailto;
    };
    
    // Email construction without test values
    const mailOptions = {
      from: process.env.MAIL,
      to: ownerEmail, // Send email to the book owner
      subject: `📖✨ You have Got a Book Request for "${book.title}" ✨📖`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #5D4037;">${generateRandomGreeting()}</h2>
          <p>Fantastic news! Your beloved book <strong>"${book.title}"</strong> has caught the eye of a passionate reader. Here are the details of your book's new admirer:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li>🌟 <strong>Name:</strong> ${name}</li>
            <li>📧 <strong>Email:</strong> <a href="mailto:${email}" style="color: #1E88E5;">${email}</a></li>
            <li>📞 <strong>Phone:</strong> ${phone}</li>
            <li>🆔 <strong>ID:</strong> ${id}</li>
            <li>🎓 <strong>Class:</strong> ${userClass}</li>
          </ul>
          <p>Why not make someone's day by connecting with them? Reach out using the above details and share the magic of <strong>"${book.title}"</strong>.</p>
          <p>Remember, every book has its own adventure, and now yours is about to embark on a new one!</p>
          <p>${generateRandomSignOff()}<br/>BookSwapHub Team<br/>📚🌟✨</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${createMailToLink(email, `Your Book Request for "${book.title}"`, `Hi ${name},\n\nI'm reaching out about your request for my book "${book.title}".\n\nLet's arrange the exchange.\n\nThanks!`)}" 
              style="background-color: #6200ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              📧 Send Email to the Requester
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Request submitted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

// Function to send email
export const sendAskNowEmailByDetails = async (req, res) => {
  const { ownerMail, bookTitle,name, email, phone, id, class: userClass } = req.body;

  try {
    const generateRandomGreeting = () => {
      const greetings = [
        "Hello, Literary Hero!",
        "Hi there, Book Lover!",
        "Greetings, Avid Reader!",
        "Hey, Book Enthusiast!",
        "Salutations, Bibliophile!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    };
    
    const generateRandomSignOff = () => {
      const signOffs = [
        "With gratitude and bookish joy,",
        "Happy reading adventures,",
        "With warm regards and literary love,",
        "Thank you and happy sharing,",
        "Yours in the joy of reading,"
      ];
      return signOffs[Math.floor(Math.random() * signOffs.length)];
    };
    
    // Function to create the mailto link
    const createMailToLink = (to, subject, body) => {
      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return mailto;
    };
    
    // Email construction without test values
    const mailOptions = {
      from: process.env.MAIL,
      to: ownerMail, // Send email to the book owner
      subject: `📖✨ You have Got a Book Request for "${bookTitle}" ✨📖`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #5D4037;">${generateRandomGreeting()}</h2>
          <p>Fantastic news! Your beloved book <strong>"${bookTitle}"</strong> has caught the eye of a passionate reader. Here are the details of your book's new admirer:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li>🌟 <strong>Name:</strong> ${name}</li>
            <li>📧 <strong>Email:</strong> <a href="mailto:${email}" style="color: #1E88E5;">${email}</a></li>
            <li>📞 <strong>Phone:</strong> ${phone}</li>
            <li>🆔 <strong>ID:</strong> ${id}</li>
            <li>🎓 <strong>Class:</strong> ${userClass}</li>
          </ul>
          <p>Why not make someone's day by connecting with them? Reach out using the above details and share the magic of <strong>"${book.title}"</strong>.</p>
          <p>Remember, every book has its own adventure, and now yours is about to embark on a new one!</p>
          <p>${generateRandomSignOff()}<br/>BookSwapHub Team<br/>📚🌟✨</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${createMailToLink(email, `Your Book Request for "${book.title}"`, `Hi ${name},\n\nI'm reaching out about your request for my book "${book.title}".\n\nLet's arrange the exchange.\n\nThanks!`)}" 
              style="background-color: #6200ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              📧 Send Email to the Requester
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Request submitted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

