import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { PageEditSchema } from "@/lib/validators";
import { ZodError } from "zod";
import { getPageOrNotFound, getSessionUser, canEditPage } from "@/lib/page-access";
import { checkRateLimit } from "@/lib/rate-limit";

function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;
  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!verifyOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await checkRateLimit(`edit:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const user = await getSessionUser();

  try {
    const body = await request.json();
    const { page_id, content } = PageEditSchema.parse(body);

    const page = await getPageOrNotFound(page_id).catch(() => null);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (!canEditPage(page, user?.id ?? null)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingHtmlData = JSON.parse(page.htmlData || "{}");

    const newHtmlData = {
      ...existingHtmlData,
      components: {
        ...existingHtmlData.components,
        raw_html: {
          value: content,
        },
      },
    };

    await db
      .update(pagesTable)
      .set({
        htmlData: JSON.stringify(newHtmlData),
        updatedAt: new Date(),
      })
      .where(eq(pagesTable.nanoid, page_id));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
