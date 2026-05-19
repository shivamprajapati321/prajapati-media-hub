const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxdXND_xK9HzCr0JUmnQZ8lVHAhZ96ph-lIKem3fwXl9L9DcOB0t5mwdC_r6boiH_8i/exec",
  COMPANY: "Prajapati Advertising",
  UNIVERSAL_PASSWORD: "9922138138"
};

const state = {
  user: null,
  active: "dashboard",
  apiStatus: "not_checked"
};

async function api(action, payload = {}) {
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify({ action, payload })
    });
    return await res.json();
  } catch (err) {
    console.warn("API fallback:", err.message);
    return { ok:false, error:err.message };
  }
}

function renderLogin() {
  document.getElementById("app").innerHTML = `
    <div class="login-wrap">
      <div class="login-box">
        <div class="logo"><span>MEDIA</span>HUB</div>
        <p>${CONFIG.COMPANY} · Enterprise ERP</p>

        <label>Phone / User</label>
        <input id="phone" placeholder="Enter phone number" value="9922138138" />

        <label>Password</label>
        <input id="password" type="password" placeholder="Enter password" />

        <button onclick="login()">Login →</button>
        <div id="err"></div>
      </div>
    </div>
  `;
}

async function login() {
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!phone || !password) {
    showError("Phone and password required");
    return;
  }

  if (password !== CONFIG.UNIVERSAL_PASSWORD) {
    showError("Wrong password. Use 9922138138");
    return;
  }

  state.user = {
    name: "Shivam Prajapati",
    phone,
    role: "admin"
  };

  await loadDashboard();
}

function showError(msg) {
  document.getElementById("err").innerText = msg;
}

async function loadDashboard() {
  document.getElementById("app").innerHTML = `<div class="loading">Loading Media Hub...</div>`;
  const result = await api("dashboard", { user: state.user });
  state.apiStatus = result && result.ok ? "connected" : "demo";
  renderApp();
}

function setModule(module) {
  state.active = module;
  renderApp();
}

function navButton(id, label) {
  return `<button class="${state.active===id?'active':''}" onclick="setModule('${id}')">${label}</button>`;
}

