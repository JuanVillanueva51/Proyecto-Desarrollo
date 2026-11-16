import { PrismaClient } from "@prisma/client";

// Un solo PrismaClient en desarrollo (Next recarga los módulos en caliente).
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalParaPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalParaPrisma.prisma = prisma;
