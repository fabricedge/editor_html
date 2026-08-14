import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  nanoid: text("nanoid").notNull().unique(),
  htmlData: text("html_data"),
  theme: text("theme"),
  owner: text("owner"),
  private: boolean("private"),
  insertedAt: timestamp("inserted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});
