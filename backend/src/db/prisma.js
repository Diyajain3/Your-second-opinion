import { PrismaClient } from "@prisma/client";

const dbUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres.rqlbmopctmvukmfafotl:diya3030jain@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient({
  datasourceUrl: dbUrl,
});

export default prisma;