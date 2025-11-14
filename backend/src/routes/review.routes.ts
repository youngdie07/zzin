import { Router } from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  getRestaurantReviews
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.get('/user', authenticate, getUserReviews);
router.get('/restaurant/:restaurantId', getRestaurantReviews);

export default router;
