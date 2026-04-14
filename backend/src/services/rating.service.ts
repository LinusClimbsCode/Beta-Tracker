import { prisma } from "#db";
import type { GradeRating, QualityRating } from "#db";

// Helper function to calculate most common rating
const calculateMostCommon = (ratings: string[]): string => {
  if (ratings.length === 0) return "appropriate"; // Default

  const counts: Record<string, number> = {};
  for (const rating of ratings) {
    counts[rating] = (counts[rating] || 0) + 1;
  }

  // Find the rating with highest count
  let maxCount = 0;
  let mostCommon = ratings[0];
  for (const [rating, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = rating;
    }
  }

  return mostCommon;
};

export const createRating = async (
  data: {
    boulderId: string;
    gradeRating: GradeRating;
    qualityRating: QualityRating;
    comment?: string;
  },
  userId: string,
) => {
  // Check email verification
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.emailVerified) {
    throw new Error("Email must be verified to rate boulders");
  }

  // Check if user has climbed the boulder
  const userBoulder = await prisma.userBoulder.findUnique({
    where: {
      boulderId_userId: {
        boulderId: data.boulderId,
        userId,
      },
    },
  });

  if (!userBoulder) {
    throw new Error("You must climb a boulder before rating it");
  }

  // Check if user already rated this boulder
  const existingRating = await prisma.rating.findUnique({
    where: {
      boulderId_userId: {
        boulderId: data.boulderId,
        userId,
      },
    },
  });

  if (existingRating) {
    throw new Error("You have already rated this boulder. Use update instead.");
  }

  // Create the rating
  const rating = await prisma.rating.create({
    data: {
      boulderId: data.boulderId,
      userId,
      gradeRating: data.gradeRating,
      qualityRating: data.qualityRating,
      comment: data.comment || "",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      boulder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Update boulder's community ratings
  await updateBoulderCommunityRatings(data.boulderId);

  return rating;
};

// TODO rethink logic, for more efficientsy
// Function to recalculate and update boulder's community ratings
const updateBoulderCommunityRatings = async (boulderId: string) => {
  // Get all ratings for this boulder
  const ratings = await prisma.rating.findMany({
    where: { boulderId },
  });

  if (ratings.length === 0) {
    return; // No ratings yet, keep defaults
  }

  // Calculate most common grade rating
  const gradeRatings = ratings.map((r) => r.gradeRating);
  const communityGrade = calculateMostCommon(gradeRatings) as GradeRating;

  // Calculate most common quality rating
  const qualityRatings = ratings.map((r) => r.qualityRating);
  const communityFeedback = calculateMostCommon(
    qualityRatings,
  ) as QualityRating;

  // Update the boulder
  await prisma.boulder.update({
    where: { id: boulderId },
    data: {
      communityGrade,
      communityFeedback,
    },
  });
};

export const getRatingById = async (id: string) => {
  return await prisma.rating.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      boulder: {
        select: {
          id: true,
          name: true,
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
        },
      },
    },
  });
};

export const getBoulderRatings = async (boulderId: string) => {
  const ratings = await prisma.rating.findMany({
    where: { boulderId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate statistics
  const gradeStats = {
    easy: ratings.filter((r) => r.gradeRating === "easy").length,
    appropriate: ratings.filter((r) => r.gradeRating === "appropriate").length,
    hard: ratings.filter((r) => r.gradeRating === "hard").length,
    total: ratings.length,
  };

  const qualityStats = {
    liked: ratings.filter((r) => r.qualityRating === "liked").length,
    neutral: ratings.filter((r) => r.qualityRating === "neutral").length,
    disliked: ratings.filter((r) => r.qualityRating === "disliked").length,
    total: ratings.length,
  };

  return {
    ratings,
    stats: {
      gradeStats,
      qualityStats,
    },
  };
};

export const getUserRatings = async (userId: string) => {
  return await prisma.rating.findMany({
    where: { userId },
    include: {
      boulder: {
        select: {
          id: true,
          name: true,
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateRating = async (
  id: string,
  data: {
    gradeRating?: GradeRating;
    qualityRating?: QualityRating;
    comment?: string;
  },
  userId: string,
) => {
  // Check if rating exists and belongs to user
  const existing = await prisma.rating.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Rating not found");
  }

  if (existing.userId !== userId) {
    throw new Error("You can only update your own ratings");
  }

  // Update the rating
  const rating = await prisma.rating.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      boulder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Recalculate boulder's community ratings
  await updateBoulderCommunityRatings(existing.boulderId);

  return rating;
};

export const deleteRating = async (id: string, userId: string) => {
  // Check if rating exists and belongs to user
  const existing = await prisma.rating.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Rating not found");
  }

  if (existing.userId !== userId) {
    throw new Error("You can only delete your own ratings");
  }

  const boulderId = existing.boulderId;

  // Delete the rating
  await prisma.rating.delete({
    where: { id },
  });

  // Recalculate boulder's community ratings
  await updateBoulderCommunityRatings(boulderId);
};
