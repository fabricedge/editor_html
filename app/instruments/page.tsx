import { createClient } from '../../app/utils/supabase/server';

export default async function Instruments() {
  const supabase = await createClient();
  const { data: pages } = await supabase.from("pages").select();

  return <pre className="text-black">{JSON.stringify(pages, null, 2)}</pre>
}