import { prisma } from "#db";
import { Prisma, ValidationStatus } from "../generated/prisma/client";

export const createBoulder = async (
  data: {
    wallId: string;
    name?: string;
    setGradeId: string;
    verifiedSetterId?: string;
    unverifiedSetterName?: string;
    colorIds: string[];
  },
  uploadedById: string,
) => {
  // Get uploader to check if they're a setter
  const uploader = await prisma.user.findUnique({
    where: { id: uploadedById },
    select: { setter: true, trustPoints: true, emailVerified: true },
  });

  if (!uploader) {
    throw new Error("Uploader not found");
  }

  if (!uploader.emailVerified) {
    throw new Error("Email must be verified to upload boulders");
  }

  // Calculate required validation points based on uploader's trust points
  let requiredValidationPoints = 3; // Default: need 3 validations
  if (uploader.trustPoints >= 100) {
    requiredValidationPoints = 1;
  } else if (uploader.trustPoints >= 50) {
    requiredValidationPoints = 2;
  }

  // Auto-approve if uploader is a setter
  const status = uploader.setter ? "approved" : "pending";
  const currentValidationPoints = uploader.setter
    ? requiredValidationPoints
    : 0;

  return await prisma.boulder.create({
    data: {
      wallId: data.wallId,
      name: data.name,
      setGradeId: data.setGradeId,
      verifiedSetterId: data.verifiedSetterId,
      unverifiedSetterName: data.unverifiedSetterName,
      uploadedById,
      status,
      requiredValidationPoints,
      currentValidationPoints,
      communityGrade: "appropriate",
      communityFeedback: "neutral",
      colors: {
        connect: data.colorIds.map((id) => ({ id })),
      },
    },
    include: {
      wall: {
        select: {
          id: true,
          name: true,
          gym: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      setGrade: true,
      colors: true,
      verifiedSetter: {
        select: {
          id: true,
          username: true,
        },
      },
      uploadedBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export const findBoulderById = async (id: string) => {
  return await prisma.boulder.findUnique({
    where: { id },
    include: {
      wall: {
        include: {
          gym: true,
        },
      },
      setGrade: true,
      colors: true,
      verifiedSetter: {
        select: {
          id: true,
          username: true,
          setter: true,
        },
      },
      uploadedBy: {
        select: {
          id: true,
          username: true,
        },
      },
      boulderValidations: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
};

export const findAllBoulders = async (filters: {
  wallId?: string;
  gymId?: string;
  setterId?: string;
  uploadedById?: string;
  status?: ValidationStatus;
}) => {
  // TODO any, no no no go
  const where: Prisma.BoulderWhereInput = {};

  if (filters.wallId) {
    where.wallId = filters.wallId;
  }

  if (filters.gymId) {
    where.wall = {
      gymId: filters.gymId,
    };
  }

  if (filters.setterId) {
    where.verifiedSetterId = filters.setterId;
  }

  if (filters.uploadedById) {
    where.uploadedById = filters.uploadedById;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.boulder.findMany({
    where,
    include: {
      wall: {
        select: {
          id: true,
          name: true,
          gym: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      setGrade: true,
      colors: true,
      verifiedSetter: {
        select: {
          id: true,
          username: true,
        },
      },
      uploadedBy: {
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
};

export const updateBoulder = async (
  id: string,
  data: {
    wallId?: string;
    name?: string;
    setGradeId?: string;
    verifiedSetterId?: string;
    unverifiedSetterName?: string;
    colorIds?: string[];
    status?: ValidationStatus;
  },
) => {
  const updateData: Prisma.BoulderUncheckedUpdateInput = {
    wallId: data.wallId,
    name: data.name,
    setGradeId: data.setGradeId,
    verifiedSetterId: data.verifiedSetterId,
    unverifiedSetterName: data.unverifiedSetterName,
    status: data.status,
  };

  // Handle colors update (many-to-many)
  if (data.colorIds) {
    updateData.colors = {
      set: [], // Clear existing
      connect: data.colorIds.map((id) => ({ id })), // Connect new ones
    };
  }

  return await prisma.boulder.update({
    where: { id },
    data: updateData,
    include: {
      wall: true,
      setGrade: true,
      colors: true,
      verifiedSetter: {
        select: {
          id: true,
          username: true,
        },
      },
      uploadedBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export const deleteBoulder = async (id: string, userId: string) => {
  const boulder = await findBoulderById(id);
  if (!boulder) {
    throw new Error("Boulder not found");
  } else if (boulder.uploadedById !== userId) {
    throw new Error("You are not authorised");
  } else {
    return await prisma.boulder.delete({
      where: { id },
    });
  }
};

//TODO inconsistency findBoulderById, findAllBoulders, updateBoulder
//TODO think about delition logic, now everybody can delete without any checks
