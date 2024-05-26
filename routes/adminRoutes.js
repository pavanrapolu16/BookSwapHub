import { Router } from 'express';
const router = Router();
import { getLogin, postLogin, getDashboard, deleteBook, getUpdateBook, postUpdateBook } from '../controllers/adminController.js';

// Admin login page
router.get('/', getLogin);

// Admin login action
router.post('/', postLogin);

// Admin dashboard
router.get('/dashboard', getDashboard);

// Delete book
router.post('/delete/:id', deleteBook);

// Update book page
router.get('/update/:id', getUpdateBook);

// Update book action
router.post('/update/:id', postUpdateBook);

export default router;
