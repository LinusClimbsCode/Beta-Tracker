import { Router } from 'express'
import { requireAuth } from '#middleware/auth.middleware'
import { validateCreateRating, validateUpdateRating } from '#middleware'
import {
  createRatingController,
  getRatingByIdController,
  getBoulderRatingsController,
  getUserRatingsController,
  updateRatingController,
  deleteRatingController
} from '#controllers'

const router = Router()

// Create rating (requires auth and validation)
router.post('/', requireAuth, validateCreateRating, createRatingController)

// Get rating by ID
router.get('/:id', getRatingByIdController)

// Get all ratings for a boulder
router.get('/boulder/:boulderId', getBoulderRatingsController)

// Get all ratings by current user (requires auth)
router.get('/user/me', requireAuth, getUserRatingsController)

// Update rating (requires auth and validation)
router.patch('/:id', requireAuth, validateUpdateRating, updateRatingController)

// Delete rating (requires auth)
router.delete('/:id', requireAuth, deleteRatingController)

export { router as ratingRouter }
