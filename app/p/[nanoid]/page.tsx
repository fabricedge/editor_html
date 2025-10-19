
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
  let htmlContent = ""; // declare fallback

  try {
    const { nanoid } = params;
    const page = await getPage(nanoid);
    htmlContent = parseHtmlDataValue(page.htmlData);
  } catch (error) {
    console.error(error);
    htmlContent = "<p>Failed to load page.</p>"; // fallback HTML
  }

  return (
    <div className="pt-5">

      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}



export async function CheckPermission() {
  //const { nanoid } = await params
  //const post = await getPage(nanoid)
  return (
    function Func() {}
  )
}
