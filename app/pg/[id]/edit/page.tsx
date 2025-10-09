
"use server";
import LikeButton from '../../../ui/like-button'
import { getPost } from '../../../lib/pages/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
  post.likes = post.likes ?? 0
  post.title = post.title ?? 'Untitled'
  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}