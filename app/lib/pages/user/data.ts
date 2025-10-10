// /lib/data.ts

import { createClient } from '../../../utils/supabase/server';

type Page = {
  nanoid: string
  title: string
  content: string
  likes: number
}

type PageSB = {
  nanoid: string
}

const pages: Page[] = [
  { nanoid: '1', title: 'Hello React', content: 'This is a post about React.', likes: 5 },
  { nanoid: '2', title: 'Next.js Rocks', content: 'Next.js makes SSR easy.', likes: 10 },
]
// Retrieves a page based on a nanoid
export async function getPage(nanoid: string) {
  const supabase = await createClient();
  const { data: page, error } = await supabase.from("pages").select("*").eq("nanoid", nanoid).single();
  
  //console.log(page)
  if(error) {
    throw new Error('Page not found')
  } else {
    return page
  }
  
}
export async function editPage(nanoid: string, data: string) {
  const supabase = await createClient();
  const { data: page, error } = await supabase.from("pages").insert("*").eq("nanoid", nanoid).single();
  //
  //console.log(page)
  if(error) {
    throw new Error('Page not found')
  } else {
    return page
  }
  
}

// export async function getPost(id: string): Promise<Page> {
//   // Simulate a database or API call
//   await new Promise((resolve) => setTimeout(resolve, 200)) // simulate delay
//   const post = pages.find((p) => p.nanoid === id)
//   if (!post) throw new Error('Post not found')
//   return post
// }

export async function getPosts(): Promise<Page[]> {
  await new Promise((resolve) => setTimeout(resolve, 200)) // simulate delay
  return pages
}
