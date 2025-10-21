import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { pagesTable } from "../../../lib/schema";
import { PageCreateSchema } from "../../../lib/validators";
import { ZodError } from "zod";

// ✅ POST /api/page/create
export async function POST(request: Request) {
  try {
    const body = await request.json();
    //validate content
    const { page_id, content, theme, private: isPrivate } = PageCreateSchema.parse(body);

    // ✅ Prepare JSON payload for database
    const newHtmlData = JSON.stringify({
      components: {
        raw_html: {
          value: content,
        },
      },
      name: "name",
      shorten_url: "shorten_url",
    });

    const creationDate = new Date();

    // 💾 Database insert
    await db.insert(pagesTable).values({
      nanoid: page_id,
      htmlData: newHtmlData,
      theme: theme || "raw_html",
      private: !!isPrivate,
      insertedAt: creationDate,
      updatedAt: creationDate,
    });

    console.log("✅ Inserted page:", {
      page_id,
      theme,
      isPrivate,
      preview: content.slice(0, 60) + "...",
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
    
    console.error("❌ General error in POST /api/page/create:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
