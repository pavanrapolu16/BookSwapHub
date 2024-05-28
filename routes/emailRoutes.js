import express from 'express';
import { sendAskNowEmail,confirmContact  } from '../controllers/emailController.js';

const router = express.Router();

router.post('/ask-now', sendAskNowEmail);
router.get('/contact',confirmContact )

export default router;
