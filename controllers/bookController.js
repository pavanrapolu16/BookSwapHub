import db from '../config/firebaseConfig.js';

export const addBook = async (req, res) => {
  const { title, author, description, image, name, mobile, email, ID, class: userClass } = req.body;
  const bookId = `book_${Date.now()}`; // Generate unique ID using timestamp

  const newBook = {
    id: bookId,
    title,
    author,
    description,
    image,
    owner: {
      name,
      mobile,
      email,
      ID,
      class: userClass
    },
    createdAt: new Date().toISOString()
  };

  try {
    await db.collection('books').doc(bookId).set(newBook);
    res.status(201).json({ message: 'Book added successfully', bookId });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Failed to add book', error });
  }
};



export const getBooks = async (req, res) => {
  try {
    const booksSnapshot = await db.collection('books').get();
    const books = booksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error });
  }
};
