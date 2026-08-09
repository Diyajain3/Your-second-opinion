import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDbUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:diya3030jain@db.rqlbmopctmvukmfafotl.supabase.co:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: fallbackDbUrl,
  },
});
