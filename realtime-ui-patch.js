// UI patch functions for app.js — add these to your frontend.

function liveActivityCard() {
  const items = (window.realtimeState?.activityLogs || []).slice(0, 8);

  return `
    <div class="card">
      <h3>Live Activity</h3>
      <div id="live-activity-list" class="feed-list">
        ${
          items.length
            ? items.map(a => `
              <div class="feed-item">
                <b>${a.action || "Activity"}</b><br>
                <span>${a.message || ""}</span><br>
                <small>${new Date(a.created_at).toLocaleString("en-IN")}</small>
              </div>
            `).join("")
            : `<p class="small">No live activity yet.</p>`
        }
      </div>
    </div>
  `;
}

function teamTrackingCard() {
  const teams = (window.realtimeState?.teamStatus || []).slice(0, 10);

  return `
    <div class="card">
      <h3>Live Team Tracking</h3>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>City</th>
              <th>Done</th>
              <th>Status</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            ${
              teams.length
                ? teams.map(t => `
                  <tr>
                    <td>${t.team_name}</td>
                    <td>${t.city || "-"}</td>
                    <td>${t.today_done || 0}/${t.today_target || 0}</td>
                    <td>${t.online ? "Online" : "Offline"}</td>
                    <td>${t.updated_at ? new Date(t.updated_at).toLocaleTimeString("en-IN") : "-"}</td>
                  </tr>
                `).join("")
                : `<tr><td colspan="5">No team tracking data yet.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLiveActivity() {
  const el = document.getElementById("live-activity-list");
  if (!el) return;
  const items = (window.realtimeState?.activityLogs || []).slice(0, 8);
  el.innerHTML = items.map(a => `
    <div class="feed-item">
      <b>${a.action || "Activity"}</b><br>
      <span>${a.message || ""}</span><br>
      <small>${new Date(a.created_at).toLocaleString("en-IN")}</small>
    </div>
  `).join("");
}

function renderTeamTracking() {
  // simplest: re-render full app if your app uses render()
  if (typeof render === "function") render();
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText =
      "position:fixed;right:20px;bottom:20px;background:#22c55e;color:#041107;padding:12px 16px;border-radius:14px;font-weight:800;z-index:9999";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

function onProofUploaded(proof) {
  createActivityLog({
    actor_name: proof.created_by || "Field Team",
    actor_role: "execution",
    action: "Proof Uploaded",
    module: "execution",
    order_no: proof.order_no,
    vehicle_no: proof.vehicle_no,
    message: `Vehicle ${proof.vehicle_no} proof uploaded`
  });
}
