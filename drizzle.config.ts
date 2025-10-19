import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/lib/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});
