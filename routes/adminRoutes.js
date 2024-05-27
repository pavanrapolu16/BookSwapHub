import express from 'express';
import { getLogin, postLogin,logout,getDashboard, deleteBook, getUpdateBook, postUpdateBook, getAddBook, addBook, getCategories, addCategory, deleteCategory } from '../controllers/adminController.js';

const router = express.Router();

// Login routes
router.get('/login', getLogin);
router.post('/login', postLogin);

// Logout route
router.get('/logout', logout);

// Dashboard routes
router.get('/dashboard', getDashboard);

// Book management routes
router.post('/delete/:id', deleteBook);
router.get('/update/:id', getUpdateBook);
router.post('/update/:id', postUpdateBook);

// Add book routes
router.get('/add-book', getAddBook);
router.post('/add-book', addBook);

// Category management routes
router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.post('/categories/delete/:id', deleteCategory);

export default router;