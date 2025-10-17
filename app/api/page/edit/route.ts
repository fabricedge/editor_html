import { NextResponse } from "next/server";
//import { createClient } from '../../../utils/supabase/server';

import { pagesTable } from '../../../lib/schema';
import { drizzle } from 'drizzle-orm/neon-http';
import {test} from '../../../lib/testdb'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_id, content } = body;

    if (!page_id || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const page: typeof pagesTable.$inferInsert = {
        nanoid: page_id,
        htmlData: JSON.stringify({ components: { raw_html: { value: content } } }),
        };

    // 🧩 Example: you could save to DB here
    console.log("Received from client:", { page_id, content: content.slice(0, 50) + "..." });
    
    //test()

    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
