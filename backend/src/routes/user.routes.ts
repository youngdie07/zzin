import { Router } from 'express';
import { getUser, updateProfile } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', getUser);
router.put('/profile', authenticate, updateProfile);

export default router;
