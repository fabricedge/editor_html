"use server";
import Editor from '../../../ui/editor'
import { redirect } from "next/navigation";
import Header from '../../../ui/header'
import { neon } from '@neondatabase/serverless';
import { parseHtmlDataValue, getPage } from '../../../lib/pages';
import * as schema from '../../../lib/schema';
import { MAX_CHARACTERS } from "../../../lib/constants";

const sql = neon(process.env.DATABASE_URL!);

//todo: Check Cookies for the User soo i can CheckPermission
export default async function Page({
  params,
}: {
  params: { nanoid: string };
}) {
  try {
    const { nanoid } = await params;
    const page  = await getPage(nanoid);
    const max_characters = MAX_CHARACTERS;

    return (
      <div className="text-black">
        <style>{`
          @layer base {
            html, body {
              overflow: hidden;
            }
          }
        `}</style>
        <Header  user={{ name: "Knee" }} />
           <Editor // getHtmlDataValue parses a string 
          page_value={parseHtmlDataValue(page.htmlData)} page_id={nanoid} server_updated_at={page.updatedAt.toISOString()} max_characters={max_characters} />
          
      </div>
    );
  } catch (_err) {
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
