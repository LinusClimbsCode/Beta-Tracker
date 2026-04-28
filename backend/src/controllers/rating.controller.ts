import type { Request, Response } from "express";
import {
  createRating,
  getRatingById,
  getBoulderRatings,
  getUserRatings,
  updateRating,
  deleteRating,
} from "#services/rating.service";

export const createRatingController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  const rating = await createRating(req.body, req.user.id);
  res.status(201).json({
    success: true,
    message: "Rating created successfully",
    rating,
  });
};

export const getRatingByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const rating = await getRatingById(req.params.id);

  if (!rating) {
    res.status(404).json({ success: false, message: "Rating not found" });
    return;
  }

  res.status(200).json({
    success: true,
    rating,
  });
};

export const getBoulderRatingsController = async (
  req: Request<{ boulderId: string }>,
  res: Response,
) => {
  const result = await getBoulderRatings(req.params.boulderId);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const getUserRatingsController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  const ratings = await getUserRatings(req.user.id);

  res.status(200).json({
    success: true,
    ratings,
  });
};

export const updateRatingController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  const rating = await updateRating(req.params.id, req.body, req.user.id);

  res.status(200).json({
    success: true,
    message: "Rating updated successfully",
    rating,
  });
};

export const deleteRatingController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  await deleteRating(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Rating deleted successfully",
  });
};
