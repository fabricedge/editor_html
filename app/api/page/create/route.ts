import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { pagesTable } from "../../../lib/schema";
import { MAX_CHARACTERS } from "../../../lib/constants";

// ✅ POST /api/page/create
export async function POST(request: Request) {
  try {
    // Parse and validate JSON body
    const body = await request.json().catch(() => {
      throw new Error("Invalid JSON payload");
    });

    const { page_id, content, theme, private: isPrivate } = body;

    // 🧩 Validation
    if (!page_id || typeof page_id !== "string") {
      return NextResponse.json({ error: "Invalid or missing 'page_id'" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid or missing 'content'" }, { status: 400 });
    }

    if (content.length > MAX_CHARACTERS) {
      return NextResponse.json({ error: "Content exceeds maximum length" }, { status: 413 });
    }

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
    try {
      await db.insert(pagesTable).values({
        nanoid: page_id,
        htmlData: newHtmlData,     // make sure your schema defines htmlData = text("html_data")
        theme: theme || "raw_html",
        private: !!isPrivate,
        insertedAt: creationDate,
        updatedAt: creationDate,
      });
    } catch (dbError: any) {
      console.error("Database insert failed:", dbError);

      if (dbError.code === "23505") {
        // unique_violation (Postgres)
        return NextResponse.json(
          { error: "A page with this ID already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Database error: " + (dbError.message || "Unknown") },
        { status: 500 }
      );
    }

    console.log("✅ Inserted page:", {
      page_id,
      theme,
      isPrivate,
      preview: content.slice(0, 60) + "...",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ General error in POST /api/page/create:", error);

    if (error.message === "Invalid JSON payload") {
      return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
