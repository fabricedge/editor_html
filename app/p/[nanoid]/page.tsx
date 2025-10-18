
"use server";
//import LikeButton from '../../ui/like-button'
import { parseHtmlDataValue, getPage } from '../../lib/pages';
//import Editor from '../../ui/editor'
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
        <style>{`
          @layer base {
            html, body {
              overflow: hidden;
            }
          }
        `}</style>
        <div className="text-black align-items-center"></div>
          <div  dangerouslySetInnerHTML={{ __html: parseHtmlDataValue(page.htmlData) }} />
      </div>
    );
  } catch {
    htmlContent = ""; // Fallback to empty string on error
  }
}


export async function CheckPermission() {
  //const { nanoid } = await params
  //const post = await getPage(nanoid)
  return (
    function Func() {}
  )
}
