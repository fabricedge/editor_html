"use server";
import Editor from '../../../ui/editor'
import { redirect } from "next/navigation";
import { pagesTable } from '../../../lib/schema';
import Header from '../../../ui/header'
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { getHtmlDataValue } from '../../../lib/pages';
import * as schema from '../../../lib/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function getPage(nanoid: string) {
  const page = await db.query.pagesTable.findFirst({
    where: eq(pagesTable.nanoid, nanoid),
  });

  if (!page) {
    // Or handle as a not-found case
    throw new Error('Page not found');
  }

  return page;
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
           <Editor // getHtmlDataValue parses a string 
          page_value={getHtmlDataValue(page.htmlData)} page_id={nanoid} server_updated_at={page.updatedAt} />
          
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