import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
import admin from '../config/firebaseConfig.js';
import moment from 'moment-timezone';
const db = admin.firestore();

// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS
  }
});

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

// Function to create the contact link
const createContactLink = (bookId, requesterInfo) => {
  const baseUrl = process.env.baseUrl || "https://bf9jbf9f-3000.inc1.devtunnels.ms";
  const link = `${baseUrl}/api/contact?bookId=${bookId}&name=${requesterInfo.name}&email=${requesterInfo.email}&phone=${requesterInfo.phone}&id=${requesterInfo.id}&class=${requesterInfo.class}`;
  return link;
};

// Function to send email
export const sendAskNowEmail = async (req, res) => {
  const { bookId, name, email, phone, id, class: userClass } = req.body;

  const contactLink = createContactLink(bookId, { name, email, phone, id, class: userClass });

  try {
    const bookDoc = await db.collection('books').doc(bookId).get();
    if (!bookDoc.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = bookDoc.data();
    const ownerEmail = book.owner.email;

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
            <a href="${contactLink}"
              style="background-color: #6200ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              📧 Send Email to the Requester
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    const currentTime = moment().tz('Asia/Kolkata').toString();
    await db.collection('emailSent').doc(`${book.title}_${new Date().toISOString()}`).set({
      owner: book.owner.name,
      recipient: name,
      Date_and_Time: currentTime
    });

    res.status(200).json({ message: 'Request submitted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

// Endpoint to handle contact confirmation
export const confirmContact = async (req, res) => {
  const { bookId, name, email, phone, id, class: userClass } = req.query;

  try {
    // Fetch the book document from Firestore
    const bookDoc = await db.collection('books').doc(bookId).get();
    if (!bookDoc.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = bookDoc.data();

    const currentTime = moment().tz('Asia/Kolkata').toString();
    await db.collection('emailReplied').doc(`${book.title}_${new Date().toISOString()}`).set({
      owner: book.owner.name,
      recipient: name,
      Date_and_Time: currentTime
    });

    // Create a new history entry
    const historyEntry = {
      timestamp: currentTime,
      requester: { name, email, phone, id, class: userClass },
    };

    // Update the book document, adding the new history entry to the history array
    await db.collection('books').doc(bookId).update({
      history: admin.firestore.FieldValue.arrayUnion(historyEntry)
    });

    // Redirect to the owner's email client with a pre-filled email to the requester
    res.redirect(`mailto:${email}?subject=${encodeURIComponent(`Your Book Request for "${book.title}"`)}&body=${encodeURIComponent(`Hi ${name},\n\nI'm reaching out about your request for my book "${book.title}".\n\nLet's arrange the exchange.\n\nThanks!`)}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to confirm contact', error });
  }
};
