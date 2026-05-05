import { prisma } from "#db";
import type { Status } from "#db";
import { ConflictError, ForbiddenError, NotFoundError } from "#errors";

export const createUserBoulder = async (
  data: {
    boulderId: string;
    status: Status;
    attempts: number;
  },
  userId: string,
) => {
  // Check if user has verified email
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.emailVerified) {
    throw new ForbiddenError("Email must be verified to log boulder attempts");
  }

  // Check if user already has a record for this boulder
  const existing = await prisma.userBoulder.findUnique({
    where: {
      boulderId_userId: {
        boulderId: data.boulderId,
        userId,
      },
    },
  });

  if (existing) {
    throw new ConflictError(
      "You have already logged an attempt for this boulder. Use update instead.",
    );
  }

  // Check if boulder exists
  const boulder = await prisma.boulder.findUnique({
    where: { id: data.boulderId },
  });

  if (!boulder) {
    throw new NotFoundError("Boulder not found");
  }

  // Create the record
  const now = new Date();

  return await prisma.userBoulder.create({
    data: {
      boulderId: data.boulderId,
      userId,
      status: data.status,
      attempts: data.attempts,
      firstAttemptAt: now,
      completedAt: now, // Set to now initially, will update if status changes to flash/top later (in schema datetime)
      xpAwarded: 0, // Will be calculated in Phase 3
    },
    include: {
      boulder: {
        include: {
          wall: {
            select: {
              name: true,
              gym: {
                select: {
                  name: true,
                },
              },
            },
          },
          setGrade: true,
          colors: true,
        },
      },
    },
  });
};

export const getUserBoulderById = async (id: string) => {
  return await prisma.userBoulder.findUnique({
    where: { id },
    include: {
      boulder: {
        include: {
          wall: {
            select: {
              name: true,
              gym: {
                select: {
                  name: true,
                },
              },
            },
          },
          setGrade: true,
          colors: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export const getUserBoulders = async (
  userId: string,
  filters?: {
    status?: Status;
    boulderId?: string;
  },
) => {
  const where: any = { userId };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.boulderId) {
    where.boulderId = filters.boulderId;
  }

  return await prisma.userBoulder.findMany({
    where,
    include: {
      boulder: {
        include: {
          wall: {
            select: {
              name: true,
              gym: {
                select: {
                  name: true,
                },
              },
            },
          },
          setGrade: true,
          colors: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserBoulder = async (
  id: string,
  data: {
    status?: Status;
    attempts?: number;
  },
  userId: string,
) => {
  // Check if record exists and belongs to user
  const existing = await prisma.userBoulder.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError("UserBoulder record not found");
  }

  if (existing.userId !== userId) {
    throw new ForbiddenError("You can only update your own boulder attempts");
  }

  const updateData: any = {};

  if (data.status) {
    updateData.status = data.status;
    // Update completedAt if status changed to flash or top
    if (data.status === "flash" || data.status === "top") {
      updateData.completedAt = new Date();
    }
  }

  if (data.attempts !== undefined) {
    updateData.attempts = data.attempts;
  }

  return await prisma.userBoulder.update({
    where: { id },
    data: updateData,
    include: {
      boulder: {
        include: {
          wall: {
            select: {
              name: true,
              gym: {
                select: {
                  name: true,
                },
              },
            },
          },
          setGrade: true,
          colors: true,
        },
      },
    },
  });
};

export const deleteUserBoulder = async (id: string, userId: string) => {
  // Check if record exists and belongs to user
  const existing = await prisma.userBoulder.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError("UserBoulder record not found");
  }

  if (existing.userId !== userId) {
    throw new ForbiddenError("You can only delete your own boulder attempts");
  }

  return await prisma.userBoulder.delete({
    where: { id },
  });
};
