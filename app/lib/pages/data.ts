// /lib/data.ts

type Post = {
  id: string
  title: string
  content: string
  likes: number
}

const posts: Post[] = [
  { id: '1', title: 'Hello React', content: 'This is a post about React.', likes: 5 },
  { id: '2', title: 'Next.js Rocks', content: 'Next.js makes SSR easy.', likes: 10 },
]

export async function getPost(id: string): Promise<Post> {
  // Simulate a database or API call
  await new Promise((resolve) => setTimeout(resolve, 200)) // simulate delay
  const post = posts.find((p) => p.id === id)
  if (!post) throw new Error('Post not found')
  return post
}

export async function getPosts(): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 200)) // simulate delay
  return posts
}
