
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { pagesTable } from './schema';
import { nanoid } from 'nanoid'
const db = drizzle(process.env.DATABASE_URL!);

export async function test() {
  const generatedNanoId = nanoid()
  
  const page: typeof pagesTable.$inferInsert = {
    nanoid: generatedNanoId,
    htmlData: JSON.stringify({ components: { raw_html: { value: "newssvaszslue" } } }),
    };
  await db.insert(pagesTable).values(page);
  console.log('new page created')
  
  // const pages = await db.select().from(pagesTable);
  // console.log('Getting all users from the database: ', pages)


  await db
    .update(pagesTable) 
    .set({
      nanoid: generatedNanoId,
    })
    .where(eq(pagesTable.nanoid, page.nanoid));
  console.log('Test info updated!')

  //await db.delete(pagesTable).where(eq(pagesTable.nanoid, page.nanoid));
  console.log('Test completed!')
}


