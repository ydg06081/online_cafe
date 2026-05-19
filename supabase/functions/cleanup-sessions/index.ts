import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async () => {
  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const sb = createClient(url, serviceKey);

  const { count, error } = await sb
    .from('sessions')
    .update({ status: 'ended' }, { count: 'exact' })
    .eq('status', 'active')
    .lt('expires_at', new Date(Date.now() - 5 * 60_000).toISOString());

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ ended: count ?? 0 }), {
    headers: { 'content-type': 'application/json' },
  });
});
