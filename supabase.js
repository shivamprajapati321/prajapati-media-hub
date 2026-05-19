// Supabase helper for Prajapati Media Hub
// Add this file after including Supabase CDN in index.html:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseClient = null;

function initSupabase() {
  if (!window.supabase) {
    console.warn("Supabase CDN not loaded");
    return null;
  }

  if (
    !CONFIG.SUPABASE_URL ||
    CONFIG.SUPABASE_URL.includes("PASTE_") ||
    !CONFIG.SUPABASE_ANON_KEY ||
    CONFIG.SUPABASE_ANON_KEY.includes("PASTE_")
  ) {
    console.warn("Supabase config missing. App will use local/demo mode.");
    return null;
  }

  supabaseClient = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_ANON_KEY
  );

  return supabaseClient;
}

async function dbList(table, orderBy = "created_at") {
  if (!supabaseClient) return { ok: false, data: [], error: "Supabase not connected" };

  const { data, error } = await supabaseClient
    .from(table)
    .select("*")
    .order(orderBy, { ascending: false });

  return { ok: !error, data: data || [], error };
}

async function dbInsert(table, row) {
  if (!supabaseClient) return { ok: false, data: null, error: "Supabase not connected" };

  const { data, error } = await supabaseClient
    .from(table)
    .insert(row)
    .select()
    .single();

  return { ok: !error, data, error };
}

async function dbUpdate(table, id, patch) {
  if (!supabaseClient) return { ok: false, data: null, error: "Supabase not connected" };

  const { data, error } = await supabaseClient
    .from(table)
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  return { ok: !error, data, error };
}

async function uploadProofPhoto(file, fileName) {
  if (!supabaseClient) return { ok: false, url: null, error: "Supabase not connected" };

  const path = `proofs/${new Date().toISOString().slice(0,10)}/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(CONFIG.STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) return { ok: false, url: null, error: uploadError };

  const { data } = supabaseClient.storage
    .from(CONFIG.STORAGE_BUCKET)
    .getPublicUrl(path);

  return { ok: true, url: data.publicUrl, error: null };
}
