import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const basePrisma = globalForPrisma.prisma ?? new PrismaClient();

// ✅ cache base instance
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
}

// ❗ extend 不要破壞 base type
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        console.log("🔥 PRISMA HIT");
        return query(args);
      },
    },
  },
}) as typeof basePrisma;
