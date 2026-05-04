import { findUserById, getUserStats, updateUser } from "#services";
import type { Request, Response } from "express";

// bussiness logic
export const getMeController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const id = req.user.id;

  const me = await getUserStats(id);

  res.json({
    success: true,
    me,
  });
};

export const updateMeController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const id = req.user.id;
  const data = req.body;

  const me = await updateUser(id, data);

  res.json({
    success: true,
    me,
  });
};

export const getUserController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const user = await findUserById(id);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.json({
    success: true,
    user,
  });
};
