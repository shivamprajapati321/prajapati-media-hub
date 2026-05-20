const CFG = window.PMH_CONFIG || {UNIVERSAL_PASSWORD:"9922138138",COMPANY:"Prajapati Advertising"};
const STAGES = ["Sales Created","Admin Approved","Design","Client Approval","Sample Approved","Printing","Stitching","Dispatch","Execution","Verification","Invoice","Payment Closed"];
const state = {user:null,role:"admin",page:"admin",file:null,preview:null,gps:null,data:null};

function seed(){
 return {
  leads:[
   {id:"LD-101",source:"Meta",company:"Narayana Education",person:"Amit",contact:"9000000001",city:"Pune",status:"Quotation",owner:"Shamal"},
   {id:"LD-102",source:"IndiaMART",company:"Tea Brand",person:"Rahul",contact:"9000000002",city:"Nagpur",status:"Follow-up",owner:"Rajendra"}
  ],
  orders:[
   {id:"ORD-99848",company:"Aakash Institute",person:"Mr. Sharma",contact:"9876543210",media:"Auto Rickshaw Hood Branding",location:"Pune - Hadapsar, Kothrud",qty:1000,designs:"2 city creatives",gst:"GST",account:"HDFC",payment:250000,total:647820,receipt:"Uploaded",start:"2026-05-20",end:"2026-05-25",status:"Execution",stage:8,approved:true},
   {id:"ORD-99849",company:"Society Tea",person:"Mr. Patil",contact:"9822000000",media:"Auto Rickshaw Back Panel",location:"Nagpur",qty:500,designs:"1 creative",gst:"GST",account:"ICICI",payment:87910,total:87910,receipt:"Uploaded",start:"2026-05-18",end:"2026-05-21",status:"Completed",stage:11,approved:true}
  ],
  designTasks:[
   {id:"DS-1",orderId:"ORD-99848",designer:"Design Team",status:"Client Approved",notes:"2 creative versions uploaded"}
  ],
  printing:[
   {id:"PR-1",orderId:"ORD-99848",operator:"Operator 1",qty:300,date:"2026-05-20",status:"Done"}
  ],
  stitching:[
   {id:"ST-1",orderId:"ORD-99848",master:"Sultan",qty:15,ot:5,type:"Regular + OT",paymentMode:"Monthly + Cash OT",date:"2026-05-20"}
  ],
  dispatch:[
   {id:"DP-1",orderId:"ORD-99848",to:"Ravi Team",bundles:5,perBundle:50,total:250,vendor:"Local Tempo",status:"Dispatched"}
  ],
  execution:[
   {id:"EX-1",orderId:"ORD-99848",team:"Ravi Team",target:250,done:0,type:"Auto Hood - 3 Photos",status:"Running"}
  ],
  proofs:[],
  expenses:[
   {id:"EXP-1",orderId:"ORD-99848",head:"Fitting",amount:18000,by:"Accountant",status:"Approved"}
  ],
  invoices:[]
 }
}
function load(){try{state.data=JSON.parse(localStorage.getItem("pmh_phase6_workflow"))||seed()}catch(e){state.data=seed()}save()}
function save(){localStorage.setItem("pmh_phase6_workflow",JSON.stringify(state.data))}
function login(){let p=document.getElementById("pass").value;if(p!==CFG.UNIVERSAL_PASSWORD){document.getElementById("msg").innerText="Wrong Password";return}load();state.user={name:"Admin",role:"admin"};render()}
function renderLogin(){document.getElementById("app").innerHTML=`<div class="login"><div class="login-box"><div class="logo"><span>MEDIA</span> HUB</div><p>${CFG.COMPANY} Workflow Engine</p><input class="input" id="pass" type="password" placeholder="Password"><button class="btn" onclick="login()">Login</button><div class="err" id="msg"></div></div></div>`}
function nav(id,label){return`<button class="${state.page===id?'active':''}" onclick="go('${id}')">${label}</button>`}
function go(p){state.page=p;render()}
function title(){return {admin:"Admin Command Center",sales:"Sales CRM",orders:"Work Orders",design:"Design Approval",operations:"Operations",printing:"Printing",stitching:"Stitching",dispatch:"Dispatch",execution:"Execution GPS/OCR",accounts:"Accounts",client:"Client Portal",reports:"Reports"}[state.page]||"Media Hub"}
function render(){document.getElementById("app").innerHTML=`<div class="shell"><aside class="sidebar"><div class="side-logo"><span>MEDIA</span> HUB</div><div class="side-sub">Prajapati Advertising ERP</div><div class="nav">${nav("admin","👑 Admin")}${nav("sales","💼 Sales CRM")}${nav("orders","📋 Orders")}${nav("design","🎨 Design")}${nav("operations","🧭 Operations")}${nav("printing","🖨 Printing")}${nav("stitching","🪡 Stitching")}${nav("dispatch","🚚 Dispatch")}${nav("execution","⚙️ Execution")}${nav("accounts","💳 Accounts")}${nav("client","👤 Client")}${nav("reports","📄 Reports")}</div></aside><main class="main"><div class="top"><div><h1>${title()}</h1><p>Sales → Admin Approval → Design → Printing → Stitching → Dispatch → Execution → Verification → Invoice</p></div><button class="btn dark" onclick="exportBackup()">Backup</button></div>${page()}</main></div>`}
function page(){let m={admin,sales,orders,design,operations,printing,stitching,dispatch,execution,accounts,client,reports};return (m[state.page]||admin)()}
function kpi(l,v){return`<div class="card"><h3>${l}</h3><h1>${v}</h1></div>`}
function money(n){return"₹"+Number(n||0).toLocaleString("en-IN")}
function badge(t){let c=t==="Approved"||t==="Done"||t==="Completed"||t==="Client Approved"?"b-green":t==="Pending"?"b-red":t==="Running"||t==="Execution"?"b-orange":"b-blue";return`<span class="badge ${c}">${t}</span>`}
function table(headers,rows){return`<div class="table"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`}

