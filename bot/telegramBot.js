// Import necessary libraries
const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');
const admin = require('../config/firebaseConfig.js');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Firebase Firestore
const db = admin.firestore();

// Initialize Telegram Bot with your bot token
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS
  }
});

// Function to send email
const sendEmail = async (book, userDetails) => {
  const { name, email, phone, id, class: userClass } = userDetails;
  const { owner: { email: ownerEmail }, title } = book;

  const mailOptions = {
    from: process.env.MAIL,
    to: ownerEmail,
    subject: 'Book Request',
    text: `You have a new book request for "${title}" from:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      ID: ${id}
      Class: ${userClass}`
  };

  await transporter.sendMail(mailOptions);
};

// Command to start the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMessage = 'Welcome to the Book Search Bot! Click the button below to search for a book:';
  
  const opts = {
    reply_markup: {
      keyboard: [['Search Book']],
      resize_keyboard: true
    }
  };

  bot.sendMessage(chatId, startMessage, opts);
});

// Listen for search book command
bot.onText(/Search Book/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Please enter the name of the book:');
});

// Listen for book name input
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const bookName = msg.text;

  try {
    // Query Firestore for books matching the search query
    const booksSnapshot = await db.collection('books').where('title', '==', bookName).get();
    
    if (booksSnapshot.empty) {
      bot.sendMessage(chatId, 'No books found with that name. Please try again or search for another book.');
    } else {
      booksSnapshot.forEach(doc => {
        const book = doc.data();
        const message = `Title: ${book.title}\nAuthor: ${book.author}\nDescription: ${book.description}\nLanguage: ${book.language}\nCategory: ${book.category}`;

        // Inline keyboard to allow user to choose action
        const opts = {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Ask Now', callback_data: JSON.stringify({ action: 'ask_now', bookId: doc.id, bookTitle: book.title }) }],
              [{ text: 'Not This Book', callback_data: JSON.stringify({ action: 'search_another', bookTitle: book.title }) }]
            ]
          }
        };

        bot.sendMessage(chatId, message, opts);
      });
    }
  } catch (error) {
    console.error('Error searching for books:', error);
    bot.sendMessage(chatId, 'Failed to search for books.');
  }
});

// Handle callback queries
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const { action, bookId, bookTitle } = JSON.parse(callbackQuery.data);

  if (action === 'ask_now') {
    // Ask the user for their details
    bot.sendMessage(chatId, 'Please enter your name:');
    // Set bot state to track the current action (collecting user details)
    bot.state = {
      action: 'collect_user_details',
      bookId,
      bookTitle
    };
  } else if (action === 'search_another') {
    // Send message to search for another book
    bot.sendMessage(chatId, 'Please enter the name of another book:');
  }
});

// Listen for messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Check if bot is collecting user details
  if (bot.state && bot.state.action === 'collect_user_details') {
    // Save user details
    const name = msg.text;
    bot.state.userDetails = { name };
    // Ask for the next detail
    bot.sendMessage(chatId, 'Please enter your email:');
    bot.state.action = 'collect_email';
  } else if (bot.state && bot.state.action === 'collect_email') {
    // Save user email
    const email = msg.text;
    bot.state.userDetails.email = email;
    // Ask for the next detail or send email
    const userDetails = bot.state.userDetails;
    const bookId = bot.state.bookId;
    const bookTitle = bot.state.bookTitle;
    try {
      const bookDoc = await db.collection('books').doc(bookId).get();
      if (bookDoc.exists) {
        const book = bookDoc.data();
        await sendEmail(book, userDetails);
        bot.sendMessage(chatId, `Email sent successfully to the owner of "${bookTitle}"!`);
      } else {
        bot.sendMessage(chatId, 'Book not found.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      bot.sendMessage(chatId, 'Failed to send email.');
    }
    // Reset bot state
    delete bot.state;
  } else {
    // Reset bot state
    // If bot is not expecting any input, ignore
    delete bot.state;
    }
})