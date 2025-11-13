import { PrismaClient } from '@prisma/client';
import { config } from '#config'

declare global {
  var prisma: PrismaClient | undefined;
}

const nodeEnv = config.server.nodeEnv
let prisma: PrismaClient

if (nodeEnv === 'production') {
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

// export all types
export * from '@prisma/client';
