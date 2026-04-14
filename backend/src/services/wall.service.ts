import { prisma } from "#db";
import type { WallType } from "#db";

export const createWall = async (data: {
  gymId: string;
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
      boulders: true,
    },
  });
};

export const findAllWalls = async (filters: {
  gymId?: string;
  city?: string;
  setterId?: string;
}) => {
  const where: any = {};

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

// TODO no protection, everybody can delete
export const deleteWall = async (id: string) => {
  return await prisma.wall.delete({
    where: { id },
  });
};