function admin(){
 let d=state.data, revenue=d.orders.reduce((s,o)=>s+o.total,0), pending=d.orders.filter(o=>o.stage<11).length, execTarget=d.execution.reduce((s,e)=>s+e.target,0), execDone=d.proofs.length;
 return `<div class="cards">${kpi("Revenue",money(revenue))}${kpi("Orders",d.orders.length)}${kpi("Pending Work",pending)}${kpi("Execution",execDone+"/"+execTarget)}${kpi("Expenses",money(d.expenses.reduce((s,e)=>s+e.amount,0)))}${kpi("Leads",d.leads.length)}</div>${ordersTable()}`
}
function sales(){
 return `<div class="cards">${kpi("Meta Leads",state.data.leads.filter(l=>l.source==="Meta").length)}${kpi("IndiaMART",state.data.leads.filter(l=>l.source==="IndiaMART").length)}${kpi("JustDial","0")}${kpi("TradeIndia","0")}</div><div class="grid2"><div class="card"><h2>Manual Lead / Order Create</h2><br>${orderForm()}</div><div>${leadsTable()}</div></div>`
}
function leadsTable(){return table(["Source","Company","Person","Contact","City","Status","Owner"],state.data.leads.map(l=>`<tr><td>${l.source}</td><td>${l.company}</td><td>${l.person}</td><td>${l.contact}</td><td>${l.city}</td><td>${badge(l.status)}</td><td>${l.owner}</td></tr>`))}
function orderForm(){return `<div class="form">${inp("company","Company Name")}${inp("person","Person Name")}${inp("contact","Contact")}${sel("media","Media",["Auto Rickshaw Hood Branding","Auto Rickshaw Back Panel","No Parking Board","Vinyls Printing","Flex Printing","Digital Wall Wrap"])}${inp("location","Location / Multiple Cities")}${inp("qty","Quantity","","number")}${inp("designs","Design Details")}${inp("total","Total Amount","","number")}${inp("payment","Part Payment","","number")}${sel("gst","GST / Non GST",["GST","Non GST"])}${sel("account","Payment Account",["HDFC","ICICI","Cash","UPI","Other"])}${inp("start","Work Start Date","","date")}${inp("end","Work End Date","","date")}<div class="full">${area("notes","Full Clarity / Notes")}</div></div><button class="btn" onclick="createOrder()">Create Work Order</button>`}
function inp(id,l,v="",t="text"){return`<div><label class="label">${l}</label><input class="input" id="${id}" type="${t}" value="${v}"></div>`}
function sel(id,l,arr){return`<div><label class="label">${l}</label><select id="${id}">${arr.map(x=>`<option>${x}</option>`).join("")}</select></div>`}
function area(id,l){return`<label class="label">${l}</label><textarea id="${id}" rows="3"></textarea>`}
function val(id){return document.getElementById(id)?.value||""}
function createOrder(){if(!val("company")||!val("qty")){alert("Company and quantity required");return}let o={id:"ORD-"+Math.floor(10000+Math.random()*89999),company:val("company"),person:val("person"),contact:val("contact"),media:val("media"),location:val("location"),qty:+val("qty"),designs:val("designs"),gst:val("gst"),account:val("account"),payment:+val("payment"),total:+val("total"),receipt:"Pending",start:val("start"),end:val("end"),status:"Admin Approval Pending",stage:0,approved:false,notes:val("notes")};state.data.orders.unshift(o);save();go("orders")}
function ordersTable(){return table(["Order","Company","Media","Location","Qty","Payment","Status","Action"],state.data.orders.map(o=>`<tr><td>${o.id}</td><td>${o.company}<br><small>${o.person} · ${o.contact}</small></td><td>${o.media}</td><td>${o.location}</td><td>${o.qty}</td><td>${money(o.payment)} / ${money(o.total)}<br>${o.gst} · ${o.account}</td><td>${badge(o.status)}</td><td class="actions"><button class="btn small dark" onclick="viewWorkflow('${o.id}')">Flow</button><button class="btn small" onclick="approveOrder('${o.id}')">Admin Approve</button></td></tr>`))}
function orders(){return `${ordersTable()}<div id="flow"></div>`}
function approveOrder(id){let o=state.data.orders.find(x=>x.id===id);o.approved=true;o.stage=1;o.status="Admin Approved";save();render()}
function viewWorkflow(id){let o=state.data.orders.find(x=>x.id===id);document.getElementById("flow").innerHTML=workflow(o)}
function workflow(o){return`<div class="card" style="margin-top:15px"><h2>${o.id} · ${o.company}</h2><div class="workflow">${STAGES.map((s,i)=>`<div class="stage ${i<o.stage?'done':i===o.stage?'current':''}"><b>${s}</b></div>`).join("")}</div></div>`}

