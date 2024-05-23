import express from 'express';
import { sendAskNowEmail } from '../controllers/sendAskNowEmail.js';
import { sendAskNowEmailByDetails} from '../controllers/sendAskNowEmail.js';

const router = express.Router();

router.post('/ask-now', sendAskNowEmail);
router.post('/ask-now/mail', sendAskNowEmailByDetails);

export default router;
