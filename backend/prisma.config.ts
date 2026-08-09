import "dotenv/config";
import { defineConfig } from "prisma/config";

const rawUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:diya3030jain@db.rqlbmopctmvukmfafotl.supabase.co:6543/postgres?pgbouncer=true";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: rawUrl,
  },
});
