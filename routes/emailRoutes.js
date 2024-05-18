import express from 'express';
import { sendAskNowEmail } from '../controllers/sendAskNowEmail.js';

const router = express.Router();

router.post('/ask-now', sendAskNowEmail);

export default router;