function design(){return `<div class="cards">${kpi("Design Tasks",state.data.designTasks.length)}${kpi("Client Approved",state.data.designTasks.filter(d=>d.status==="Client Approved").length)}${kpi("Pending","0")}</div>${table(["Task","Order","Designer","Status","Notes"],state.data.designTasks.map(d=>`<tr><td>${d.id}</td><td>${d.orderId}</td><td>${d.designer}</td><td>${badge(d.status)}</td><td>${d.notes}</td></tr>`))}`}
function operations(){return `<div class="cards">${kpi("Approved Orders",state.data.orders.filter(o=>o.approved).length)}${kpi("Printing Pending",state.data.orders.filter(o=>o.stage<5&&o.approved).length)}${kpi("Stitch Pending",state.data.orders.filter(o=>o.stage<6&&o.stage>=5).length)}${kpi("Dispatch Pending",state.data.orders.filter(o=>o.stage<7&&o.stage>=6).length)}</div>${ordersTable()}`}
function printing(){return `<div class="card"><h2>Printing Operator Entry</h2><br><div class="form">${sel("prOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}${inp("operator","Operator Name","Operator 1")}${inp("printQty","Printed Qty","","number")}</div><button class="btn" onclick="addPrint()">Save Printing Entry</button></div>${table(["ID","Order","Operator","Qty","Date","Status"],state.data.printing.map(p=>`<tr><td>${p.id}</td><td>${p.orderId}</td><td>${p.operator}</td><td>${p.qty}</td><td>${p.date}</td><td>${badge(p.status)}</td></tr>`))}`}
function addPrint(){state.data.printing.unshift({id:"PR-"+Date.now(),orderId:val("prOrder").split(" - ")[0],operator:val("operator"),qty:+val("printQty"),date:new Date().toISOString().slice(0,10),status:"Done"});save();render()}
function stitching(){return `<div class="card"><h2>Stitching Manager Evening Entry</h2><br><div class="form">${sel("stOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}${sel("master","Master",["Sultan","Salman","Sanjay","Chandan","Brijesh","Vikas","Shamim","Master 8","Master 9","Master 10"])}${inp("stQty","Quantity","","number")}${inp("ot","OT Qty","0","number")}${sel("payType","Payment Type",["Regular Monthly","Cash OT","Regular + OT"])}</div><button class="btn" onclick="addStitch()">Save Stitching</button></div>${table(["ID","Order","Master","Qty","OT","Type","Date"],state.data.stitching.map(s=>`<tr><td>${s.id}</td><td>${s.orderId}</td><td>${s.master}</td><td>${s.qty}</td><td>${s.ot}</td><td>${s.paymentMode||s.type}</td><td>${s.date}</td></tr>`))}`}
function addStitch(){state.data.stitching.unshift({id:"ST-"+Date.now(),orderId:val("stOrder").split(" - ")[0],master:val("master"),qty:+val("stQty"),ot:+val("ot"),paymentMode:val("payType"),date:new Date().toISOString().slice(0,10)});save();render()}
function dispatch(){return `<div class="card"><h2>Dispatch Entry</h2><br><div class="form">${sel("dpOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}${inp("to","Team / Direct Party","Ravi Team")}${inp("bundles","Total Bundle","","number")}${inp("perBundle","Per Bundle Qty","","number")}${inp("vendor","Transport Vendor","Local Tempo")}</div><button class="btn" onclick="addDispatch()">Generate Dispatch</button></div>${table(["ID","Order","To","Bundles","Per Qty","Total","Vendor","Status"],state.data.dispatch.map(d=>`<tr><td>${d.id}</td><td>${d.orderId}</td><td>${d.to}</td><td>${d.bundles}</td><td>${d.perBundle}</td><td>${d.total}</td><td>${d.vendor}</td><td>${badge(d.status)}</td></tr>`))}`}
function addDispatch(){let total=(+val("bundles"))*(+val("perBundle"));state.data.dispatch.unshift({id:"DP-"+Date.now(),orderId:val("dpOrder").split(" - ")[0],to:val("to"),bundles:+val("bundles"),perBundle:+val("perBundle"),total,vendor:val("vendor"),status:"Dispatched"});save();render()}
function execution(){return `<div class="cards">${kpi("Target",state.data.execution.reduce((s,e)=>s+e.target,0))}${kpi("GPS Photos",state.data.proofs.length)}${kpi("Verified",state.data.proofs.filter(p=>p.verified).length)}${kpi("Pending",state.data.execution.reduce((s,e)=>s+e.target,0)-state.data.proofs.length)}</div><div class="grid2"><div class="card"><h2>Field GPS/OCR Upload</h2><br>${fieldUpload()}</div><div>${executionTable()}</div></div>`}
function fieldUpload(){return `<label class="label">Execution Work</label><select id="exWork">${state.data.execution.map(e=>`<option value="${e.id}">${e.orderId} · ${e.team} · ${e.type}</option>`).join("")}</select>${inp("vehicle","Vehicle No / OCR","MH12AB1234")}${sel("photoType","Photo Type",["Back Photo","Left Photo","Right Photo","Back Panel Photo"])}<button class="btn dark" onclick="getGPS()">Get GPS</button><br><br><input class="input" type="file" accept="image/*" onchange="photo(event)"><div class="preview" id="preview">Photo Preview</div><br><button class="btn" onclick="saveProof()">Save Proof</button>`}
function getGPS(){navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{state.gps={lat:p.coords.latitude,lng:p.coords.longitude};alert("GPS captured")}):alert("GPS not supported")}
function photo(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{state.preview=r.result;document.getElementById("preview").innerHTML=`<img src="${r.result}">`};r.readAsDataURL(f)}
function saveProof(){let vehicle=val("vehicle").toUpperCase().replace(/\\s/g,""),dup=state.data.proofs.some(p=>p.vehicle===vehicle&&p.photoType===val("photoType"));state.data.proofs.unshift({id:"PF-"+Date.now(),workId:val("exWork"),vehicle,photoType:val("photoType"),gps:state.gps||{lat:18.5204,lng:73.8567},img:state.preview||"",verified:!dup,duplicate:dup,time:new Date().toLocaleString("en-IN")});save();render()}
function executionTable(){return table(["Work","Order","Team","Target","Done","Type","Status"],state.data.execution.map(e=>`<tr><td>${e.id}</td><td>${e.orderId}</td><td>${e.team}</td><td>${e.target}</td><td>${state.data.proofs.filter(p=>p.workId===e.id).length}</td><td>${e.type}</td><td>${badge(e.status)}</td></tr>`))}
function accounts(){return `<div class="cards">${kpi("Expenses",money(state.data.expenses.reduce((s,e)=>s+e.amount,0)))}${kpi("Billing",money(state.data.orders.reduce((s,o)=>s+o.total,0)))}${kpi("Received",money(state.data.orders.reduce((s,o)=>s+o.payment,0)))}${kpi("Balance",money(state.data.orders.reduce((s,o)=>s+(o.total-o.payment),0)))}</div><div class="card"><h2>Expense Entry</h2><br><div class="form">${sel("expOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}${inp("head","Expense Head","Fitting")}${inp("amount","Amount","","number")}</div><button class="btn" onclick="addExpense()">Save Expense</button></div>${table(["ID","Order","Head","Amount","By","Status"],state.data.expenses.map(e=>`<tr><td>${e.id}</td><td>${e.orderId}</td><td>${e.head}</td><td>${money(e.amount)}</td><td>${e.by}</td><td>${badge(e.status)}</td></tr>`))}`}
function addExpense(){state.data.expenses.unshift({id:"EXP-"+Date.now(),orderId:val("expOrder").split(" - ")[0],head:val("head"),amount:+val("amount"),by:"Accountant",status:"Pending"});save();render()}
function client(){return `<div class="cards">${kpi("Photos",state.data.proofs.length)}${kpi("Verified",state.data.proofs.filter(p=>p.verified).length)}${kpi("Reports","Ready")}</div><div class="photo-grid">${state.data.proofs.map(p=>`<div class="photo">${p.img?`<img src="${p.img}">`:""}<div><b>${p.vehicle}</b><br>${p.photoType}<br>${p.time}<br>${p.verified?badge("Verified"):badge("Duplicate")}</div></div>`).join("")}</div>`}
function reports(){return `<div class="card"><h2>Reports</h2><p>Work wise, Team wise, Date wise, Dispatch wise, Execution photos, OCR list, Invoice-ready reports.</p><br><button class="btn" onclick="downloadCSV()">Download Execution CSV</button></div>`}
function downloadCSV(){let rows=[["Vehicle","Photo Type","GPS","Time","Verified"],...state.data.proofs.map(p=>[p.vehicle,p.photoType,`${p.gps.lat},${p.gps.lng}`,p.time,p.verified])];let csv=rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(",")).join("\\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv]));a.download="execution-report.csv";a.click()}
function exportBackup(){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state.data,null,2)]));a.download="mediahub-backup.json";a.click()}
renderLogin();
