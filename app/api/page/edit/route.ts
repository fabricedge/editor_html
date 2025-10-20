import { NextResponse } from "next/server";
import { db } from '../../../../lib/db';
import { pagesTable} from '../../../../lib/schema';
import { eq } from 'drizzle-orm';
import { PageEditSchema } from "../../../../lib/validators";
import { ZodError } from "zod";

                                                                                                                                                                        
export async function POST(request: Request) {
  try {
    const body = await request.json();
    //validator
    const { page_id, content } = PageEditSchema.parse(body);

    const pages = await db.select().from(pagesTable).where(eq(pagesTable.nanoid, page_id));

    if (!pages.length) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const page = pages[0];

    const existingHtmlData = JSON.parse(page.htmlData || '{}');

    const newHtmlData = {
        ...existingHtmlData,
        components: {
            ...existingHtmlData.components,
            raw_html: {
                value: content,
            },
        },
    };

    const mergedHtmlData = JSON.stringify(newHtmlData);

    await db.update(pagesTable).set({
      htmlData: mergedHtmlData,
      updatedAt: new Date(),
    }).where(eq(pagesTable.nanoid, page_id));

   // console.log("Updated page:", { page_id, content: content.slice(0, 50) + "..." });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
