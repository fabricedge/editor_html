import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getPageOrNotFound, getSessionUser, canEditPage } from "@/lib/page-access";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ nanoid: string }> }
) {
  const user = await getSessionUser();

  try {
    const { nanoid } = await params;
    const page = await getPageOrNotFound(nanoid).catch(() => null);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (!canEditPage(page, user?.id ?? null)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(pagesTable).where(eq(pagesTable.nanoid, nanoid));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
