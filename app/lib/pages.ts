// /lib/data.ts

// import { createClient } from '../utils/supabase/server';

import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql as sqld } from 'drizzle-orm';
import { pagesTable } from './schema';
import { nanoid } from 'nanoid'

const db = drizzle(process.env.DATABASE_URL!);
type Page = {
  nanoid: string
  title: string
  content: string
  likes: number
}

const pagestest: Page[] = [
  { nanoid: '1', title: 'Hello React', content: 'This is a post about React.', likes: 5 },
  { nanoid: '2', title: 'Next.js Rocks', content: 'Next.js makes SSR easy.', likes: 10 },
]
// Retrieves a page based on a nanoid
export async function getPage(nanoid: string) {
  const page = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.nanoid, nanoid));
  const results = await db.select().from(pagesTable);
  console.log(results[0].htmlData); 

  if (page.length === 0) {
    throw new Error('Page not found');
  }

  return results[0].htmlData
}

// async function selectUsers(withData: boolean) {
//   return db
//     .select({
//       html_data: pagesTable.html_data,
//       ...(withData ? { name: pagesTable.html_data } : {}),
//     })
//     .from(pagesTable);
// }
// const pagesTable = await selectUsers(true);