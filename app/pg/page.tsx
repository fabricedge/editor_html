import Image from "next/image";

import { getPosts } from '../lib/pages/user/data'
export default async function Pg({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const posts = await getPosts()
  return (
    <div>
      <main className="flex flex-col items-center justify-between p-8 ">
        <div className="text-black"> Posts: </div>
        <h1 className="text-3xl  text-black font-bold ">
          {posts.map((post, idx) => (
            <div key={idx}>{post.title}</div>
          ))}
        </h1>
        {/* ... */}
      </main>
    </div>
  )
}