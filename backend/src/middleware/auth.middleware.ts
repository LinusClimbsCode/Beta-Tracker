import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, findUserById } from "#services";
import { COOKIES } from "#config";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[COOKIES.ACCESS_TOKEN];

  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.userId);

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[COOKIES.ACCESS_TOKEN];

  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.userId);

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    // TODO refactoring requireAdim should call requireAuth
    if (user.role !== "admin") {
      res
        .status(403)
        .json({ success: false, message: "Admin access required" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
