import admin from '../config/firebaseConfig.js';

const db = admin.firestore();

export const addBook = async (req, res) => {
    console.log(req.body)
    const { title, author, description, image, name, mobile, email, ID, class: userClass, language,category } = req.body;

    const bookId = `book_${Date.now()}`; // Generate unique ID using timestamp

    const newBook = {
        id: bookId,
        title,
        author,
        description,
        image,
        language,
        category,
        owner: {
            name,
            mobile,
            email,
            ID,
            class: userClass
        },
        createdAt: new Date().toISOString()
    };

    console.log(newBook)

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
    console.log("sucessfully fetched books!" )
    res.status(200).json(books);
  } catch (error) {
    console.log("error in fetching books!",error )
    res.status(500).json({ message: 'Failed to fetch books', error });
  }
};
