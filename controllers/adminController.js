import admin from '../config/firebaseConfig.js';

const adminUsername = 'pavanrapolu16@gmail.com';
const adminPassword = 'BookSwapHub@2020';


const db = admin.firestore();

// Show login form
export function getLogin(req, res) {
    res.render('login');
}

// Handle login
export function postLogin (req, res) {
    console
    const {email, password } = req.body;
    console.log(email,password)
    if (email === adminUsername && password === adminPassword) {
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Login Failed');
    }
};

// Show dashboard with books
export async function getDashboard(req, res) {
    console.log("at dashboard")
    if (!req.session.admin) {
        return res.redirect('/admin');
    }
    const booksSnapshot = await db.collection('books').get();
    const books = [];
    booksSnapshot.forEach(doc => {
        const data = doc.data();
        books.push({
            id: doc.id,
            title: data.title,
            owner: data.owner.name,
            ownerId: data.owner.ID,
            ownerEmail: data.owner.email,
            ownerMobile: data.owner.mobile,
            image: data.image,
            createdAt: data.createdAt
        });
    });
    res.render('dashboard', { books });
}



// Handle delete book
export async function deleteBook(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin');
    }
    const bookId = req.params.id;
    await db.collection('books').doc(bookId).delete();
    res.redirect('/admin/dashboard');
}

// Show update book form
export async function getUpdateBook(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin');
    }
    const bookId = req.params.id;
    const bookDoc = await db.collection('books').doc(bookId).get();
    if (!bookDoc.exists) {
        return res.send('Book not found');
    }
    res.render('update', { book: { id: bookId, ...bookDoc.data() } });
}

// Handle update book
export async function postUpdateBook(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin');
    }

    const bookId = req.params.id;
    console.log(req.body);
    const { title, author, description, image, language, category, createdAt ,name, mobile,email,ID, userClass} = req.body;


    try {
        // Update Firestore document with all fields
        await db.collection('books').doc(bookId).update({ 
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
                userClass
            },
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('Error updating book');
    }
}



