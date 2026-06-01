import { config } from "#config";
import bcrypt from "bcryptjs";
import { prisma } from "#db";

import type { User } from "#db";
import { ConflictError, NotFoundError } from "#errors";

// Helper Functions:
const hashPassword = async (password: string): Promise<string> => {
  const cost = config.crypto.cryptoHashSalt;
  const hash = await bcrypt.hash(password, cost);

  return hash;
};

export const comparePassword = async (
  plain: string,
  hashed: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plain, hashed);

  return isMatch;
};

// Main Functions:
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const findUserByUsername = async (
  username: string,
): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return user;
};

export const createUser = async (
  email: string,
  password: string,
  username: string,
  name: string,
  city: string,
): Promise<User> => {
  if (await findUserByEmail(email)) {
    throw new ConflictError("user already exist!");
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      name,
      city,
      passwordHash,
    },
  });

  return user;
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    city?: string;
    bio?: string;
    profilePicture?: string;
  },
) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const getUserStats = async (id: string) => {
  // Nutzerdaten + verknüpfte Objekte abfragen (nur `include`)
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userGymRoles: true,
      userGymStandings: true,
    },
  });
  if (!user) throw new NotFoundError("User not found");
  // Anzahlen abfragen (ohne unnötige Null-Prüfungen)
  const uploadedBouldersCount = await prisma.boulder.count({
    where: { uploadedById: id }, // Korrigiertes Feld
  });
  const userBouldersCount = await prisma.userBoulder.count({
    where: { userId: id },
  });
  const boulderValidationsCount = await prisma.boulderValidation.count({
    where: { userId: id },
  });
  return {
    user,
    counts: {
      uploadedBoulders: uploadedBouldersCount,
      userBoulders: userBouldersCount,
      boulderValidations: boulderValidationsCount,
    },
  };
};
