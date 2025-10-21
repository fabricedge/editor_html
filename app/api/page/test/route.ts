import { NextResponse } from "next/server";
import { test } from '../../../lib/testdb';
import { TestResponse } from "../../../lib/types";

export async function POST() {
  try {
    const result = await test(); // Make sure to await
    
    const response: TestResponse = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ 
      error: "Failed to save",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}