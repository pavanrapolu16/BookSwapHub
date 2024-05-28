import admin from '../config/firebaseConfig.js';
import nodemailer from 'nodemailer';
import ipinfo from 'ipinfo';
import DeviceDetector from 'device-detector-js';
import moment from 'moment-timezone';

const db = admin.firestore();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});

// Show login form
export function getLogin(req, res) {
    res.render('login');
}

// Handle login
export async function postLogin(req, res) {
    const { email, password } = req.body;
    try {
        const adminDoc = await db.collection('Authentication').doc('adminCredentials').get();
        if (!adminDoc.exists) {
            console.log('No such document!');
            res.send('Login Failed');
            return;
        }

        const adminData = adminDoc.data();
        const adminUsername = adminData.username;
        const adminPassword = adminData.password;

        if (email === adminUsername && password === adminPassword) {
            req.session.admin = true;

            const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim();
            const userAgent = req.headers['user-agent'];
            const deviceDetector = new DeviceDetector();
            const deviceInfo = deviceDetector.parse(userAgent);

            const deviceDetails = `
                Client: ${deviceInfo.client.name} ${deviceInfo.client.version},
                OS: ${deviceInfo.os.name} ${deviceInfo.os.version},
                Device: ${deviceInfo.device.type} ${deviceInfo.device.brand} ${deviceInfo.device.model}
            `.trim();

            ipinfo(ip, async (err, cLoc) => {
                let timezone = 'Asia/Kolkata';
                let location = 'Hyderabad, Telangana, India';
                if (err) {
                    console.error('Error fetching IP info:', err);
                } else {
                    timezone = cLoc.timezone || timezone;
                    location = `${cLoc.city || 'Unknown'}, ${cLoc.region || 'Unknown'}, ${cLoc.country || 'Unknown'}`;
                }

                const loginTime = moment().tz(timezone).format('YYYY-MM-DD, h:mm:ss A');
                
                const mailOptions = {
                    from: process.env.MAIL,
                    to: 'pavanrapolu16@gmail.com',
                    subject: 'Admin Login Alert',
                    text: `An admin logged in at ${loginTime} from IP: ${ip}. Location: ${location}. Device: ${deviceDetails}`
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Login email sent successfully');
                } catch (mailError) {
                    console.error('Error sending login email:', mailError);
                }

                res.redirect('/admin/dashboard');
            });
        } else {
            res.send('Login Failed');
        }
    } catch (error) {
        console.error('Error getting document:', error);
        res.send('Login Failed');
    }
}

// Show dashboard with books
export async function getDashboard(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    try {
        const booksSnapshot = await db.collection('books').orderBy('title').get();
        const books = booksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.render('dashboard', { books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Handle delete book
export async function deleteBook(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    const bookId = req.params.id;
    await db.collection('books').doc(bookId).delete();
    res.redirect('/admin/dashboard');
}

// Show update book form
export async function getUpdateBook(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
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
        return res.redirect('/admin/login');
    }

    const bookId = req.params.id;
    const { title, author, description, image, language, category, createdAt ,name, mobile,email,ID, userClass} = req.body;

    try {
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

// Show add book form
export function getAddBook(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    res.render('addBook');
}

// Handle add book
export const addBook = async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    const bookId = `book_${Date.now()}`; // Generate unique ID using timestamp
    const { title, author, category, description, imageUrl ,language} = req.body;

    const newBook={
        id: bookId,
        title,
        author,
        category,
        language,
        description,
        image: imageUrl,
        owner: {
            name:"Admin",
            mobile:"6305772679",
            email:"pavanrapolu16@gmail.com",
            ID:"NULL",
            class: "NULL"
        },
        createdAt: new Date().toISOString()
    };

    try {
        await db.collection('books').doc(bookId).set(newBook);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Failed to add book', error });
    }
}

// Get categories and render categories management page
export async function getCategories(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    try {
        const categoriesSnapshot = await db.collection('categories').orderBy('name').get();
        const categories = categoriesSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
        }));
        res.render('categories', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Handle add category
export async function addCategory(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const { name } = req.body;
    try {
        const categoryDoc = db.collection('categories').doc();
        await categoryDoc.set({ name });
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Handle delete category
export async function deleteCategory(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const categoryId = req.params.id;
    try {
        await db.collection('categories').doc(categoryId).delete();
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send('Internal Server Error');
    }
}


// Handle logout
export function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/admin/login');
        }
    });
}

// Show analytics page
export async function getAnalytics(req, res) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    try {
        const booksSnapshot = await db.collection('books').get();
        const books = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Extract analytics data
        const totalBooks = books.length;
        const totalAuthors = new Set(books.map(book => book.author)).size;
        const totalCategories = new Set(books.map(book => book.category)).size;

        // Calculate books per owner
        const booksPerOwner = books.reduce((acc, book) => {
            const owner = book.owner.name;
            if (!acc[owner]) {
                acc[owner] = [];
            }
            acc[owner].push(book);
            return acc;
        }, {});

        res.render('analytics', {
            totalBooks,
            totalAuthors,
            totalCategories,
            booksPerOwner
        });
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).send('Internal Server Error');
    }
}