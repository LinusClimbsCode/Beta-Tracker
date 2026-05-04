import { prisma } from "#db";
import type { Prisma } from "#db";
import type { GradeSystemType } from "#db";

export const createGym = async (data: Prisma.GymCreateInput) => {
  return await prisma.gym.create({
    data,
  });
};

export const findGymById = async (id: string) => {
  return await prisma.gym.findUnique({
    where: { id },
    include: {
      walls: true,
      moderators: {
        include: {
          moderator: {
            select: { id: true, username: true },
          },
        },
      },
    },
  });
};

export const findAllGyms = async () => {
  return await prisma.gym.findMany({
    include: {
      moderators: {
        select: {
          moderator: {
            select: { id: true, username: true },
          },
        },
      },
    },
  });
};

// isActive think about solution if everybody
// or only admin/moderator can change it
export const updateGym = async (
  id: string,
  data: {
    name?: string;
    city?: string;
    address?: string;
    website?: string;
    phone?: string;
    email?: string;
    openingHours?: Prisma.InputJsonValue;
    description?: string;
    priceInfo?: Prisma.InputJsonValue;
    imageUrl?: string;
    gradeSystemType?: GradeSystemType;
  },
) => {
  return await prisma.gym.update({
    where: { id },
    data,
  });
};

export const deleteGym = async (id: string) => {
  return await prisma.gym.delete({
    where: { id },
  });
};
