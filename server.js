import express from 'express';
import bodyParser from 'body-parser';
import path from 'path'
import session from 'express-session';

import bookRoutes from './routes/bookRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(session({ 
  secret: 'BookSwapHub@2020', 
  resave: false, 
  saveUninitialized: true 
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Serve the static HTML file
app.use(express.static('public'));
app.use(express.static('views'))

// Use admin routes
app.use('/admin', adminRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', imageRoutes);
app.use('/api', emailRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});