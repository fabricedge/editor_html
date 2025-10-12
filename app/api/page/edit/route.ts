import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content } = await req.json();

  //console.log("Saving content to database:", content);
  
  // Example: save to Supabase or DB
  // const supabase = createClient();
  // await supabase.from("pages").update({ html_data: content }).eq("id", 1);

  return NextResponse.json({ success: true });
}
