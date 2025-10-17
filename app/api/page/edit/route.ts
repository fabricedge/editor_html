import { NextResponse } from "next/server";
//import { createClient } from '../../../utils/supabase/server';

import { pagesTable } from '../../../lib/schema';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_id, content } = body;

    if (!page_id || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }


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
