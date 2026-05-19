// Prajapati Media Hub — Supabase Realtime Helpers
// Requires:
// - config.js
// - supabase.js
// - supabaseClient initialized

const realtimeState = {
  channels: [],
  activityLogs: [],
  notifications: [],
  teamStatus: []
};

function subscribeRealtime() {
  if (!supabaseClient) {
    console.warn("Realtime skipped: Supabase not connected");
    return;
  }

  unsubscribeRealtime();

  const activityChannel = supabaseClient
    .channel("activity-feed")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "activity_logs" },
      payload => {
        realtimeState.activityLogs.unshift(payload.new || payload.old);
        if (typeof renderLiveActivity === "function") renderLiveActivity();
        if (typeof showToast === "function") showToast("Live activity updated");
      }
    )
    .subscribe();

  const teamChannel = supabaseClient
    .channel("team-live-status")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "team_live_status" },
      payload => {
        upsertById(realtimeState.teamStatus, payload.new);
        if (typeof renderTeamTracking === "function") renderTeamTracking();
      }
    )
    .subscribe();

  const notificationChannel = supabaseClient
    .channel("notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      payload => {
        realtimeState.notifications.unshift(payload.new);
        if (typeof renderNotifications === "function") renderNotifications();
        if (typeof showToast === "function") showToast(payload.new.title || "New notification");
      }
    )
    .subscribe();

  const proofChannel = supabaseClient
    .channel("execution-proofs")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "execution_proofs" },
      payload => {
        if (typeof onProofUploaded === "function") onProofUploaded(payload.new);
      }
    )
    .subscribe();

  realtimeState.channels.push(activityChannel, teamChannel, notificationChannel, proofChannel);
}

function unsubscribeRealtime() {
  if (!supabaseClient || !realtimeState.channels.length) return;
  realtimeState.channels.forEach(ch => supabaseClient.removeChannel(ch));
  realtimeState.channels = [];
}

function upsertById(list, item) {
  if (!item || !item.id) return;
  const idx = list.findIndex(x => x.id === item.id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
}

async function createActivityLog({
  actor_name = "",
  actor_role = "",
  action = "",
  module = "",
  order_no = "",
  assignment_no = "",
  vehicle_no = "",
  message = "",
  metadata = {}
}) {
  return dbInsert("activity_logs", {
    actor_name,
    actor_role,
    action,
    module,
    order_no,
    assignment_no,
    vehicle_no,
    message,
    metadata
  });
}

async function createNotification({
  user_role = "",
  user_phone = "",
  title = "",
  body = "",
  type = "info",
  module = "",
  order_no = ""
}) {
  return dbInsert("notifications", {
    user_role,
    user_phone,
    title,
    body,
    type,
    module,
    order_no
  });
}

async function updateTeamLiveStatus({
  team_name,
  team_lead = "",
  phone = "",
  city = "",
  current_location = "",
  latitude = null,
  longitude = null,
  accuracy = null,
  online = true,
  today_target = 0,
  today_done = 0
}) {
  if (!supabaseClient) return { ok: false, error: "Supabase not connected" };

  const { data: existing } = await supabaseClient
    .from("team_live_status")
    .select("*")
    .eq("team_name", team_name)
    .maybeSingle();

  const row = {
    team_name,
    team_lead,
    phone,
    city,
    current_location,
    latitude,
    longitude,
    accuracy,
    online,
    today_target,
    today_done,
    updated_at: new Date().toISOString()
  };

  if (existing) {
    const { data, error } = await supabaseClient
      .from("team_live_status")
      .update(row)
      .eq("id", existing.id)
      .select()
      .single();
    return { ok: !error, data, error };
  }

  const { data, error } = await supabaseClient
    .from("team_live_status")
    .insert(row)
    .select()
    .single();

  return { ok: !error, data, error };
}
