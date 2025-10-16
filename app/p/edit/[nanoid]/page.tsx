
"use server";
import LikeButton from '../../../ui/like-button'
//import { getPage } from '../../../lib/pages'
import Editor from '../../../ui/editor'
import { redirect } from "next/navigation";
import { pagesTable } from '../../../lib/schema';
import Header from '../../../ui/header'
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql as sqld } from 'drizzle-orm';
//import { createClient } from '../../../utils/supabase/server';

const db = drizzle(process.env.DATABASE_URL!);

async function getPage(nanoid: string) {
  const page = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.nanoid, nanoid));
  //const page = await db.select().from(pagesTable).where(sqld`${pagesTable.nanoid} = ${nanoid}`);
  console.log(page, "result");
//  const page = await getPage('abc123');

  if (page.length === 0) {
    throw new Error('Page not found');
  }

  return page
}
//todo: Check Cookies for the User soo i can CheckPermission
export default async function Page({
  params,
}: {
  params: { nanoid: string };
}) {
  try {
    const { nanoid } = await params;
    const page  = await getPage(nanoid);
    

    return (
      <div className="text-black">
        <Header  user={{ name: "Knee" }} />
    
           <Editor //page={page} 
          page_value={page[0].htmlData ?? ""} page_id={nanoid} server_updated_at={page[0].updatedAt} />
          
      </div>
    );
  } catch (err) {
    // You can either redirect or show an error page
    redirect("/404");
  }
}


export async function CheckPermission() {
  //const { nanoid } = await params
  //const post = await getPage(nanoid)
  return (
    function Func() {}
  )
}
