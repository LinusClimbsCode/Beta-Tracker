import { prisma } from "#db";
import type { WallType } from "#db";
import type { WallWhereInput } from "#generated/prisma/models";

export const createWall = async (data: {
  gymId: string;
  createdById: string;
  name: string;
  description: string;
  imageUrl: string;
  wallType: WallType[];
  isActive: boolean;
  lastReset?: Date;
}) => {
  return await prisma.wall.create({
    data: {
      ...data,
      lastReset: data.lastReset || new Date(),
    },
  });
};

// TODO addd more data to render
export const findWallById = async (id: string) => {
  return await prisma.wall.findUnique({
    where: { id },
    include: {
      gym: true,
      boulders: {
        include: { setGrade: true, colors: true },
      },
    },
  });
};

export const findAllWalls = async (filters: {
  gymId?: string;
  city?: string;
  setterId?: string;
}) => {
  const where: WallWhereInput = {};

  if (filters.gymId) {
    where.gymId = filters.gymId;
  }

  if (filters.city) {
    where.gym = {
      city: filters.city,
    };
  }

  if (filters.setterId) {
    where.boulders = {
      some: {
        verifiedSetterId: filters.setterId,
      },
    };
  }

  return await prisma.wall.findMany({
    where,
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
      boulders: {
        select: {
          id: true,
          name: true,
          verifiedSetterId: true,
        },
      },
    },
  });
};

export const updateWall = async (
  id: string,
  data: {
    gymId?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    wallType?: WallType[];
    isActive?: boolean;
    lastReset?: Date;
  },
) => {
  return await prisma.wall.update({
    where: { id },
    data,
  });
};

export const deleteWall = async (id: string) => {
  return await prisma.wall.delete({
    where: { id },
  });
};
