import type { Request, Response, NextFunction } from "express";
import { createGradeSchema, updateGradeSchema } from "#schemas";

export const validateCreateGrade = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createGradeSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateUpdateGrade = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateGradeSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};
