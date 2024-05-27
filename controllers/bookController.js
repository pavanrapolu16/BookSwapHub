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
    console.log("error in fetching books!",error )
    res.status(500).json({ message: 'Failed to fetch books', error });
  }
};


// New route for rendering book details page
export const viewMorePage = async (req, res) => {
  const bookId = req.params.bookId;
  try {
      const bookDoc = await db.collection('books').doc(bookId).get();
      if (!bookDoc.exists) {
          return res.status(404).send('Book not found');
      }
      const bookData = bookDoc.data();
      res.render('viewMoreBookDetails', { book: bookData });
  } catch (error) {
      console.error('Error fetching book details:', error);
      res.status(500).send('Failed to fetch book details');
  }
};

export const getCategoriesOptions = async (req, res) => {
  try {
    const categoriesSnapshot = await db.collection('categories').orderBy('name').get();
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    res.status(200).json(categories);
    console.log(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};