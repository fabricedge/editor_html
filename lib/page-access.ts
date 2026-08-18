import { eq } from "drizzle-orm";
import { pagesTable } from "./schema";
import { db } from "./db";
import { auth } from "./auth";

export type PageRow = typeof pagesTable.$inferSelect;

export async function getPageOrNotFound(nanoid: string): Promise<PageRow> {
  const page = await db.query.pagesTable.findFirst({
    where: eq(pagesTable.nanoid, nanoid),
  });

  if (!page) {
    throw new Error("Page not found");
  }

  return page;
}

export async function getSessionUser(): Promise<{ id: string } | null> {
  const session = await auth();
  return session?.user?.id ? { id: session.user.id } : null;
}

export function getPageOwnerId(page: PageRow): string | null {
  return page.owner || null;
}

export function isPageOwner(page: PageRow, userId: string | null): boolean {
  const ownerId = getPageOwnerId(page);
  if (!ownerId || !userId) return false;
  return ownerId === userId;
}

export function canViewPage(page: PageRow, userId: string | null): boolean {
  if (!page.private) return true;
  return isPageOwner(page, userId);
}

export function canEditPage(page: PageRow, userId: string | null): boolean {
  const ownerId = getPageOwnerId(page);
  if (!ownerId) return true;
  return userId === ownerId;
}
