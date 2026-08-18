import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/schema";
import { PageCreateSchema } from "@/lib/validators";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";

const WEEK_MS = 1000 * 60 * 60 * 24 * 7;
const MONTH_MS = WEEK_MS * 4;

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user ?? null;

  try {
    const body = await request.json();
    const {
      page_id,
      content,
      theme,
      private: isPrivate,
    } = PageCreateSchema.parse(body);

    const creationDate = new Date();
    const ttl = user?.id ? MONTH_MS : WEEK_MS;
    const expiresAt = new Date(creationDate.getTime() + ttl);

    const newHtmlData = JSON.stringify({
      components: {
        raw_html: {
          value: content,
        },
      },
    });

    await db.insert(pagesTable).values({
      nanoid: page_id,
      htmlData: newHtmlData,
      theme: theme || "raw_html",
      private: !!isPrivate,
      insertedAt: creationDate,
      updatedAt: creationDate,
      expiresAt,
      owner: user?.id ?? null,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes("23505")) {
      return NextResponse.json(
        { error: "A page with this ID already exists" },
        { status: 409 }
      );
    }

    console.error("Error in POST /api/page/create:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
