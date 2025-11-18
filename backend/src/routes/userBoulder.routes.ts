import { Router } from 'express'
import {
  createUserBoulderController,
  getUserBoulderController,
  getUserBouldersController,
  updateUserBoulderController,
  deleteUserBoulderController
} from '#controllers'
import { requireAuth, validateCreateUserBoulder, validateUpdateUserBoulder } from '#middleware'

export const userBoulderRouter = Router()

// All routes require authentication
userBoulderRouter.post('/', requireAuth, validateCreateUserBoulder, createUserBoulderController)
userBoulderRouter.get('/me', requireAuth, getUserBouldersController)
userBoulderRouter.get('/:id', getUserBoulderController)
userBoulderRouter.patch('/:id', requireAuth, validateUpdateUserBoulder, updateUserBoulderController)
userBoulderRouter.delete('/:id', requireAuth, deleteUserBoulderController)
