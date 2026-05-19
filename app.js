const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxdXND_xK9HzCr0JUmnQZ8lVHAhZ96ph-lIKem3fwXl9L9DcOB0t5mwdC_r6boiH_8i/exec",
  COMPANY: "Prajapati Advertising",
  UNIVERSAL_PASSWORD: "9922138138",
  ORDERS_KEY: "pmh_orders_v2",
  EXEC_KEY: "pmh_execution_v1"
};

const state = {
  user:null, active:"execution", execTab:"dashboard",
  orders:[], assignments:[], proofs:[], selectedFile:null, selectedPreview:null, gps:null
};

const demoOrders = [
  {id:"ORD-99848",client:"Aakash Institute",city:"Pune",media:"Auto Rickshaw Hood – Fitting",qty:1000,status:"Execution"},
  {id:"ORD-99849",client:"Society Tea",city:"Nagpur",media:"Auto Rickshaw Back Panel",qty:500,status:"Completed"},
  {id:"ORD-99850",client:"Fun Kingdom",city:"Nashik",media:"No Parking Board",qty:300,status:"Printing"}
];

function loadData(){
  try{state.orders=JSON.parse(localStorage.getItem(CONFIG.ORDERS_KEY))||demoOrders}catch(e){state.orders=demoOrders}
  try{const x=JSON.parse(localStorage.getItem(CONFIG.EXEC_KEY))||{};state.assignments=x.assignments||seedAssignments();state.proofs=x.proofs||[]}catch(e){state.assignments=seedAssignments();state.proofs=[]}
  saveData();
}
function saveData(){localStorage.setItem(CONFIG.ORDERS_KEY,JSON.stringify(state.orders));localStorage.setItem(CONFIG.EXEC_KEY,JSON.stringify({assignments:state.assignments,proofs:state.proofs}))}
function seedAssignments(){return[
  {id:"EX-1001",orderId:"ORD-99848",client:"Aakash Institute",city:"Pune",location:"Hadapsar",team:"Ravi Team",target:250,date:"2026-05-20",done:0,status:"Assigned",radius:5},
  {id:"EX-1002",orderId:"ORD-99848",client:"Aakash Institute",city:"Pune",location:"Kothrud",team:"Vivek Team",target:180,date:"2026-05-20",done:0,status:"Assigned",radius:5}
]}

async function api(action,payload={}){try{const r=await fetch(CONFIG.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,payload})});return await r.json()}catch(e){return{ok:false,error:e.message}}}

