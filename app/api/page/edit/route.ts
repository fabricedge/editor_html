import { NextResponse } from "next/server";
import { db } from '../../../lib/db';
import { pagesTable} from '../../../lib/schema';
import { eq } from 'drizzle-orm';

                                                                                                                                                                        
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_id, content } = body;

    if (!page_id || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
     
    const newHtmlData = `{"components":{"raw_html":{"value":"${content}"}}}`;

    await db.update(pagesTable).set({
      htmlData: newHtmlData,
      updatedAt: new Date(),
    }).where(eq(pagesTable.nanoid, page_id));

    console.log("Updated page:", { page_id, content: content.slice(0, 50) + "..." });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
