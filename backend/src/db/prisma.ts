import { PrismaClient } from '../../node_modules/.prisma/generated/prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  //In Production:
  prisma = new PrismaClient();
} else {
  //In Development:
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma }
