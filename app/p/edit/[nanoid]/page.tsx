"use server";
import Editor from '../../../components/editor'
import { redirect } from "next/navigation";

import { neon } from '@neondatabase/serverless';
import { parseHtmlDataValue,parseHtmlDataExpirationDate, getPage } from '../../../lib/pages';

import { MAX_CHARACTERS } from "../../../lib/constants";



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
           <Editor // getHtmlDataValue parses a string 
          page_value={parseHtmlDataValue(page.htmlData)} page_id={nanoid} expiration={parseHtmlDataExpirationDate(page.htmlData)} server_updated_at={page.updatedAt.toISOString()} max_characters={max_characters} />
    );
  } catch (err) {
    console.error(err);
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
