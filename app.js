const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxdXND_xK9HzCr0JUmnQZ8lVHAhZ96ph-lIKem3fwXl9L9DcOB0t5mwdC_r6boiH_8i/exec",
  COMPANY: "Prajapati Advertising",
  UNIVERSAL_PASSWORD: "9922138138",
  STORAGE_KEY: "prajapati_media_hub_orders_v1"
};

const stages = ["Lead","Quotation","PI","Printing","Stitching","Delivery","Execution","Reporting","Invoice","Payment"];

const state = {
  user: null,
  active: "orders",
  orderTab: "list",
  selectedOrderId: null,
  orders: []
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
    return { ok:false, error:err.message };
  }
}

function seedOrders(){
  return [
    {
      id:"ORD-99848", client:"Aakash Institute", phone:"9876543210", city:"Pune", media:"Auto Rickshaw Hood – Fitting",
      qty:1000, rate:549, baseAmount:549000, gst:98820, total:647820, advance:250000, status:"Execution",
      created:"2026-05-19", due:"2026-05-25", salesBy:"Shamal", priority:"High", locations:"Hadapsar, Kothrud, Swargate",
      notes:"Client wants daily live WhatsApp reporting.", currentStage:6
    },
    {
      id:"ORD-99849", client:"Society Tea", phone:"9822000000", city:"Nagpur", media:"Auto Rickshaw Back Panel",
      qty:500, rate:149, baseAmount:74500, gst:13410, total:87910, advance:87910, status:"Completed",
      created:"2026-05-18", due:"2026-05-21", salesBy:"Rajendra", priority:"Medium", locations:"Sitabuldi, Dharampeth",
      notes:"Report PDF shared.", currentStage:9
    },
    {
      id:"ORD-99850", client:"Fun Kingdom", phone:"9123456789", city:"Nashik", media:"No Parking Board",
      qty:300, rate:250, baseAmount:75000, gst:13500, total:88500, advance:30000, status:"Printing",
      created:"2026-05-19", due:"2026-05-24", salesBy:"Shivam", priority:"High", locations:"College Road, Panchavati",
      notes:"Artwork approved.", currentStage:3
    }
  ];
}

function saveOrders(){ localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.orders)); }
function loadOrders(){
  try{
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    state.orders = raw ? JSON.parse(raw) : seedOrders();
  }catch(e){ state.orders = seedOrders(); }
  saveOrders();
}

function renderLogin(){
  document.getElementById("app").innerHTML = `
    <div class="login-wrap">
      <div class="login-box">
        <div class="logo"><span>MEDIA</span>HUB</div>
        <p>${CONFIG.COMPANY} · Real Orders Module</p>
        <label>Phone / User</label>
        <input id="phone" value="9922138138" />
        <label>Password</label>
        <input id="password" type="password" placeholder="Enter password" />
        <button onclick="login()">Login →</button>
        <div id="err"></div>
      </div>
    </div>`;
}

function login(){
  const phone = document.getElementById("phone").value.trim();
  const pass = document.getElementById("password").value.trim();
  if(pass !== CONFIG.UNIVERSAL_PASSWORD){
    document.getElementById("err").innerText = "Wrong password. Use 9922138138";
    return;
  }
  state.user = {name:"Shivam Prajapati", phone, role:"admin"};
  loadOrders();
  renderApp();
}

function setModule(m){ state.active=m; renderApp(); }
function setOrderTab(t){ state.orderTab=t; renderApp(); }

function nav(id,label){ return `<button class="${state.active===id?'active':''}" onclick="setModule('${id}')">${label}</button>`; }

