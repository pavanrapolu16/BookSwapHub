import express from 'express';
import { sendAskNowEmail,confirmWhatsAppContact,confirmEmailContact  } from '../controllers/emailController.js';

const router = express.Router();

router.post('/ask-now', sendAskNowEmail);
router.get('/confirmWhatsAppContact',confirmWhatsAppContact )
router.get('/confirmEmailContact',confirmEmailContact )

export default router;
