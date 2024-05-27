import { Router } from 'express';
const router = Router();
import { getLogin, postLogin, getDashboard, deleteBook, getUpdateBook, postUpdateBook ,getCategories, addCategory, deleteCategory} from '../controllers/adminController.js';

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

router.get('/categories', getCategories);
router.post('/categories/add', addCategory);
router.post('/categories/delete/:id', deleteCategory);

export default router;
