import { Router } from 'express'
import {
  validateBoulderController,
  getBoulderValidationsController,
  getUserValidationsController
} from '#controllers'
import { requireAuth, validateBoulderValidation } from '#middleware'

export const boulderValidationRouter = Router()

// All routes require authentication
boulderValidationRouter.post('/', requireAuth, validateBoulderValidation, validateBoulderController)
boulderValidationRouter.get('/boulder/:boulderId', getBoulderValidationsController)
boulderValidationRouter.get('/user/me', requireAuth, getUserValidationsController)
