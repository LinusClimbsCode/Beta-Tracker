import { prisma } from "#db";
import { ConflictError } from "#errors";

export const createColor = async (data: { name: string; hexCode: string }) => {
  // Check for duplicate name
  const existingName = await prisma.color.findFirst({
    where: { name: data.name },
  });
  if (existingName) {
    throw new ConflictError("Color with this name already exists");
  }

  // Check for duplicate hexCode
  const existingHex = await prisma.color.findFirst({
    where: { hexCode: data.hexCode },
  });
  if (existingHex) {
    throw new ConflictError("Color with this hex code already exists");
  }

  return await prisma.color.create({
    data,
  });
};

export const findColorById = async (id: string) => {
  return await prisma.color.findUnique({
    where: { id },
  });
};

export const findAllColors = async () => {
  return await prisma.color.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const updateColor = async (
  id: string,
  data: {
    name?: string;
    hexCode?: string;
  },
) => {
  // Check for duplicate name (if updating name)
  if (data.name) {
    const existingName = await prisma.color.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });
    if (existingName) {
      throw new ConflictError("Color with this name already exists");
    }
  }

  // Check for duplicate hexCode (if updating hexCode)
  if (data.hexCode) {
    const existingHex = await prisma.color.findFirst({
      where: {
        hexCode: data.hexCode,
        NOT: { id },
      },
    });
    if (existingHex) {
      throw new ConflictError("Color with this hex code already exists");
    }
  }

  return await prisma.color.update({
    where: { id },
    data,
  });
};

export const deleteColor = async (id: string) => {
  return await prisma.color.delete({
    where: { id },
  });
};
