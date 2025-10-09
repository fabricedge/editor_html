import { UUID } from 'crypto';
import { createClient } from '../../../utils/supabase/server';

type Pages = {
  user_uuid: UUID
}

export default async function Pages(user: UUID) {
  const supabase = await createClient();
  const { data: pages } = await supabase.from("pages").select();

  return <pre className="text-black">{JSON.stringify(pages, null, 1)}</pre>
}

