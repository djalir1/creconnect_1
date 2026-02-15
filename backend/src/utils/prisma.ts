import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient Initialization
 * * We use a global variable to ensure the Prisma Client is only 
 * instantiated once during local development. This prevents 
 * "Too many connections" errors and crashes during Hot Module Replacement.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 'query' logs every SQL command to your terminal. 
    // This helps you see exactly what's happening when you try to Login or Register.
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;