
"use server";
import LikeButton from '../../ui/like-button'
import { getPage } from '../../lib/pages/user/data'
import Editor from '../../ui/editor'
import { redirect } from "next/navigation";


//todo: Have a visualizer for the html
export default async function Page({
  params,
}: {
  params: { nanoid: string };
}) {
  try {
    const { nanoid } = await params;
    const page = await getPage(nanoid);
    
    return (
      <div className="pt-5">
        <div className="text-black">{page.theme}</div>
        
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
