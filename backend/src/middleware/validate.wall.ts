import type { Request, Response, NextFunction } from 'express'
import { createWallSchema, updateWallSchema, wallQuerySchema } from '#schemas'

export const validateCreateWall = (req: Request, res: Response, next: NextFunction) => {
  try {
    createWallSchema.parse(req.body)
    next()
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    })
  }
}

export const validateUpdateWall = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateWallSchema.parse(req.body)
    next()
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    })
  }
}

export const validateWallQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    wallQuerySchema.parse(req.query)
    next()
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors: error.errors
    })
  }
}
