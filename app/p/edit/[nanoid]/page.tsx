
"use server";
import LikeButton from '../../../ui/like-button'
import { getPage } from '../../../lib/pages/user/data'
import Editor from '../../../ui/editor'
import { redirect } from "next/navigation";

import Header from '../../../ui/header'
import { createClient } from '../../../utils/supabase/server';

//todo: Check Cookies for the User soo i can CheckPermission
export default async function Page({
  params,
}: {
  params: { nanoid: string };
}) {
  try {
    const { nanoid } = await params;
    const page = await getPage(nanoid);
    
    return (
      <div>
        <Header user={{ name: "Knee" }} />
        <div className="pt-5 text-black">
          
          <div className="text-black">test</div>
          <Editor page={page.html_data.components.raw_html.value}/>

        </div>
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
