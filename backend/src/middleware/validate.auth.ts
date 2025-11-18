import type { Request, Response, NextFunction } from 'express'
import { registerInputSchema, loginInputSchema } from '#schemas/autch.schemas'

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const result = registerInputSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues
    })
    return
  }

  next()
}

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const result = loginInputSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues
    })
    return
  }

  next()
}
