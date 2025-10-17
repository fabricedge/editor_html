// /lib/data.ts

// import { createClient } from '../utils/supabase/server';

import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql as sqld } from 'drizzle-orm';
import { pagesTable } from './schema';
import { nanoid } from 'nanoid'
import { neon } from '@neondatabase/serverless';
import * as schema from '../lib/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Retrieves a page based on a nanoid
export async function getPage(nanoid: string) {
  const page = await db.query.pagesTable.findFirst({
    where: eq(pagesTable.nanoid, nanoid),
  });

  if (!page) {
    // Or handle as a not-found case
    throw new Error('Page not found');
  }

  return page;
}
export async function createPage(nanoid: string) {
  

  return 1;
}



export function parseHtmlDataValue(htmlData: string | null): string {
  if (!htmlData) {
    return "";
  }

  try {
    const data = JSON.parse(htmlData);
    return data.component?.raw_html?.value ?? "";
  } catch (error) {
    console.error("Failed to parse htmlData:", error);
    return htmlData; // return original data if parsing fails
  }
}
