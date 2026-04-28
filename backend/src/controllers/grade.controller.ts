import type { Request, Response } from "express";
import {
  createGrade,
  findGradeById,
  findAllGrades,
  updateGrade,
  deleteGrade,
} from "#services";

export const createGradeController = async (req: Request, res: Response) => {
  const grade = await createGrade(req.body);
  res.status(201).json({
    success: true,
    grade,
  });
};

export const getGradeController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const grade = await findGradeById(id);

  if (!grade) {
    res.status(404).json({
      success: false,
      message: "Grade not found",
    });
    return;
  }

  res.json({
    success: true,
    grade,
  });
};

export const getAllGradesController = async (req: Request, res: Response) => {
  const { gymId } = req.query as {
    gymId?: string;
  };

  const grades = await findAllGrades({ gymId });

  res.json({
    success: true,
    count: grades.length,
    grades,
  });
};

export const updateGradeController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const data = req.body;

  const grade = await updateGrade(id, data);

  res.json({
    success: true,
    grade,
  });
};

export const deleteGradeController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  await deleteGrade(id);

  res.json({
    success: true,
    message: "Grade deleted successfully",
  });
};
