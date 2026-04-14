import type { Request, Response, NextFunction } from "express";
import { createEventSchema, updateEventSchema } from "#schemas";

export const validateCreateEvent = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid event data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const validateUpdateEvent = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateEventSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid event update data",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};
