import express from 'express';
import bodyParser from 'body-parser';
import bookRoutes from './routes/bookRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

const app = express();
app.use(bodyParser.json());

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve the static HTML file
app.use(express.static('public'));

app.use('/api/books', bookRoutes);
app.use('/api', imageRoutes);
app.use('/api', emailRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});