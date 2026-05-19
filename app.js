const CONFIG = {
  COMPANY: "Prajapati Advertising",
  VERSION: "2.0 Enterprise",
  API_URL: "https://script.google.com/macros/s/AKfycbxdXND_xK9HzCr0JUmnQZ8lVHAhZ96ph-lIKem3fwXl9L9DcOB0t5mwdC_r6boiH_8i/exec"
};

const state = {
  active: "command"
};

const modules = [
  ["command", "🏢", "Command Center"],
  ["sales", "💼", "Sales CRM"],
  ["printing", "🖨️", "Printing"],
  ["stitching", "🪡", "Stitching"],
  ["execution", "⚙️", "Execution"],
  ["field", "📱", "Field App"],
  ["client", "👤", "Client Portal"],
  ["delivery", "🚚", "Delivery"],
  ["finance", "💳", "Finance"],
  ["admin", "👑", "Admin"]
];

const kpi = (label, value, sub = "") => `
  <div class="card">
    <div class="kpi-label">${label}</div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-sub">${sub}</div>
  </div>
`;

const status = (text, cls = "green") => `<span class="badge ${cls}">${text}</span>`;

function layout(content) {
  const nav = modules.map(([id, icon, label]) => `
    <button class="nav-btn ${state.active === id ? "active" : ""}" onclick="go('${id}')">
      <span>${icon}</span><span>${label}</span>
    </button>
  `).join("");

  document.getElementById("app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand"><span>MEDIA</span>HUB<div class="brand-sub">${CONFIG.COMPANY}</div></div>
        <nav class="nav">${nav}</nav>
      </aside>
      <main class="main">
        <div class="topbar">
          <div class="title">
            <h1>${pageTitle()}</h1>
            <p>ERP + GPS Proof + OCR + Client Portal + Finance Control</p>
          </div>
          <div class="top-actions">
            <button class="btn secondary">Live Sync</button>
            <button class="btn">Deploy Ready</button>
          </div>
        </div>
        ${content}
      </main>
    </div>
  `;
}

function pageTitle() {
  const found = modules.find(m => m[0] === state.active);
  return found ? found[2] : "Prajapati Media Hub";
}

function go(id) {
  state.active = id;
  render();
}

function render() {
  const map = {
    command: commandCenter,
    sales: salesCRM,
    printing: printing,
    stitching: stitching,
    execution: execution,
    field: fieldApp,
    client: clientPortal,
    delivery: delivery,
    finance: finance,
    admin: admin
  };
  layout((map[state.active] || commandCenter)());
}

function commandCenter() {
  return `
    <div class="grid kpis">
      ${kpi("Today Revenue", "₹4.8L", "+18% from yesterday")}
      ${kpi("Running Campaigns", "42", "8 cities active")}
      ${kpi("Today Execution", "752", "Autos reported")}
      ${kpi("Pending Work", "1,240", "Print/Stitch/Install")}
      ${kpi("Delayed Jobs", "7", "Needs attention")}
      ${kpi("Collection Due", "₹12.6L", "14 invoices")}
    </div>
    <div class="grid two">
      <div class="card">
        <div class="section-head"><h2>Live Campaign Map</h2><small>Pune · Mumbai · Nagpur · Nashik</small></div>
        <div class="map"><span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span></div>
      </div>
      <div class="card">
        <div class="section-head"><h2>Live Activity Feed</h2><small>Auto refresh</small></div>
        <div class="feed">
          <div class="feed-item">✅ Ravi team completed 25 fittings — Pune</div>
          <div class="feed-item">🖨️ Printing completed ORD-99848 — 300 pcs</div>
          <div class="feed-item">🪡 Md Sultan submitted 110 stitched hoods</div>
          <div class="feed-item">💰 Payment received ₹45,000 — Aakash Institute</div>
          <div class="feed-item">⚠️ Nagpur execution delayed by 2 hours</div>
        </div>
      </div>
    </div>
    <div class="grid three" style="margin-top:14px">
      ${departmentStatus()}
      ${topPerformers()}
      ${aiAlerts()}
    </div>
  `;
}

function departmentStatus() {
  return `
  <div class="card">
    <div class="section-head"><h2>Department Status</h2></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Dept</th><th>Done</th><th>Pending</th></tr></thead>
      <tbody>
        <tr><td>Printing</td><td>1,200</td><td>300</td></tr>
        <tr><td>Stitching</td><td>732</td><td>20</td></tr>
        <tr><td>Execution</td><td>752</td><td>488</td></tr>
      </tbody>
    </table></div>
  </div>`;
}

function topPerformers() {
  return `
  <div class="card">
    <div class="section-head"><h2>Top Performers</h2></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Output</th></tr></thead>
      <tbody>
        <tr><td>Md Sultan</td><td>150 pcs</td></tr>
        <tr><td>Ravi Team</td><td>220 autos</td></tr>
        <tr><td>Shamal</td><td>₹2.1L sales</td></tr>
      </tbody>
    </table></div>
  </div>`;
}

function aiAlerts() {
  return `
  <div class="card">
    <div class="section-head"><h2>AI Alerts</h2></div>
    <div class="feed">
      <div class="feed-item">🚨 3 orders crossed deadline</div>
      <div class="feed-item">📉 Printing speed 22% slower today</div>
      <div class="feed-item">🧾 5 invoices pending after reporting</div>
    </div>
  </div>`;
}

function salesCRM() {
  const columns = [
    ["New Lead", ["Narayana Education", "Dental Clinic"]],
    ["Contacted", ["Tea Brand"]],
    ["Quotation", ["Aakash Institute"]],
    ["Follow-up", ["Real Estate Co."]],
    ["Negotiation", ["Hospital Chain"]],
    ["Won", ["Fun Kingdom"]]
  ];
  return `
    <div class="grid kpis">
      ${kpi("New Leads", "86")}
      ${kpi("Follow-ups Today", "34")}
      ${kpi("Quotations", "19")}
      ${kpi("Won Orders", "8")}
      ${kpi("Revenue Pipeline", "₹38L")}
      ${kpi("Closing Ratio", "21%")}
    </div>
    <div class="card">
      <div class="section-head"><h2>Sales Pipeline Kanban</h2><small>Meta + IndiaMART + WhatsApp + Website</small></div>
      <div class="pipeline">
        ${columns.map(([title, deals]) => `
          <div class="pipe">
            <h3>${title}</h3>
            ${deals.map(d => `<div class="deal"><b>${d}</b><p>Auto Rickshaw Branding · Follow-up ready</p></div>`).join("")}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function printing() {
  return `
    <div class="grid kpis">
      ${kpi("Print Jobs", "18")}
      ${kpi("Today Output", "1,200")}
      ${kpi("Ink Remaining", "72%")}
      ${kpi("Urgent Jobs", "5")}
      ${kpi("Reprint", "2")}
      ${kpi("Avg Speed", "140/hr")}
    </div>
    <div class="grid two">
      <div class="card">
        <div class="section-head"><h2>Print Queue</h2><small>Priority wise</small></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Order</th><th>Media</th><th>Qty</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>ORD-99848</td><td>Hood</td><td>300</td><td>${status("Printing", "blue")}</td></tr>
            <tr><td>ORD-99849</td><td>Back Panel</td><td>500</td><td>${status("Queued", "orange")}</td></tr>
            <tr><td>ORD-99850</td><td>Vinyl</td><td>120</td><td>${status("Done", "green")}</td></tr>
          </tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="section-head"><h2>Ink & Material</h2><small>CMYK live stock</small></div>
        <div class="feed">
          <div class="feed-item">Cyan — 6.2L remaining</div>
          <div class="feed-item">Magenta — 4.8L remaining</div>
          <div class="feed-item">Yellow — 5.1L remaining</div>
          <div class="feed-item">Black — 8.4L remaining</div>
        </div>
      </div>
    </div>
  `;
}

function stitching() {
  return `
    <div class="grid kpis">
      ${kpi("Today Stitch", "732")}
      ${kpi("Pending", "420")}
      ${kpi("Masters Active", "7")}
      ${kpi("OT Work", "180")}
      ${kpi("Payable", "₹18,450")}
      ${kpi("Rejection", "1.8%")}
    </div>
    <div class="grid two">
      <div class="card">
        <div class="section-head"><h2>Master Productivity</h2><small>Daily output</small></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Master</th><th>Regular</th><th>OT</th><th>Payable</th></tr></thead>
          <tbody>
            <tr><td>Md Sultan</td><td>110</td><td>40</td><td>₹2,250</td></tr>
            <tr><td>Md Salman</td><td>95</td><td>20</td><td>₹1,725</td></tr>
            <tr><td>Sanjay</td><td>88</td><td>0</td><td>₹1,320</td></tr>
          </tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="section-head"><h2>Bundle QR Workflow</h2></div>
        <div class="steps">
          <div class="step"><b>Print Slip</b><small>Order + Qty</small></div>
          <div class="step"><b>Assign Master</b><small>Piece rate</small></div>
          <div class="step"><b>QC</b><small>Check defect</small></div>
          <div class="step"><b>Ready</b><small>Dispatch</small></div>
          <div class="step"><b>Payment</b><small>Auto ledger</small></div>
        </div>
      </div>
    </div>
  `;
}

function execution() {
  return `
    <div class="steps">
      <div class="step"><b>1. Order Select</b><small>Campaign + city</small></div>
      <div class="step"><b>2. Team Assign</b><small>Lead + qty + date</small></div>
      <div class="step"><b>3. GPS Proof</b><small>Live location</small></div>
      <div class="step"><b>4. OCR Check</b><small>Vehicle no verify</small></div>
      <div class="step"><b>5. Report</b><small>PDF + client link</small></div>
    </div>
    <div class="grid two">
      <div class="card">
        <div class="section-head"><h2>Execution Job Entry</h2><small>GPS/OCR ready flow</small></div>
        <div class="form">
          <div class="field"><label>Order</label><select><option>ORD-99848 · Auto Hood · Pune</option></select></div>
          <div class="field"><label>Type</label><select><option>Fitting</option><option>Installation</option><option>Back Panel</option></select></div>
          <div class="field"><label>City / Location</label><input value="Pune - Hadapsar" /></div>
          <div class="field"><label>Scheduled Date</label><input type="date" /></div>
          <div class="field"><label>Team Lead</label><input value="Ravi Team" /></div>
          <div class="field"><label>Target Qty</label><input value="250" /></div>
          <div class="field full"><label>Notes</label><textarea rows="3">Client team available, live WhatsApp group reporting compulsory.</textarea></div>
        </div>
      </div>
      <div class="card">
        <div class="section-head"><h2>Execution Dashboard</h2><small>Today</small></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Team</th><th>Target</th><th>Done</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Ravi</td><td>250</td><td>180</td><td>${status("On Track","green")}</td></tr>
            <tr><td>Vivek</td><td>180</td><td>90</td><td>${status("Slow","orange")}</td></tr>
            <tr><td>External Team</td><td>300</td><td>0</td><td>${status("Not Started","red")}</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  `;
}

function fieldApp() {
  return `
    <div class="phone">
      <div class="phone-screen">
        <div class="phone-head"><b>Field Execution App</b><span class="badge green">GPS ON</span></div>
        <div class="phone-body">
          <div class="field"><label>Campaign</label><select><option>ORD-99848 · Pune</option></select></div>
          <div class="camera">📸 Camera Preview<br>Auto GPS + Timestamp</div>
          <div class="grid two">
            <div class="card"><div class="kpi-label">OCR Plate</div><div class="kpi-value" style="font-size:22px">MH12AB1234</div></div>
            <div class="card"><div class="kpi-label">GPS</div><div class="kpi-value" style="font-size:22px">18.5204°N</div></div>
          </div>
          <button class="btn" style="width:100%;margin-top:12px">Upload Proof Photo</button>
          <div class="feed" style="margin-top:12px"><div class="feed-item">✅ Duplicate check passed</div><div class="feed-item">✅ Location within campaign radius</div><div class="feed-item">✅ Report item added</div></div>
        </div>
      </div>
    </div>
  `;
}

function clientPortal() {
  return `
    <div class="grid kpis">
      ${kpi("Campaign", "Aakash")}
      ${kpi("Total Autos", "1,000")}
      ${kpi("Completed", "752")}
      ${kpi("Pending", "248")}
      ${kpi("Photos", "2,256")}
      ${kpi("Invoice", "Paid")}
    </div>
    <div class="grid two">
      <div class="card"><div class="section-head"><h2>Client Live Progress</h2><small>Shareable link</small></div><div class="map"><span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span></div></div>
      <div class="card"><div class="section-head"><h2>Proof Gallery</h2><small>GPS + OCR verified</small></div><div class="grid two"><div class="camera" style="height:130px">Photo 1</div><div class="camera" style="height:130px">Photo 2</div><div class="camera" style="height:130px">Photo 3</div><div class="camera" style="height:130px">Photo 4</div></div><button class="btn" style="width:100%;margin-top:12px">Download Final Report PDF</button></div>
    </div>
  `;
}

function delivery() {
  return `
    <div class="grid kpis">
      ${kpi("Challans", "24")}
      ${kpi("Dispatch Qty", "3,800")}
      ${kpi("In Transit", "9")}
      ${kpi("Delivered", "15")}
      ${kpi("Transport Due", "₹42K")}
      ${kpi("Vendors", "6")}
    </div>
    <div class="card">
      <div class="section-head"><h2>Delivery & Challan Tracker</h2><small>Transport vendor payment ready</small></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Challan</th><th>Order</th><th>Vendor</th><th>Cost</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>CH-1001</td><td>ORD-99848</td><td>VRL</td><td>₹7,500</td><td>${status("Delivered","green")}</td></tr>
          <tr><td>CH-1002</td><td>ORD-99849</td><td>Local Tempo</td><td>₹3,200</td><td>${status("In Transit","orange")}</td></tr>
          <tr><td>CH-1003</td><td>ORD-99850</td><td>Courier</td><td>₹1,400</td><td>${status("Pending","red")}</td></tr>
        </tbody>
      </table></div>
    </div>
  `;
}

function finance() {
  return `
    <div class="grid kpis">
      ${kpi("Order Value", "₹5.49L")}
      ${kpi("Production Cost", "₹2.85L")}
      ${kpi("Execution Cost", "₹96K")}
      ${kpi("Transport", "₹22K")}
      ${kpi("Net Profit", "₹1.46L")}
      ${kpi("Margin", "26.6%")}
    </div>
    <div class="card">
      <div class="section-head"><h2>Campaign Profit Sheet</h2><small>Auto cost calculation</small></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Cost Head</th><th>Qty</th><th>Rate</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Printing</td><td>1000</td><td>₹25</td><td>₹25,000</td><td>${status("Done","green")}</td></tr>
          <tr><td>Stitching</td><td>1000</td><td>₹35</td><td>₹35,000</td><td>${status("Done","green")}</td></tr>
          <tr><td>Fitting</td><td>1000</td><td>₹100</td><td>₹1,00,000</td><td>${status("Running","orange")}</td></tr>
          <tr><td>Material</td><td>1000</td><td>₹160</td><td>₹1,60,000</td><td>${status("Stock","blue")}</td></tr>
        </tbody>
      </table></div>
    </div>
  `;
}

function admin() {
  return `
    <div class="grid kpis">
      ${kpi("Total Users", "48")}
      ${kpi("Active Cities", "8")}
      ${kpi("Monthly Sales", "₹52L")}
      ${kpi("Work Delay", "7")}
      ${kpi("Data Quality", "94%")}
      ${kpi("System Health", "Good")}
    </div>
    <div class="grid two">
      <div class="card">
        <div class="section-head"><h2>Admin Control Center</h2><small>Role-based access</small></div>
        <div class="feed">
          <div class="feed-item">👥 Add / edit users and department permissions</div>
          <div class="feed-item">🔐 Sales can hide amount from operations if needed</div>
          <div class="feed-item">📦 Campaign-level workflow: order → print → stitch → delivery → execution → report → bill</div>
          <div class="feed-item">📊 Export CA-ready GST and expense data</div>
        </div>
      </div>
      <div class="card">
        <div class="section-head"><h2>Next Integrations</h2></div>
        <div class="feed">
          <div class="feed-item">Plate Recognizer OCR API</div>
          <div class="feed-item">Google Maps / LocationIQ geofence</div>
          <div class="feed-item">Wati WhatsApp automation</div>
          <div class="feed-item">Supabase storage for proof photos</div>
        </div>
      </div>
    </div>
  `;
}

render();
