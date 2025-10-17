// /lib/data.ts

// import { createClient } from '../utils/supabase/server';

type Page = {
  nanoid: string
  title: string
  content: string
  likes: number
}



const pages: Page[] = [
  { nanoid: '1', title: 'Hello React', content: 'This is a post about React.', likes: 5 },
  { nanoid: '2', title: 'Next.js Rocks', content: 'Next.js makes SSR easy.', likes: 10 },
]


export async function getPosts(): Promise<Page[]> {
  await new Promise((resolve) => setTimeout(resolve, 200)) // simulate delay
  return pages
}
