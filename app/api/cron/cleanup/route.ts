import { NextResponse } from "next/server";
import { lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/schema";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const result = await db.delete(pagesTable).where(lt(pagesTable.expiresAt, now));

    return NextResponse.json({ data: "Success", deletedPages: result.rowCount ?? 0, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
