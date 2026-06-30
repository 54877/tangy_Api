// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma?: PrismaClient;
// };

// const basePrisma = globalForPrisma.prisma ?? new PrismaClient();

// export const prisma = basePrisma.$extends({
//   query: {
//     $allModels: {
//       async $allOperations({ model, operation, args, query }) {
//         console.log("🔥 PRISMA HIT", model, operation);
//         return query(args);
//       },
//     },
//   },
// }) as typeof basePrisma;

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = basePrisma;
// }

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