function renderApp(){
  document.getElementById("app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="side-logo"><span>MEDIA</span>HUB</div>
        <div class="menu">
          ${nav("dashboard","🏢 Dashboard")}
          ${nav("orders","📋 Orders")}
          ${nav("sales","💼 Sales")}
          ${nav("printing","🖨 Printing")}
          ${nav("stitching","🪡 Stitching")}
          ${nav("execution","⚙️ Execution")}
          ${nav("accounts","💳 Accounts")}
          ${nav("client","👤 Client")}
          ${nav("admin","👑 Admin")}
        </div>
      </aside>
      <main class="main">
        <div class="topbar">
          <div>
            <h1>${title()}</h1>
            <p>Welcome, ${state.user.name} · Local Orders Engine Active</p>
          </div>
          <button class="btn" onclick="syncOrders()">Sync API</button>
        </div>
        ${renderModule()}
      </main>
    </div>`;
}

function title(){
  const map={dashboard:"Enterprise Dashboard",orders:"Real Orders Module",sales:"Sales CRM",printing:"Printing",stitching:"Stitching",execution:"Execution",accounts:"Accounts",client:"Client Portal",admin:"Admin"};
  return map[state.active] || "Media Hub";
}

function money(n){ return "₹" + (Number(n)||0).toLocaleString("en-IN"); }
function balance(o){ return (Number(o.total)||0) - (Number(o.advance)||0); }
function badge(text){
  const cls = text==="Completed"||text==="Payment"?"greenb":text==="High"?"redb":text==="Printing"?"blueb":text==="Execution"?"orangeb":"pinkb";
  return `<span class="badge ${cls}">${text}</span>`;
}
function kpi(label,value){ return `<div class="card"><h3>${label}</h3><h1>${value}</h1></div>`; }

function renderModule(){
  const f={dashboard:dashboard,orders:ordersModule,sales:sales,printing:deptModule,stitching:deptModule,execution:deptModule,accounts:accounts,client:client,admin:admin};
  return (f[state.active]||dashboard)();
}

function dashboard(){
  const revenue = state.orders.reduce((s,o)=>s+Number(o.total||0),0);
  const pending = state.orders.filter(o=>o.currentStage<9).length;
  const qty = state.orders.reduce((s,o)=>s+Number(o.qty||0),0);
  const due = state.orders.reduce((s,o)=>s+balance(o),0);
  return `
    <div class="cards">
      ${kpi("Total Revenue", money(revenue))}
      ${kpi("Orders", state.orders.length)}
      ${kpi("Total Qty", qty)}
      ${kpi("Pending Orders", pending)}
      ${kpi("Balance Due", money(due))}
    </div>
    ${ordersTable()}
  `;
}

function ordersModule(){
  return `
    <div class="tabs">
      <button class="tab ${state.orderTab==='list'?'active':''}" onclick="setOrderTab('list')">📋 Order List</button>
      <button class="tab ${state.orderTab==='new'?'active':''}" onclick="setOrderTab('new')">➕ New Order</button>
      <button class="tab ${state.orderTab==='workflow'?'active':''}" onclick="setOrderTab('workflow')">🔁 Workflow</button>
      <button class="tab ${state.orderTab==='payments'?'active':''}" onclick="setOrderTab('payments')">💰 Payments</button>
    </div>
    ${state.orderTab==='new'?newOrderForm():state.orderTab==='workflow'?workflowView():state.orderTab==='payments'?paymentsView():ordersTable()}
  `;
}

function ordersTable(){
  return `
    <div class="table">
      <table>
        <thead><tr><th>Order</th><th>Client</th><th>City</th><th>Media</th><th>Qty</th><th>Total</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${state.orders.map(o=>`
            <tr>
              <td><b>${o.id}</b><br><span class="muted">${o.created}</span></td>
              <td>${o.client}<br><span class="muted">${o.phone}</span></td>
              <td>${o.city}</td>
              <td>${o.media}</td>
              <td>${o.qty}</td>
              <td>${money(o.total)}</td>
              <td>${money(balance(o))}</td>
              <td>${badge(o.status)}</td>
              <td class="actions">
                <button class="btn secondary" onclick="viewOrder('${o.id}')">View</button>
                <button class="btn secondary" onclick="nextStage('${o.id}')">Next</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${state.selectedOrderId ? orderDetail(state.orders.find(o=>o.id===state.selectedOrderId)) : ""}
  `;
}

function newOrderForm(){
  return `
    <div class="card">
      <h2 class="section-title">Create New Order</h2>
      <div class="form-grid">
        ${field("client","Client Name","input","")}
        ${field("phone","Phone","input","")}
        ${field("city","City","input","")}
        ${selectField("media","Media Type",["Auto Rickshaw Hood – Fitting","Auto Rickshaw Hood – Installation","Auto Rickshaw Back Panel","No Parking Board","Wall Wrap","Flex Printing","Vinyl Printing"])}
        ${field("qty","Quantity","number","")}
        ${field("rate","Rate / Pc","number","")}
        ${field("advance","Advance Received","number","0")}
        ${field("salesBy","Sales Person","input","Shivam")}
        ${field("due","Deadline","date","")}
        ${selectField("priority","Priority",["High","Medium","Low"])}
        <div class="full">${field("locations","Locations","textarea","")}</div>
        <div class="full">${field("notes","Notes","textarea","")}</div>
      </div>
      <button class="btn" onclick="createOrder()">Save Order</button>
    </div>`;
}

function field(id,label,type,value){
  if(type==="textarea") return `<label class="label">${label}</label><textarea id="${id}" rows="3" placeholder="${label}">${value}</textarea>`;
  return `<div><label class="label">${label}</label><input class="input" id="${id}" type="${type}" value="${value}" placeholder="${label}" /></div>`;
}
function selectField(id,label,opts){
  return `<div><label class="label">${label}</label><select id="${id}">${opts.map(o=>`<option>${o}</option>`).join("")}</select></div>`;
}

function createOrder(){
  const qty = Number(val("qty")); const rate = Number(val("rate")); const advance = Number(val("advance"));
  if(!val("client") || !qty || !rate){ alert("Client, Quantity and Rate required"); return; }
  const base = qty*rate; const gst = Math.round(base*0.18); const total = base+gst;
  const order = {
    id:"ORD-" + Math.floor(10000 + Math.random()*89999),
    client:val("client"), phone:val("phone"), city:val("city"), media:val("media"),
    qty, rate, baseAmount:base, gst, total, advance, status:"Lead",
    created:new Date().toISOString().slice(0,10), due:val("due"), salesBy:val("salesBy"),
    priority:val("priority"), locations:val("locations"), notes:val("notes"), currentStage:0
  };
  state.orders.unshift(order);
  saveOrders();
  state.orderTab="list";
  state.selectedOrderId=order.id;
  renderApp();
}

function val(id){ return document.getElementById(id)?.value || ""; }

function viewOrder(id){ state.selectedOrderId = state.selectedOrderId===id ? null : id; renderApp(); }

function orderDetail(o){
  if(!o) return "";
  return `
    <div class="card" style="margin-top:18px">
      <h2 class="section-title">${o.id} · ${o.client}</h2>
      <div class="workflow">
        ${stages.map((s,i)=>`<div class="stage ${i<o.currentStage?'done':i===o.currentStage?'current':''}"><b>${s}</b><small>${i<o.currentStage?'Done':i===o.currentStage?'Current':'Pending'}</small></div>`).join("")}
      </div>
      <div class="cards">
        ${kpi("Base",money(o.baseAmount))}
        ${kpi("GST 18%",money(o.gst))}
        ${kpi("Total",money(o.total))}
        ${kpi("Advance",money(o.advance))}
        ${kpi("Balance",money(balance(o)))}
      </div>
      <p class="small"><b>Locations:</b> ${o.locations || "-"}<br><b>Notes:</b> ${o.notes || "-"}</p>
    </div>`;
}

function nextStage(id){
  const o = state.orders.find(x=>x.id===id);
  if(!o) return;
  if(o.currentStage < stages.length-1) o.currentStage++;
  o.status = stages[o.currentStage];
  saveOrders();
  renderApp();
}

function workflowView(){
  return state.orders.map(o=>orderDetail(o)).join("");
}

function paymentsView(){
  const total = state.orders.reduce((s,o)=>s+Number(o.total||0),0);
  const adv = state.orders.reduce((s,o)=>s+Number(o.advance||0),0);
  const due = total-adv;
  return `
    <div class="cards">
      ${kpi("Total Billing",money(total))}
      ${kpi("Received",money(adv))}
      ${kpi("Balance",money(due))}
      ${kpi("Invoices Pending",state.orders.filter(o=>balance(o)>0).length)}
    </div>
    ${ordersTable()}
  `;
}

function sales(){ return `<div class="cards">${kpi("Leads","86")}${kpi("Quotes","19")}${kpi("Won Orders",state.orders.length)}${kpi("Pipeline",money(state.orders.reduce((s,o)=>s+o.total,0)))}</div>${ordersTable()}`; }
function deptModule(){ return `<div class="cards">${kpi("Linked Orders",state.orders.length)}${kpi("Pending",state.orders.filter(o=>o.currentStage<9).length)}${kpi("Qty",state.orders.reduce((s,o)=>s+Number(o.qty||0),0))}${kpi("Live Status","Active")}</div>${ordersTable()}`; }
function accounts(){ return paymentsView(); }
function client(){ return `<div class="cards">${kpi("Campaigns",state.orders.length)}${kpi("Completed",state.orders.filter(o=>o.currentStage>=8).length)}${kpi("Photos","2256")}${kpi("Reports","Ready")}</div>${ordersTable()}`; }
function admin(){ return `<div class="cards">${kpi("Users","48")}${kpi("Orders",state.orders.length)}${kpi("API","Ready")}${kpi("System","Good")}</div><div class="card"><h2>Admin Controls</h2><p class="small">Next: role permission, live Apps Script sync, PDF reports, WhatsApp automation.</p></div>`; }

async function syncOrders(){
  const res = await api("saveOrdersBatch",{orders:state.orders});
  alert(res && res.ok ? "Synced with API" : "API not ready yet. Local data saved.");
}

renderLogin();
