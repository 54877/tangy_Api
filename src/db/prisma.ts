import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const basePrisma = globalForPrisma.prisma ?? new PrismaClient();

export const extendedPrisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        console.log("🔥 PRISMA HIT");
        console.log("model:", model);
        console.log("action:", operation);
        console.log("args:", args);

        return query(args);
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
}

export const prisma = extendedPrisma;
