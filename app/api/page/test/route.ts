import { NextResponse } from "next/server";
//import { createClient } from '../../../utils/supabase/server';


import {test} from '../../../lib/testdb'

export async function POST(request: Request) {
  try {
    test()
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
