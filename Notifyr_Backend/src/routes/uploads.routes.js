import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { requireOwnerAuth } from '../middleware/auth.js';

const router = Router();
router.get('/sign', requireOwnerAuth, uploadController.signUpload);

export default router;
