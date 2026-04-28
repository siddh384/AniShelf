import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. V7 requires us to configure the Postgres adapter explicitly
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// 2. Pass the adapter to the new client
export const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  trustedOrigins: ["http://localhost:5173"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true, // Turns on standard email/password login
  },
});
