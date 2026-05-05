import type { Request, Response } from "express";
import {
  createEvent,
  findEventById,
  findAllEvents,
  updateEvent,
  deleteEvent,
} from "#services";

export const createEventController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const event = await createEvent({
    ...req.body,
    createdById: req.user.id,
  });

  res.status(201).json({
    success: true,
    event,
  });
};

export const getEventController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const event = await findEventById(id);

  if (!event) {
    res.status(404).json({
      success: false,
      message: "Event not found",
    });
    return;
  }

  res.json({
    success: true,
    event,
  });
};

export const getAllEventsController = async (req: Request, res: Response) => {
  const { gymId, city, isActive } = req.query as {
    gymId?: string;
    city?: string;
    isActive?: string;
  };

  // Convert isActive string to boolean
  const isActiveBool =
    isActive === "true" ? true : isActive === "false" ? false : undefined;

  const events = await findAllEvents({ gymId, city, isActive: isActiveBool });

  res.json({
    success: true,
    count: events.length,
    events,
  });
};

export const updateEventController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "No valid User",
    });
    return;
  }

  const { id } = req.params;
  const data = req.body;

  const event = await updateEvent(id, req.user.id, data);

  res.json({
    success: true,
    event,
  });
};

export const deleteEventController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "No valid User",
    });
    return;
  }

  const { id } = req.params;

  await deleteEvent(id, req.user.id);

  res.json({
    success: true,
    message: "Event deleted successfully",
  });
};
