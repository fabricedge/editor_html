import { eq } from "drizzle-orm";
import { pagesTable } from "./schema";
import { db } from "./db";

export async function getPage(nanoid: string) {
  const page = await db.query.pagesTable.findFirst({
    where: eq(pagesTable.nanoid, nanoid),
  });

  if (!page) {
    throw new Error("Page not found");
  }

  return page;
}

export function getPageOwnerId(page: typeof pagesTable.$inferSelect): string | null {
  if (!page.owner) return null;

  try {
    const parsed = JSON.parse(page.owner);
    return parsed?.id ?? null;
  } catch {
    return page.owner;
  }
}

export function parseHtmlDataValue(htmlData: string | null): string {
  if (!htmlData) {
    return "";
  }

  try {
    const data = JSON.parse(htmlData);
    return data.components?.raw_html?.value ?? "";
  } catch (error) {
    console.error("Failed to parse htmlData:", error);
    return "";
  }
}
