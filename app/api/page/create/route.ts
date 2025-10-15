import { NextResponse } from "next/server";
import { createClient } from '../../../utils/supabase/server';
import { nanoid } from 'nanoid'
async function generatePageId () {
    // generate page nanoid
    return nanoid()
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const generatedPageid = generatePageId()
    //if page_id == null  
    const { page_id, content } = body;


    if (!page_id || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🧩 Example: you could save to DB here
    console.log("Received from client:", { page_id, content: content.slice(0, 50) + "..." });
     const supabase = await createClient();
      const { data: updatedPage, error: updateError } = await supabase
        .from("pages")
        .update({ html_data: {components: {raw_html: {value: content}}} })
        .eq("nanoid", page_id)
        .single();
    

    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
