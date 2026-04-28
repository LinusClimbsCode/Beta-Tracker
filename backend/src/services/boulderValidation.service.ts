import { prisma } from "#db";
import type { Validation, ValidationStatus } from "#db";

export const validateBoulder = async (
  data: {
    boulderId: string;
    validation: Validation;
  },
  userId: string,
) => {
  // 1. Get boulder with current validations
  const boulder = await prisma.boulder.findUnique({
    where: { id: data.boulderId },
    include: {
      boulderValidations: {
        include: { user: { select: { id: true, validationPower: true } } },
      },
      uploadedBy: {
        select: { id: true },
      },
    },
  });

  if (!boulder) {
    throw new Error("Boulder not found");
  }

  // 2. Check if boulder is pending (can't validate approved/rejected boulders)
  if (boulder.status !== "pending") {
    throw new Error(`Cannot validate boulder with status: ${boulder.status}`);
  }

  // 3. Check if user is trying to validate their own upload
  if (boulder.uploadedBy.id === userId) {
    throw new Error("You cannot validate your own boulder");
  }

  // 3.1 Check if user is the verified setter - if so, auto-approve
  if (boulder.verifiedSetterId === userId) {
    // Setter confirming their own route - instant approval
    const updatedBoulder = await prisma.boulder.update({
      where: { id: data.boulderId },
      data: {
        status: "approved",
        currentValidationPoints: boulder.requiredValidationPoints,
      },
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

    // Create validation record for tracking
    const validation = await prisma.boulderValidation.create({
      data: {
        boulderId: data.boulderId,
        userId,
        validation: "approve",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            validationPower: true,
          },
        },
      },
    });

    return {
      validation,
      boulder: updatedBoulder,
      statusMessage: "Boulder approved by verified setter",
      stats: {
        approvalCount: 1,
        rejectionCount: 0,
        currentValidationPoints: boulder.requiredValidationPoints,
        requiredValidationPoints: boulder.requiredValidationPoints,
        needsModeratorReview: false,
      },
    };
  }

  // 4. Check if user already validated this boulder
  const existingValidation = await prisma.boulderValidation.findUnique({
    where: {
      boulderId_userId: {
        boulderId: data.boulderId,
        userId,
      },
    },
  });

  if (existingValidation) {
    throw new Error("You have already validated this boulder");
  }

  // 5. Get user's validation power and check email verification
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { validationPower: true, emailVerified: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.emailVerified) {
    throw new Error("Email must be verified to validate boulders");
  }

  // 6. Create validation record
  const validation = await prisma.boulderValidation.create({
    data: {
      boulderId: data.boulderId,
      userId,
      validation: data.validation,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          validationPower: true,
        },
      },
    },
  });

  // 7. Calculate approval/rejection counts (including the new validation we just created)
  const allValidations = [...boulder.boulderValidations, validation];
  const approvalCount = allValidations.filter(
    (v) => v.validation === "approve",
  ).length;
  const rejectionCount = allValidations.filter(
    (v) => v.validation === "reject",
  ).length;

  // 8. Calculate total validation points from ALL approvals
  let totalApprovalPoints = 0;

  for (const v of allValidations) {
    if (v.validation === "approve") {
      // Get the validation power of the user who approved (already included in the validation object)
      // TODO BUG boulderValidation v.user always undefined check
      const validatorPower = v.user?.validationPower || 0;
      totalApprovalPoints += validatorPower;
    }
  }

  // 9. Determine new status
  let newStatus: ValidationStatus = boulder.status;
  let statusMessage = "";

  if (data.validation === "approve") {
    // Check if enough approval points reached
    if (totalApprovalPoints >= boulder.requiredValidationPoints) {
      newStatus = "approved";
      statusMessage = "Boulder has been approved!";
    }
  } else if (data.validation === "reject") {
    // Check rejection thresholds
    if (rejectionCount >= 5) {
      newStatus = "rejected";
      statusMessage = "Boulder has been automatically rejected (5 rejections)";
    } else if (rejectionCount >= 3) {
      statusMessage = "Boulder flagged for moderator review (3 rejections)";
      // TODO: Notify moderator (implement notification system later)
    }
  }

  // 10. Update boulder
  const updatedBoulder = await prisma.boulder.update({
    where: { id: data.boulderId },
    data: {
      currentValidationPoints: totalApprovalPoints,
      status: newStatus,
    },
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

  return {
    validation,
    boulder: updatedBoulder,
    statusMessage,
    stats: {
      approvalCount,
      rejectionCount,
      currentValidationPoints: totalApprovalPoints,
      requiredValidationPoints: boulder.requiredValidationPoints,
      needsModeratorReview: rejectionCount >= 3 && rejectionCount < 5,
    },
  };
};

export const getBoulderValidations = async (boulderId: string) => {
  return await prisma.boulderValidation.findMany({
    where: { boulderId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          validationPower: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserValidations = async (userId: string) => {
  return await prisma.boulderValidation.findMany({
    where: { userId },
    include: {
      boulder: {
        select: {
          id: true,
          name: true,
          status: true,
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
