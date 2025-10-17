import { NextResponse } from "next/server";
import { test } from '../../../lib/testdb';

export async function POST(request: Request) {
  try {
    const result = await test(); // Make sure to await
    
    return NextResponse.json({ 
      success: true,
      data: result 
    });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ 
      error: "Failed to save",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}