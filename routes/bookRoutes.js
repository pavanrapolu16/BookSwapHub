import express from 'express';
import { addBook, getBooks ,viewMorePage,getCategoriesOptions} from '../controllers/bookController.js';

const router = express.Router();

router.post('/uploadToDB', addBook);
router.get('/viewMore/:bookId',viewMorePage)
router.get('/', getBooks);
router.get('/getCategoriesOptions',getCategoriesOptions)

export default router;
