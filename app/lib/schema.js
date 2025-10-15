import { pgTable, text, uuid, boolean, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
  id: integer("id").primaryKey(),
  nanoid: text("nanoid").notNull(), // ✅ this is a normal column
  html_data: jsonb("html_data"),
  theme: text("theme"),
  owner: uuid("owner"),
  private: boolean("private"),
  insertedAt: timestamp("inserted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