function renderLogin(){document.getElementById("app").innerHTML=`<div class="login-wrap"><div class="login-box"><div class="logo"><span>MEDIA</span>HUB</div><p>${CONFIG.COMPANY} · Live Execution Engine</p><label>Phone / User</label><input id="phone" value="9922138138"/><label>Password</label><input id="password" type="password" placeholder="Enter password"/><button onclick="login()">Login →</button><div id="err"></div></div></div>`}
function login(){const pass=document.getElementById("password").value.trim();if(pass!==CONFIG.UNIVERSAL_PASSWORD){document.getElementById("err").innerText="Wrong password. Use 9922138138";return}state.user={name:"Shivam Prajapati",role:"admin"};loadData();renderApp()}
function setModule(m){state.active=m;renderApp()}function setExecTab(t){state.execTab=t;renderApp()}
function nav(id,label){return`<button class="${state.active===id?'active':''}" onclick="setModule('${id}')">${label}</button>`}
function title(){return{dashboard:"Dashboard",orders:"Orders",execution:"Live Execution Engine",field:"Field GPS App",client:"Client Report",admin:"Admin"}[state.active]||"Media Hub"}
function renderApp(){document.getElementById("app").innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="side-logo"><span>MEDIA</span>HUB</div><div class="menu">${nav("dashboard","🏢 Dashboard")}${nav("orders","📋 Orders")}${nav("execution","⚙️ Execution")}${nav("field","📱 Field App")}${nav("client","👤 Client Report")}${nav("admin","👑 Admin")}</div></aside><main class="main"><div class="topbar"><div><h1>${title()}</h1><p>GPS + OCR + Anti-Fake Proof System · Demo Local Engine</p></div><button class="btn" onclick="syncExecution()">Sync API</button></div>${renderModule()}</main></div>`}
function renderModule(){return({dashboard:dashboard,orders:orders,execution:execution,field:field,client:client,admin:admin}[state.active]||execution)()}

function money(n){return"₹"+(Number(n)||0).toLocaleString("en-IN")}function badge(t){let c=t==="Completed"?"greenb":t==="Assigned"?"blueb":t==="Delayed"?"redb":t==="Running"?"orangeb":"pinkb";return`<span class="badge ${c}">${t}</span>`}function kpi(l,v){return`<div class="card"><h3>${l}</h3><h1>${v}</h1></div>`}

function dashboard(){const target=state.assignments.reduce((s,a)=>s+a.target,0),done=state.proofs.length,pending=target-done;return`<div class="cards">${kpi("Execution Target",target)}${kpi("Proof Uploaded",done)}${kpi("Pending",pending)}${kpi("Duplicate Blocked",duplicateCount())}</div>${executionTable()}`}
function orders(){return`<div class="cards">${kpi("Orders",state.orders.length)}${kpi("In Execution",state.orders.filter(o=>o.status==="Execution").length)}${kpi("Completed",state.orders.filter(o=>o.status==="Completed").length)}</div><div class="table"><table><thead><tr><th>Order</th><th>Client</th><th>City</th><th>Media</th><th>Qty</th><th>Status</th></tr></thead><tbody>${state.orders.map(o=>`<tr><td>${o.id}</td><td>${o.client}</td><td>${o.city}</td><td>${o.media}</td><td>${o.qty}</td><td>${badge(o.status)}</td></tr>`).join("")}</tbody></table></div>`}

function execution(){return`<div class="tabs"><button class="tab ${state.execTab==='dashboard'?'active':''}" onclick="setExecTab('dashboard')">📊 Dashboard</button><button class="tab ${state.execTab==='assign'?'active':''}" onclick="setExecTab('assign')">➕ Assign Team</button><button class="tab ${state.execTab==='proofs'?'active':''}" onclick="setExecTab('proofs')">📸 Proofs</button><button class="tab ${state.execTab==='map'?'active':''}" onclick="setExecTab('map')">🗺 Map</button></div>${state.execTab==="assign"?assignForm():state.execTab==="proofs"?proofsView():state.execTab==="map"?mapView():executionDashboard()}`}
function executionDashboard(){const target=state.assignments.reduce((s,a)=>s+a.target,0),done=state.proofs.length;return`<div class="cards">${kpi("Target",target)}${kpi("Done",done)}${kpi("Progress",target?Math.round(done/target*100)+"%":"0%")}${kpi("Teams",new Set(state.assignments.map(a=>a.team)).size)}</div>${executionTable()}`}
function executionTable(){return`<div class="table"><table><thead><tr><th>ID</th><th>Order</th><th>Client</th><th>Location</th><th>Team</th><th>Target</th><th>Done</th><th>Progress</th><th>Status</th></tr></thead><tbody>${state.assignments.map(a=>{const done=state.proofs.filter(p=>p.assignmentId===a.id).length,pct=a.target?Math.min(100,Math.round(done/a.target*100)):0;return`<tr><td>${a.id}</td><td>${a.orderId}</td><td>${a.client}</td><td>${a.city} · ${a.location}</td><td>${a.team}</td><td>${a.target}</td><td>${done}</td><td><div class="progress"><div class="bar" style="width:${pct}%"></div></div></td><td>${badge(done>=a.target?"Completed":done>0?"Running":a.status)}</td></tr>`}).join("")}</tbody></table></div>`}
function assignForm(){return`<div class="card"><h2 class="section-title">Assign Execution Team</h2><div class="form-grid"><div><label class="label">Order</label><select id="orderId">${state.orders.map(o=>`<option value="${o.id}">${o.id} · ${o.client}</option>`).join("")}</select></div>${field("city","City","Pune")}${field("location","Location / Area","Hadapsar")}${field("team","Team Lead","Ravi Team")}${field("target","Target Qty","100","number")}${field("date","Date",new Date().toISOString().slice(0,10),"date")}${field("radius","Allowed Radius KM","5","number")}<div class="full">${textarea("notes","Notes","Client team must be available. Live WhatsApp reporting compulsory.")}</div></div><button class="btn" onclick="createAssignment()">Save Assignment</button></div>`}
function field(id,label,value,type="text"){return`<div><label class="label">${label}</label><input class="input" id="${id}" type="${type}" value="${value}"/></div>`}function textarea(id,label,value){return`<label class="label">${label}</label><textarea id="${id}" rows="3">${value}</textarea>`}
function createAssignment(){const order=state.orders.find(o=>o.id===val("orderId"));const a={id:"EX-"+Math.floor(1000+Math.random()*9000),orderId:val("orderId"),client:order?.client||"",city:val("city"),location:val("location"),team:val("team"),target:Number(val("target")),date:val("date"),radius:Number(val("radius")),notes:val("notes"),done:0,status:"Assigned"};state.assignments.unshift(a);saveData();state.execTab="dashboard";renderApp()}function val(id){return document.getElementById(id)?.value||""}

function field(){const opts=state.assignments.map(a=>`<option value="${a.id}">${a.id} · ${a.client} · ${a.location}</option>`).join("");return`<div class="card"><h2 class="section-title">Field GPS Proof Upload</h2><div class="form-grid"><div><label class="label">Assignment</label><select id="assignmentId">${opts}</select></div>${fieldInput("vehicleNo","Vehicle Number / OCR","MH12AB1234")}${fieldInput("driverName","Driver / Owner Name","")}${fieldInput("mobile","Mobile","")}${fieldInput("gps","GPS","Click Get GPS")}</div><div class="actions"><button class="btn blue" onclick="getGPS()">Get GPS</button><button class="btn secondary" onclick="simulateOCR()">Simulate OCR</button></div><br><label class="label">Photo Proof</label><input class="input" type="file" accept="image/*" capture="environment" onchange="handlePhoto(event)"/><div id="preview" class="preview">${state.selectedPreview?`<img src="${state.selectedPreview}"/>`:"📸 Photo preview will appear here"}</div><br><button class="btn" onclick="saveProof()">Save GPS/OCR Proof</button></div>`}
function fieldInput(id,label,value){return`<div><label class="label">${label}</label><input class="input" id="${id}" value="${value}"/></div>`}
function getGPS(){if(!navigator.geolocation){alert("GPS not supported");return}navigator.geolocation.getCurrentPosition(pos=>{state.gps={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy};const el=document.getElementById("gps");if(el)el.value=`${state.gps.lat.toFixed(6)}, ${state.gps.lng.toFixed(6)} · ±${Math.round(state.gps.accuracy)}m`},()=>alert("GPS permission denied"))}
function simulateOCR(){const samples=["MH12AB1234","MH14HM8257","MH20EE4421","MH31CQ9087"];document.getElementById("vehicleNo").value=samples[Math.floor(Math.random()*samples.length)]}
function handlePhoto(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{state.selectedPreview=reader.result;document.getElementById("preview").innerHTML=`<img src="${reader.result}"/>`};reader.readAsDataURL(file)}
function duplicateCount(){const seen=new Set();let d=0;state.proofs.forEach(p=>{if(seen.has(p.vehicleNo))d++;seen.add(p.vehicleNo)});return d}
function saveProof(){const assignmentId=val("assignmentId"),vehicleNo=val("vehicleNo").toUpperCase().replace(/\s/g,"");if(!assignmentId||!vehicleNo){alert("Assignment and vehicle number required");return}const duplicate=state.proofs.some(p=>p.vehicleNo===vehicleNo);const proof={id:"PF-"+Date.now(),assignmentId,vehicleNo,driverName:val("driverName"),mobile:val("mobile"),gps:state.gps||{lat:18.5204,lng:73.8567,accuracy:20},photo:state.selectedPreview||"",time:new Date().toLocaleString("en-IN"),duplicate,verified:!duplicate};state.proofs.unshift(proof);state.selectedPreview=null;saveData();alert(duplicate?"Duplicate vehicle blocked/warning saved":"Proof saved successfully");setModule("execution");state.execTab="proofs";renderApp()}

function proofsView(){return`<div class="cards">${kpi("Total Proofs",state.proofs.length)}${kpi("Verified",state.proofs.filter(p=>p.verified).length)}${kpi("Duplicates",state.proofs.filter(p=>p.duplicate).length)}${kpi("OCR Accuracy","Demo")}</div><div class="photo-grid">${state.proofs.map(p=>`<div class="photo-card">${p.photo?`<img src="${p.photo}"/>`:`<div class="preview" style="height:130px">No Image</div>`}<div><b>${p.vehicleNo}</b><br>${p.time}<br>${p.gps.lat.toFixed(4)}, ${p.gps.lng.toFixed(4)}<br>${p.duplicate?badge("Duplicate"):badge("Verified")}</div></div>`).join("")}</div>`}
function mapView(){return`<div class="map"><span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span></div>${executionTable()}`}

function client(){return`<div class="cards">${kpi("Target",state.assignments.reduce((s,a)=>s+a.target,0))}${kpi("Completed",state.proofs.filter(p=>p.verified).length)}${kpi("Photos",state.proofs.length)}${kpi("Report","Ready")}</div>${proofsView()}<br><button class="btn" onclick="downloadReport()">Download CSV Report</button>`}
function downloadReport(){const rows=[["Proof ID","Assignment","Vehicle No","Time","Lat","Lng","Duplicate","Verified"],...state.proofs.map(p=>[p.id,p.assignmentId,p.vehicleNo,p.time,p.gps.lat,p.gps.lng,p.duplicate,p.verified])];const csv=rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="execution-report.csv";a.click()}
function admin(){return`<div class="cards">${kpi("Assignments",state.assignments.length)}${kpi("Proofs",state.proofs.length)}${kpi("Duplicates",duplicateCount())}${kpi("System","Good")}</div><div class="card"><h2>Next Integrations</h2><p class="small">Plate Recognizer OCR API · Supabase photo storage · Google Maps/LocationIQ geofence · WATI live updates · PDF report engine.</p></div>`}

async function syncExecution(){const res=await api("saveExecutionBatch",{assignments:state.assignments,proofs:state.proofs});alert(res&&res.ok?"Synced with API":"API not ready. Local data saved.")}
renderLogin();
