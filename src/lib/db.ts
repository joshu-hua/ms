import { PrismaClient } from "@prisma/client";

// Create a global variable to store the Prisma client
// This prevents creating multiple instances in development
declare global {
	var prisma: PrismaClient | undefined;
}

// Create or reuse the Prisma client
// In development, this prevents "too many clients" errors during hot reloads
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
	globalThis.prisma = prisma;
}

export default prisma;
