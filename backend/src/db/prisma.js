import { PrismaClient } from "@prisma/client";

const dbUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:diya3030jain@db.rqlbmopctmvukmfafotl.supabase.co:6543/postgres?pgbouncer=true";

const prisma = new PrismaClient({
  datasourceUrl: dbUrl,
});

export default prisma;