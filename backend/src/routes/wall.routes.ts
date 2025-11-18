import { Router } from 'express'
import {
  createWallController,
  getWallController,
  getAllWallsController,
  updateWallController,
  deleteWallController
} from '#controllers'
import { requireAuth, validateCreateWall, validateUpdateWall, validateWallQuery } from '#middleware'

export const wallRouter = Router()

// Public
wallRouter.get('/', validateWallQuery, getAllWallsController)
wallRouter.get('/:id', getWallController)

// Protected
wallRouter.post('/', requireAuth, validateCreateWall, createWallController)
wallRouter.patch('/:id', requireAuth, validateUpdateWall, updateWallController)
wallRouter.delete('/:id', requireAuth, deleteWallController)
