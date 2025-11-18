import { Router } from 'express'
import {
  createGradeController,
  getGradeController,
  getAllGradesController,
  updateGradeController,
  deleteGradeController
} from '#controllers'
import { requireAdmin, validateCreateGrade, validateUpdateGrade } from '#middleware'

export const gradeRouter = Router()

// Public
gradeRouter.get('/', getAllGradesController)
gradeRouter.get('/:id', getGradeController)

// Admin only
gradeRouter.post('/', requireAdmin, validateCreateGrade, createGradeController)
gradeRouter.patch('/:id', requireAdmin, validateUpdateGrade, updateGradeController)
gradeRouter.delete('/:id', requireAdmin, deleteGradeController)
