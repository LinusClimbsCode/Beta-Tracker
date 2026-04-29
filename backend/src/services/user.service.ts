import { config } from "#config";
import bcrypt from "bcryptjs";
import { prisma } from "#db";

import type { User } from "#db";

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
    throw new Error("user already exist!");
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
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      city: true,
      experiencePoints: true,
      trustPoints: true,
      validationPower: true,
      _count: {
        select: {
          uploadedBoulders: true,
          userBoulders: true,
          boulderValidations: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};
