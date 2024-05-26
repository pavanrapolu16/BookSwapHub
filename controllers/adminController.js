import admin from '../config/firebaseConfig.js';
import nodemailer from 'nodemailer';
import ipinfo from 'ipinfo';
import UAParser from 'ua-parser-js';
import moment from 'moment-timezone'; // Ensure this is imported

const db = admin.firestore();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL, // use environment variables for security
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
        // Fetch admin credentials from Firestore
        const adminDoc = await db.collection('Authentication').doc('adminCredentials').get();
        if (!adminDoc.exists) {
            console.log('No such document!');
            res.send('Login Failed');
            return;
        }

        const adminData = adminDoc.data();
        const adminUsername = adminData.username;
        const adminPassword = adminData.password;

        // Validate credentials
        if (email === adminUsername && password === adminPassword) {
            req.session.admin = true;

            const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim();
            const userAgent = req.headers['user-agent'];
            const parser = new UAParser();
            const uaResult = parser.setUA(userAgent).getResult();
            const deviceDetails = `${uaResult.browser.name} ${uaResult.browser.version} on ${uaResult.os.name} ${uaResult.os.version}, ${uaResult.device.model || 'Unknown device'}`;

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
                    from: process.env.EMAIL_USER,
                    to: 'pavanrapolu16@gmail.com', // replace with admin's email
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



