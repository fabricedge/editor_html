
"use server";
import LikeButton from '../../../ui/like-button'
import { getPage } from '../../../lib/pages/user/data'
import Editor from '../../../ui/editor'


//todo: Check Cookies for the User soo i can CheckPermission
export default async function Page({
  params,
}: {
  params: Promise<{nanoid: string }>
}) {
  
  const { nanoid } = await params
  
  const post = await getPage(nanoid)
  console.log(post)
  return (
    <div className="pt-5">
      <div className="text-black">{post.theme}</div>
      <Editor/>
    </div>
  )
}


export async function CheckPermission() {
  //const { nanoid } = await params
  //const post = await getPage(nanoid)
  return (
    function Func() {}
  )
}
