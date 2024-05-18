import express from 'express';
import bodyParser from 'body-parser';
import bookRoutes from './routes/bookRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

const app = express();
app.use(bodyParser.json());

const logIp = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`User IP: ${ip}`);
  next();
};

app.use(logIp);

// Serve the static HTML file
app.use(express.static('public'));

app.use('/api/books', bookRoutes);
app.use('/api', emailRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});