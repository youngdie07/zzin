import { Router } from 'express';
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  toggleBookmark,
  getUserBookmarks
} from '../controllers/restaurant.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getRestaurants);
router.get('/bookmarks', authenticate, getUserBookmarks);
router.get('/:id', getRestaurant);
router.post('/', authenticate, createRestaurant);
router.put('/:id', authenticate, updateRestaurant);
router.post('/:id/bookmark', authenticate, toggleBookmark);

export default router;
