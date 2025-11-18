import { Router } from 'express'
import {
  createColorController,
  getColorController,
  getAllColorsController,
  updateColorController,
  deleteColorController
} from '#controllers'
import { requireAdmin, validateCreateColor, validateUpdateColor } from '#middleware'

export const colorRouter = Router()

// Public
colorRouter.get('/', getAllColorsController)
colorRouter.get('/:id', getColorController)

// Admin only
colorRouter.post('/', requireAdmin, validateCreateColor, createColorController)
colorRouter.patch('/:id', requireAdmin, validateUpdateColor, updateColorController)
colorRouter.delete('/:id', requireAdmin, deleteColorController)
