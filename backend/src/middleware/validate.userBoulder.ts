import type { Request, Response, NextFunction } from 'express'
import { createUserBoulderSchema, updateUserBoulderSchema } from '#schemas'

export const validateCreateUserBoulder = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createUserBoulderSchema.parse(req.body)
    next()
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    })
  }
}

export const validateUpdateUserBoulder = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateUserBoulderSchema.parse(req.body)
    next()
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    })
  }
}
