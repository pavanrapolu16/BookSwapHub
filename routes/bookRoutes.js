import express from 'express';
import { addBook, getBooks ,viewMorePage} from '../controllers/bookController.js';

const router = express.Router();

router.post('/uploadToDB', addBook);
router.get('/viewMore/:bookId',viewMorePage)
router.get('/', getBooks);

export default router;