function renderApp() {
  document.getElementById("app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="side-logo"><span>MEDIA</span>HUB</div>
        <div class="menu">
          ${navButton("dashboard","🏢 Dashboard")}
          ${navButton("sales","💼 Sales")}
          ${navButton("printing","🖨 Printing")}
          ${navButton("stitching","🪡 Stitching")}
          ${navButton("execution","⚙️ Execution")}
          ${navButton("field","📱 Field App")}
          ${navButton("client","👤 Client Portal")}
          ${navButton("delivery","🚚 Delivery")}
          ${navButton("accounts","💳 Accounts")}
          ${navButton("admin","👑 Admin")}
        </div>
      </aside>

      <main class="main">
        <div class="topbar">
          <div>
            <h1>${pageTitle()}</h1>
            <p>Welcome, ${state.user.name} · ${state.apiStatus === "connected" ? "Live API Connected" : "Demo Mode"}</p>
          </div>
          <button class="live-btn">${state.apiStatus === "connected" ? "LIVE" : "DEMO"}</button>
        </div>

        ${renderModule()}
      </main>
    </div>
  `;
}

function pageTitle() {
  const names = {
    dashboard:"Enterprise Dashboard",
    sales:"Sales CRM",
    printing:"Printing Department",
    stitching:"Stitching Department",
    execution:"Execution Control",
    field:"Field GPS App",
    client:"Client Portal",
    delivery:"Delivery & Challan",
    accounts:"Accounts & Profit",
    admin:"Admin Control"
  };
  return names[state.active] || "Media Hub";
}

function kpi(title, value, cls="") {
  return `<div class="card"><h3>${title}</h3><h1 class="${cls}">${value}</h1></div>`;
}

function renderModule() {
  const modules = {
    dashboard: renderDashboard,
    sales: renderSales,
    printing: renderPrinting,
    stitching: renderStitching,
    execution: renderExecution,
    field: renderField,
    client: renderClient,
    delivery: renderDelivery,
    accounts: renderAccounts,
    admin: renderAdmin
  };
  return (modules[state.active] || renderDashboard)();
}

function renderDashboard() {
  return `
    <div class="cards">
      ${kpi("Today Revenue","₹4.8L")}
      ${kpi("Running Campaigns","42")}
      ${kpi("Execution Today","752")}
      ${kpi("Pending Work","1240")}
    </div>
    ${campaignTable()}
  `;
}

function campaignTable() {
  return `
    <div class="table">
      <table>
        <thead>
          <tr><th>Campaign</th><th>City</th><th>Status</th><th>Qty</th><th>Progress</th></tr>
        </thead>
        <tbody>
          <tr><td>Aakash Institute</td><td>Pune</td><td><span class="badge orange">Running</span></td><td>1000</td><td>752 Done</td></tr>
          <tr><td>Society Tea</td><td>Nagpur</td><td><span class="badge green">Completed</span></td><td>500</td><td>500 Done</td></tr>
          <tr><td>Fun Kingdom</td><td>Nashik</td><td><span class="badge blue">Printing</span></td><td>300</td><td>120 Done</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderSales() {
  return `
    <div class="cards">
      ${kpi("New Leads","86")}
      ${kpi("Follow-ups","34")}
      ${kpi("Quotations","19")}
      ${kpi("Won Orders","8")}
    </div>
    <h2 class="module-title">Sales Pipeline</h2>
    ${campaignTable()}
  `;
}

function renderPrinting() {
  return `
    <div class="cards">
      ${kpi("Print Jobs","18")}
      ${kpi("Today Output","1200")}
      ${kpi("Ink Stock","72%")}
      ${kpi("Urgent","5")}
    </div>
    ${simpleTable(["Order","Media","Qty","Status"],[
      ["ORD-99848","Hood","300","Printing"],
      ["ORD-99849","Back Panel","500","Queued"],
      ["ORD-99850","Vinyl","120","Done"]
    ])}
  `;
}

function renderStitching() {
  return `
    <div class="cards">
      ${kpi("Today Stitch","732")}
      ${kpi("Pending","420")}
      ${kpi("Masters","7")}
      ${kpi("Payable","₹18,450")}
    </div>
    ${simpleTable(["Master","Regular","OT","Payable"],[
      ["Md Sultan","110","40","₹2,250"],
      ["Md Salman","95","20","₹1,725"],
      ["Sanjay","88","0","₹1,320"]
    ])}
  `;
}

function renderExecution() {
  return `
    <div class="cards">
      ${kpi("Assigned","1240")}
      ${kpi("Completed","752")}
      ${kpi("Pending","488")}
      ${kpi("GPS Proof","2256")}
    </div>
    ${simpleTable(["Team","Target","Done","Status"],[
      ["Ravi Team","250","180","On Track"],
      ["Vivek Team","180","90","Slow"],
      ["External Team","300","0","Not Started"]
    ])}
  `;
}

function renderField() {
  return `
    <div class="cards">
      ${kpi("GPS","ON","green")}
      ${kpi("OCR Plate","MH12AB1234")}
      ${kpi("Duplicate","Passed","green")}
      ${kpi("Upload","Ready")}
    </div>
    <div class="card">
      <h3>Field App Workflow</h3>
      <h1>Camera → GPS → OCR → Upload → Report</h1>
    </div>
  `;
}

function renderClient() {
  return `
    <div class="cards">
      ${kpi("Total Autos","1000")}
      ${kpi("Completed","752")}
      ${kpi("Pending","248")}
      ${kpi("Photos","2256")}
    </div>
    ${campaignTable()}
  `;
}

function renderDelivery() {
  return `
    <div class="cards">
      ${kpi("Challans","24")}
      ${kpi("Dispatch Qty","3800")}
      ${kpi("In Transit","9")}
      ${kpi("Delivered","15")}
    </div>
    ${simpleTable(["Challan","Order","Vendor","Status"],[
      ["CH-1001","ORD-99848","VRL","Delivered"],
      ["CH-1002","ORD-99849","Local Tempo","In Transit"],
      ["CH-1003","ORD-99850","Courier","Pending"]
    ])}
  `;
}

function renderAccounts() {
  return `
    <div class="cards">
      ${kpi("Order Value","₹5.49L")}
      ${kpi("Cost","₹3.03L")}
      ${kpi("Profit","₹1.46L")}
      ${kpi("Margin","26.6%")}
    </div>
    ${simpleTable(["Cost Head","Qty","Rate","Total"],[
      ["Printing","1000","₹25","₹25,000"],
      ["Stitching","1000","₹35","₹35,000"],
      ["Fitting","1000","₹100","₹1,00,000"],
      ["Material","1000","₹160","₹1,60,000"]
    ])}
  `;
}

function renderAdmin() {
  return `
    <div class="cards">
      ${kpi("Users","48")}
      ${kpi("Cities","8")}
      ${kpi("Monthly Sales","₹52L")}
      ${kpi("System","Good")}
    </div>
    <div class="card">
      <h3>Admin Control</h3>
      <h1>Role Permissions · API · Reports · Automation</h1>
    </div>
  `;
}

function simpleTable(headers, rows) {
  return `
    <div class="table">
      <table>
        <thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

renderLogin();
