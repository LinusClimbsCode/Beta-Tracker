import { prisma } from "#db";
import type { Prisma } from "#db";

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
      moderator: {
        select: { id: true, username: true },
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
// TODO update updateGym with website, phone etc
export const updateGym = async (
  id: string,
  data: { name?: string; city?: string; address?: string },
) => {
  return await prisma.gym.update({
    where: { id },
    data,
  });
};

// TODO admin only
export const deleteGym = async (id: string) => {
  return await prisma.gym.delete({
    where: { id },
  });
};
