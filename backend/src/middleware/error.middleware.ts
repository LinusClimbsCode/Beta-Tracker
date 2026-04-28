import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { config } from "#config";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isDev = config.server.nodeEnv === "development";

  // Log in development
  if (isDev) {
    console.error("Error:", error);
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      ...(isDev && { errors: error.issues }), // nur in dev
    });
    return;
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Resource already exists",
        ...(isDev && { detail: error.meta }),
      });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Resource not found",
        ...(isDev && { detail: error.meta }),
      });
      return;
    }
  }

  // Default error
  res.status(500).json({
    success: false,
    message: isDev ? error.message : "Internal server error",
    ...(isDev && { stack: error.stack }),
  });
};
