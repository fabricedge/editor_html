// /lib/data.ts

import { createClient } from '../../utils/supabase/server';

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
export async function getUser(user_uuid: string) {
  const supabase = await createClient();
  const { data: page, error } = await supabase.from("users").select("*").eq("user_uuid", user_uuid).single();
  
  //console.log(page)
  if(error) {
    throw new Error('Page not found')
  } else {
    return page
  }
}

export async function getPosts(): Promise<Page[]> {
  await new Promise((resolve) => setTimeout(resolve, 200)) // simulate delay
  return pages
}
