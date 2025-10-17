import { pgTable, text, uuid, serial,  boolean, timestamp } from "drizzle-orm/pg-core"; 


export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  nanoid: text("nanoid").notNull().unique(), // ✅ this is a normal column
  htmlData: text("html_data"),
  theme: text("theme"),
  owner: uuid("owner"),
  private: boolean("private"),
  insertedAt: timestamp("inserted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
