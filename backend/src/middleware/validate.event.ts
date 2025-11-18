import type { Request, Response, NextFunction } from 'express'
import { createEventSchema, updateEventSchema } from '#schemas'

export const validateCreateEvent = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createEventSchema.parse(req.body)
    next()
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    })
  }
}

export const validateUpdateEvent = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateEventSchema.parse(req.body)
    next()
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    })
  }
}
