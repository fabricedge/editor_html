import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/lib/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_OYXU69Edjiyf@ep-cool-mode-ac5mff3r-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  }
});
