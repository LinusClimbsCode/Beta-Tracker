import type { Request, Response, NextFunction } from "express";
import { createBoulderValidationSchema } from "#schemas";

export const validateBoulderValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createBoulderValidationSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid boulder validation data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};
