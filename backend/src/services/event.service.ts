import { prisma } from "#db";
import type { EventType } from "#db";
import type { Prisma } from "../generated/prisma/client";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "#errors";

export const createEvent = async (data: {
  gymId: string;
  createdById: string;
  title: string;
  eventType: EventType[];
  description: string;
  imageUrl?: string;
  startTime: string;
  endTime: string;
  price: string;
  registrationLink: string;
  isActive: boolean;
}) => {
  return await prisma.event.create({
    data,
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });
};

export const findEventById = async (id: string) => {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
        },
      },
    },
  });
};

export const findAllEvents = async (filters: {
  gymId?: string;
  city?: string;
  isActive?: boolean;
}) => {
  const where: Prisma.EventWhereInput = {};

  if (filters.gymId) {
    where.gymId = filters.gymId;
  }

  if (filters.city) {
    where.gym = {
      city: filters.city,
    };
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return await prisma.event.findMany({
    where,
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const updateEvent = async (
  id: string,
  userId: string,
  data: {
    gymId?: string;
    title?: string;
    eventType?: EventType[];
    description?: string;
    imageUrl?: string;
    startTime?: string;
    endTime?: string;
    price?: string;
    registrationLink?: string;
    isActive?: boolean;
  },
) => {
  const event = await findEventById(id);
  if (!event) {
    throw new NotFoundError("Event not found");
  } else if (event.createdById !== userId) {
    throw new ForbiddenError("You are not authorised");
  } else {
    return await prisma.event.update({
      where: { id },
      data,
      include: {
        gym: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });
  }
};

export const deleteEvent = async (id: string, userId: string) => {
  const event = await findEventById(id);
  if (!event) {
    throw new NotFoundError("Event not found");
  } else if (event.createdById !== userId) {
    throw new ForbiddenError("You are not authorised");
  } else {
    return await prisma.event.delete({
      where: { id },
    });
  }
};
