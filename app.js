const CFG = window.PMH_CONFIG || {UNIVERSAL_PASSWORD:"9922138138",COMPANY:"Prajapati Advertising"};
const FLOW = [
  "Sales Created",
  "Admin Verified",
  "Design Task",
  "Client Approval",
  "Sample Approved",
  "Printing",
  "Stitching",
  "Dispatch",
  "Execution",
  "Manual Verification",
  "Invoice",
  "Payment Closed"
];

const state = {
  page:"dashboard",
  data:null,
  selectedOrder:null,
  file:null,
  preview:null,
  gps:null
};

function seed(){
  return {
    orders:[
      {
        id:"ORD-63974", company:"Renkeshire", person:"Mr. Rakesh", contact:"9000000001",
        source:"Manual", media:"Auto Rickshaw Hood Branding", location:"Pune - Hadapsar",
        qty:100, designs:"1 design", gst:"GST", account:"HDFC", amount:48000, advance:20000,
        balance:28000, receipt:"Pending", start:"2026-05-20", end:"2026-05-25",
        status:"Dispatch Ready", sales:"Shivam Prajapati", stage:7, approved:true,
        notes:"Urgent work. Client needs report after execution."
      },
      {
        id:"ORD-68151", company:"Apar", person:"Purchase Manager", contact:"9000000002",
        source:"IndiaMART", media:"Auto Rickshaw Hood Branding", location:"Mumbai, Pune, Nashik",
        qty:11450, designs:"Multiple city designs", gst:"GST", account:"ICICI", amount:4866250,
        advance:3000000, balance:1866250, receipt:"Uploaded", start:"2026-05-21", end:"2026-04-30",
        status:"New", sales:"Shivam Prajapati", stage:1, approved:true,
        notes:"Multi city campaign. Admin verified."
      }
    ],
    leads:[
      {id:"LD-101",source:"Meta",company:"Narayana Education",person:"Amit",contact:"9000000101",city:"Pune",status:"Quotation",owner:"Shamal"},
      {id:"LD-102",source:"JustDial",company:"Dental Clinic",person:"Dr. Shah",contact:"9000000102",city:"Nashik",status:"Follow-up",owner:"Rajendra"},
      {id:"LD-103",source:"TradeIndia",company:"Tea Brand",person:"Rahul",contact:"9000000103",city:"Nagpur",status:"New",owner:"Shivam"}
    ],
    design:[
      {id:"DS-1",order:"ORD-68151",designer:"Designer 1",required:"Yes",status:"Client Approval Pending",notes:"Multiple city creatives required"},
      {id:"DS-2",order:"ORD-63974",designer:"Designer 2",required:"No",status:"Sample Approved",notes:"Client shared final design"}
    ],
    printing:[
      {id:"PR-1",order:"ORD-68151",operator:"Operator 1",qty:700,date:"2026-05-20",status:"Done"},
      {id:"PR-2",order:"ORD-63974",operator:"Operator 2",qty:100,date:"2026-05-20",status:"Done"}
    ],
    stitching:[
      {id:"ST-1",order:"ORD-68151",client:"Apar",master:"Md Sultan",qty:30,ot:5,type:"Regular + OT",date:"Wed Apr 01",status:"Pending"},
      {id:"ST-2",order:"ORD-68151",client:"Apar",master:"Md Salman",qty:30,ot:0,type:"Regular",date:"Wed Apr 01",status:"Pending"},
      {id:"ST-3",order:"ORD-63974",client:"Renkeshire",master:"Sanjay Prajapati",qty:28,ot:2,type:"Regular + OT",date:"Wed Apr 01",status:"Done"}
    ],
    dispatch:[
      {id:"DP-1",order:"ORD-63974",to:"Ravi Team",type:"Team",bundles:2,per:50,total:100,vendor:"Local Tempo",status:"Dispatch Ready"},
      {id:"DP-2",order:"ORD-68151",to:"Direct Party",type:"Party",bundles:20,per:50,total:1000,vendor:"VRL",status:"Pending"}
    ],
    execution:[
      {id:"EX-1",order:"ORD-63974",team:"Ravi Team",target:100,done:64,photoRule:"Auto Hood - Back, Left, Right",ocr:"Pending",status:"Running"},
      {id:"EX-2",order:"ORD-68151",team:"Vivek Team",target:400,done:0,photoRule:"Auto Hood - 3 GPS Photos",ocr:"Pending",status:"Assigned"}
    ],
    proofs:[],
    expenses:[
      {id:"EXP-1",order:"ORD-63974",head:"Fitting",amount:8000,by:"Accountant",status:"Pending Approval"},
      {id:"EXP-2",order:"ORD-68151",head:"Transport",amount:3200,by:"Accountant",status:"Approved"}
    ],
    invoices:[],
    users:[
      {name:"Admin",role:"Admin",access:"Full Control",status:"Active"},
      {name:"Sales Team",role:"Sales",access:"CRM + Orders",status:"Active"},
      {name:"Operation Manager",role:"Operations",access:"Assign production",status:"Active"},
      {name:"Execution Manager",role:"Execution",access:"GPS/OCR proof",status:"Active"}
    ],
    ink:{
      Cyan:{remain:55000,used:0,total:55000,color:"#00d4ff"},
      Magenta:{remain:40000,used:0,total:40000,color:"#ff2f92"},
      Yellow:{remain:44000,used:0,total:44000,color:"#ffc400"},
      Black:{remain:10000,used:0,total:10000,color:"#777"}
    }
  }
}

function load(){
  try{ state.data = JSON.parse(localStorage.getItem("pmh_admin_order_engine_final")) || seed(); }
  catch(e){ state.data = seed(); }
  save();
}
function save(){ localStorage.setItem("pmh_admin_order_engine_final", JSON.stringify(state.data)); }

function login(){
  const p = document.getElementById("pass").value;
  if(p !== CFG.UNIVERSAL_PASSWORD){
    document.getElementById("msg").innerText = "Wrong Password";
    return;
  }
  load();
  render();
}

function renderLogin(){
  document.getElementById("app").innerHTML = `
    <div class="login">
      <div class="login-box">
        <div class="logo"><span>MEDIA</span>HUB</div>
        <p>Admin Order Engine</p>
        <input class="input" id="pass" type="password" placeholder="Password">
        <button class="btn" onclick="login()">Login</button>
        <div class="err" id="msg"></div>
      </div>
    </div>
  `;
}

function nav(id,label){
  return `<button class="${state.page===id?'active':''}" onclick="go('${id}')">${label}</button>`;
}
function go(p){ state.page = p; render(); }

function title(){
  return {
    dashboard:"Admin Live Dashboard",
    orderCreate:"Real Order Create",
    orders:"Work Orders",
    approvals:"Admin Approval Engine",
    sales:"Sales CRM",
    design:"Design Approval",
    operations:"Operations Control",
    printing:"Printing Entry",
    stitching:"Stitching Entry",
    dispatch:"Dispatch Management",
    execution:"Execution GPS/OCR",
    accounts:"Accounts & Expenses",
    client:"Client Portal",
    reports:"Reports Center",
    users:"Users & Access",
    ink:"Ink Stock"
  }[state.page] || "Media Hub";
}

function render(){
  document.getElementById("app").innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="logo-small"><span>MEDIA</span>HUB</div>
          <div class="role">👑 Admin</div>
        </div>
        <div class="nav">
          ${nav("dashboard","📊 Dashboard")}
          ${nav("orderCreate","➕ Real Order Create")}
          ${nav("orders","📋 Work Orders")}
          ${nav("approvals","✅ Admin Approvals")}
          ${nav("sales","💼 Sales CRM")}
          ${nav("design","🎨 Design")}
          ${nav("operations","🧭 Operations")}
          ${nav("printing","🖨 Printing")}
          ${nav("stitching","🪡 Stitching")}
          ${nav("dispatch","🚚 Dispatch")}
          ${nav("execution","⚙️ Execution")}
          ${nav("accounts","💳 Accounts")}
          ${nav("client","👤 Client Portal")}
          ${nav("reports","📄 Reports")}
          ${nav("users","👥 Users")}
          ${nav("ink","💧 Ink Stock")}
        </div>
      </aside>
      <main class="main">
        <div class="top">
          <div>
            <h1>${title()}</h1>
            <p>Sales → Admin Approval → Design → Printing → Stitching → Dispatch → Execution → Invoice</p>
          </div>
          <div class="actions">
            <button class="btn dark" onclick="backup()">Backup</button>
            <button class="btn" onclick="alert('Cloud sync placeholder ready')">Sync</button>
          </div>
        </div>
        ${page()}
      </main>
    </div>
  `;
}

function page(){
  const m = {dashboard,orderCreate,orders,approvals,sales,design,operations,printing,stitching,dispatch,execution,accounts,client,reports,users,ink};
  return (m[state.page] || dashboard)();
}

function money(n){ return "₹" + Number(n||0).toLocaleString("en-IN"); }
function kpi(l,v,c=""){ return `<div class="card ${c}"><h3>${l}</h3><h1>${v}</h1></div>`; }
function badge(t){
  let c = t==="Approved"||t==="Done"||t==="Completed"||t==="Sample Approved"||t==="Active" ? "b-green" :
          t==="Pending"||t.includes("Pending") ? "b-red" :
          t==="Running"||t==="Execution"||t==="In Production" ? "b-orange" :
          t.includes("Ready")||t==="Assigned" ? "b-blue" : "b-pink";
  return `<span class="badge ${c}">${t}</span>`;
}
function table(h,r){
  return `<div class="table"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${r.join("")}</tbody></table></div>`;
}
function section(t,s,body){
  return `<div class="section"><div class="section-head"><h2>${t}</h2><small>${s}</small></div>${body}</div>`;
}
function val(id){ return document.getElementById(id)?.value || ""; }

function dashboard(){
  let d=state.data;
  let total=d.orders.reduce((s,o)=>s+Number(o.amount||0),0);
  let advance=d.orders.reduce((s,o)=>s+Number(o.advance||0),0);
  let balance=d.orders.reduce((s,o)=>s+Number(o.balance||0),0);
  let expenses=d.expenses.reduce((s,e)=>s+Number(e.amount||0),0);
  let target=d.execution.reduce((s,e)=>s+Number(e.target||0),0);
  let done=d.execution.reduce((s,e)=>s+Number(e.done||0),0);
  return `
    <div class="cards">
      ${kpi("Total Orders",d.orders.length,"orange")}
      ${kpi("Total Sales",money(total),"green")}
      ${kpi("Advance",money(advance),"blue")}
      ${kpi("Outstanding",money(balance),"red")}
      ${kpi("Expenses",money(expenses),"orange")}
      ${kpi("Execution",done+"/"+target,"cyan")}
    </div>
    <div class="section">
      <div class="section-head"><h2>⚡ Quick Actions</h2><small>Admin shortcuts</small></div>
      <div class="quick">
        <button onclick="go('orderCreate')">➕ New Order</button>
        <button onclick="go('approvals')">✅ Approvals</button>
        <button onclick="go('printing')">🖨 Print Jobs</button>
        <button onclick="go('stitching')">🪡 Stitching</button>
        <button onclick="go('dispatch')">🚚 Dispatch</button>
        <button onclick="go('execution')">⚙️ Execution</button>
        <button onclick="go('accounts')">💳 Expenses</button>
        <button onclick="go('reports')">📄 Reports</button>
      </div>
    </div>
    ${orders()}
    ${sales()}
  `;
}

function orderCreate(){
  return `
    <div class="card">
      <h2>Real Order Create</h2><br>
      <div class="form">
        ${input("company","Company Name")}
        ${input("person","Person Name")}
        ${input("contact","Contact Number")}
        ${select("source","Lead Source",["Manual","Meta","IndiaMART","JustDial","TradeIndia","Referral"])}
        ${select("media","Media",["Auto Rickshaw Hood Branding","Auto Rickshaw Back Panel","No Parking Board","Vinyls Printing","Flex Printing","Digital Wall Wrap"])}
        ${input("location","Location / Multiple Cities")}
        ${input("qty","Quantity","","number")}
        ${input("designs","Design Details / Multiple Designs")}
        ${input("amount","Total Amount","","number")}
        ${input("advance","Part Payment Received","0","number")}
        ${select("gst","GST / Non GST",["GST","Non GST"])}
        ${select("account","Payment Account",["HDFC","ICICI","UPI","Cash","Other"])}
        ${select("receipt","Receipt Upload Status",["Pending","Uploaded"])}
        ${input("start","Work Start Date","","date")}
        ${input("end","Work End Date","","date")}
        <div class="full">${area("notes","Full Clarity / Notes")}</div>
      </div>
      <button class="btn" onclick="createOrder()">Create Order & Send To Admin Approval</button>
    </div>
  `;
}
function input(id,l,v="",t="text"){ return `<div><label class="label">${l}</label><input class="input" id="${id}" type="${t}" value="${v}" placeholder="${l}"></div>`; }
function select(id,l,arr){ return `<div><label class="label">${l}</label><select id="${id}">${arr.map(x=>`<option>${x}</option>`).join("")}</select></div>`; }
function area(id,l){ return `<label class="label">${l}</label><textarea id="${id}" rows="3" placeholder="${l}"></textarea>`; }

function createOrder(){
  if(!val("company") || !val("qty") || !val("amount")){
    alert("Company, Quantity and Amount required");
    return;
  }
  const amount = Number(val("amount"));
  const advance = Number(val("advance"));
  const o = {
    id:"ORD-"+Math.floor(10000+Math.random()*89999),
    company:val("company"),
    person:val("person"),
    contact:val("contact"),
    source:val("source"),
    media:val("media"),
    location:val("location"),
    qty:Number(val("qty")),
    designs:val("designs"),
    gst:val("gst"),
    account:val("account"),
    amount,
    advance,
    balance:amount-advance,
    receipt:val("receipt"),
    start:val("start"),
    end:val("end"),
    status:"Admin Approval Pending",
    sales:"Admin",
    stage:0,
    approved:false,
    notes:val("notes")
  };
  state.data.orders.unshift(o);
  state.data.design.unshift({id:"DS-"+Date.now(),order:o.id,designer:"Unassigned",required:o.designs?"Yes":"No",status:"Pending Admin Review",notes:o.designs});
  save();
  state.selectedOrder=o.id;
  go("approvals");
}

function orders(){
  return section("Work Orders","Work progress, payment, GST, location, media",
    table(["Order","Client","Media","Location","Qty","Payment","GST/Account","Status","Actions"],
      state.data.orders.map(o=>`
        <tr>
          <td><b style="color:var(--blue)">${o.id}</b><br><small>${o.source||"Manual"}</small></td>
          <td>${o.company}<br><small>${o.person} · ${o.contact}</small></td>
          <td>${o.media}</td>
          <td>${o.location}</td>
          <td>${o.qty}</td>
          <td>${money(o.advance)} / ${money(o.amount)}<br><small>Bal: ${money(o.balance)}</small></td>
          <td>${o.gst}<br>${o.account}<br>${o.receipt}</td>
          <td>${badge(o.status)}</td>
          <td class="actions">
            <button class="btn small dark" onclick="showFlow('${o.id}')">Flow</button>
            <button class="btn small" onclick="approveOrder('${o.id}')">Approve</button>
            <button class="btn small blue" onclick="makeInvoice('${o.id}')">Invoice</button>
          </td>
        </tr>
      `)
    ) + `<div id="flowBox"></div>`
  );
}

function showFlow(id){
  const o=state.data.orders.find(x=>x.id===id);
  document.getElementById("flowBox").innerHTML = `
    <div class="card" style="margin-top:15px">
      <h2>${o.id} · ${o.company}</h2>
      <div class="workflow">
        ${FLOW.map((f,i)=>`<div class="stage ${i<o.stage?'done':i===o.stage?'current':''}"><b>${f}</b><small>${i<o.stage?'Done':i===o.stage?'Current':'Pending'}</small></div>`).join("")}
      </div>
    </div>
  `;
}

function approveOrder(id){
  const o=state.data.orders.find(x=>x.id===id);
  o.approved=true;o.stage=1;o.status="Admin Approved";
  save();render();
}

function approvals(){
  return section("Admin Approval Queue","Admin verifies order, design, expense, invoice",
    table(["Type","Reference","Details","Status","Action"],
      [
        ...state.data.orders.filter(o=>!o.approved).map(o=>`<tr><td>Work Order</td><td>${o.id}</td><td>${o.company} · ${o.media} · ${o.qty}</td><td>${badge(o.status)}</td><td><button class="btn small" onclick="approveOrder('${o.id}')">Approve</button></td></tr>`),
        ...state.data.design.filter(d=>d.status.includes("Pending")).map(d=>`<tr><td>Design</td><td>${d.order}</td><td>${d.notes||"-"}</td><td>${badge(d.status)}</td><td><button class="btn small" onclick="approveDesign('${d.id}')">Approve Design</button></td></tr>`),
        ...state.data.expenses.filter(e=>e.status.includes("Pending")).map(e=>`<tr><td>Expense</td><td>${e.order}</td><td>${e.head} · ${money(e.amount)}</td><td>${badge(e.status)}</td><td><button class="btn small" onclick="approveExpense('${e.id}')">Approve Expense</button></td></tr>`)
      ]
    )
  );
}
function approveDesign(id){const d=state.data.design.find(x=>x.id===id);d.status="Sample Approved";const o=state.data.orders.find(x=>x.id===d.order);if(o){o.stage=Math.max(o.stage,4);o.status="Sample Approved"}save();render();}
function approveExpense(id){const e=state.data.expenses.find(x=>x.id===id);e.status="Approved";save();render();}

function sales(){
  return section("Sales CRM","Lead sources: Meta, IndiaMART, JustDial, TradeIndia, Manual",
    table(["Source","Company","Person","Contact","City","Status","Owner"],
      state.data.leads.map(l=>`<tr><td>${l.source}</td><td>${l.company}</td><td>${l.person}</td><td>${l.contact}</td><td>${l.city}</td><td>${badge(l.status)}</td><td>${l.owner}</td></tr>`)
    )
  );
}
function design(){
  return section("Design Approval","Designer upload → client approval → admin sample approval",
    table(["Task","Order","Designer","Required","Status","Notes","Action"],
      state.data.design.map(d=>`<tr><td>${d.id}</td><td>${d.order}</td><td>${d.designer}</td><td>${d.required}</td><td>${badge(d.status)}</td><td>${d.notes}</td><td><button class="btn small" onclick="approveDesign('${d.id}')">Sample Approve</button></td></tr>`)
    )
  );
}
function operations(){
  return `<div class="cards">
    ${kpi("Approved Orders",state.data.orders.filter(o=>o.approved).length,"green")}
    ${kpi("Design Pending",state.data.design.filter(d=>d.status.includes("Pending")).length,"red")}
    ${kpi("Printing Jobs",state.data.printing.length,"blue")}
    ${kpi("Dispatch Pending",state.data.dispatch.filter(d=>d.status.includes("Pending")).length,"orange")}
  </div>${orders()}`;
}
function printing(){
  return `<div class="card"><h2>Printing Operator Entry</h2><br><div class="form">
    ${select("prOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}
    ${select("operator","Operator",["Operator 1","Operator 2","Operator 3"])}
    ${input("prQty","Printed Quantity","","number")}
  </div><button class="btn" onclick="addPrint()">Save Printing Entry</button></div>`+
  section("Print Jobs","Operator-wise printing entry",table(["ID","Order","Operator","Qty","Date","Status"],
    state.data.printing.map(p=>`<tr><td>${p.id}</td><td>${p.order}</td><td>${p.operator}</td><td>${p.qty}</td><td>${p.date}</td><td>${badge(p.status)}</td></tr>`)
  ));
}
function addPrint(){state.data.printing.unshift({id:"PR-"+Date.now(),order:val("prOrder").split(" - ")[0],operator:val("operator"),qty:Number(val("prQty")),date:new Date().toISOString().slice(0,10),status:"Done"});save();render();}
function stitching(){
  return `<div class="card"><h2>Stitching Manager Entry</h2><br><div class="form">
    ${select("stOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}
    ${select("master","Master",["Md Sultan","Md Salman","Sanjay Prajapati","Chandan Kumar","Brijesh Gautam","Vikas Gautam","Md Shamim","Master 8","Master 9","Master 10"])}
    ${input("stQty","Regular Quantity","","number")}
    ${input("otQty","OT Quantity","0","number")}
    ${select("payType","Payment Type",["Regular Monthly","Cash OT","Regular + OT"])}
  </div><button class="btn" onclick="addStitch()">Save Stitching Entry</button></div>`+
  section("Stitching Live Status","Master-wise quantity, OT and payment mode",table(["ID","Order","Master","Qty","OT","Type","Date","Status"],
    state.data.stitching.map(s=>`<tr><td>${s.id}</td><td>${s.order}</td><td>${s.master}</td><td>${s.qty}</td><td>${s.ot}</td><td>${s.type}</td><td>${s.date}</td><td>${badge(s.status)}</td></tr>`)
  ));
}
function addStitch(){state.data.stitching.unshift({id:"ST-"+Date.now(),order:val("stOrder").split(" - ")[0],master:val("master"),qty:Number(val("stQty")),ot:Number(val("otQty")),type:val("payType"),date:new Date().toISOString().slice(0,10),status:"Pending"});save();render();}
function dispatch(){
  return `<div class="card"><h2>Dispatch Entry</h2><br><div class="form">
    ${select("dpOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}
    ${select("dpType","Dispatch To",["Team","Direct Party"])}
    ${input("to","Team / Party Name","Ravi Team")}
    ${input("bundles","Total Bundle","","number")}
    ${input("perBundle","Per Bundle Quantity","","number")}
    ${input("vendor","Transportation Vendor","Local Tempo")}
  </div><button class="btn" onclick="addDispatch()">Generate Dispatch</button></div>`+
  section("Dispatch Management","Team-wise, party-wise, vendor-wise dispatch",table(["ID","Order","To","Type","Bundle","Per Qty","Total","Vendor","Status"],
    state.data.dispatch.map(d=>`<tr><td>${d.id}</td><td>${d.order}</td><td>${d.to}</td><td>${d.type}</td><td>${d.bundles}</td><td>${d.per}</td><td>${d.total}</td><td>${d.vendor}</td><td>${badge(d.status)}</td></tr>`)
  ));
}
function addDispatch(){const total=Number(val("bundles"))*Number(val("perBundle"));state.data.dispatch.unshift({id:"DP-"+Date.now(),order:val("dpOrder").split(" - ")[0],to:val("to"),type:val("dpType"),bundles:Number(val("bundles")),per:Number(val("perBundle")),total,vendor:val("vendor"),status:"Dispatched"});save();render();}
function execution(){
  return `<div class="grid2"><div class="card"><h2>Execution GPS/OCR Proof</h2><br>
    ${select("exWork","Execution Work",state.data.execution.map(e=>e.id+" - "+e.order+" - "+e.team))}
    ${input("vehicle","Vehicle No / OCR","MH12AB1234")}
    ${select("photoType","Photo Type",["Back Photo","Left Photo","Right Photo","Back Panel Photo"])}
    <div class="actions"><button class="btn dark" onclick="getGPS()">Get GPS</button><button class="btn blue" onclick="simulateOCR()">Simulate OCR</button></div><br>
    <input class="input" type="file" accept="image/*" onchange="photo(event)">
    <div id="preview" class="preview">Photo Preview</div><br>
    <button class="btn" onclick="saveProof()">Save Proof</button>
  </div><div>${executionTable()}</div></div>`+
  client();
}
function executionTable(){
  return section("Execution Progress","Auto hood 3 photos, back panel 1 photo, OCR + manual verification",
    table(["Work","Order","Team","Target","Done","Photo Rule","OCR","Status"],
      state.data.execution.map(e=>`<tr><td>${e.id}</td><td>${e.order}</td><td>${e.team}</td><td>${e.target}</td><td>${state.data.proofs.filter(p=>p.workId===e.id).length}</td><td>${e.photoRule}</td><td>${badge(e.ocr)}</td><td>${badge(e.status)}</td></tr>`)
    )
  );
}
function getGPS(){navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{state.gps={lat:p.coords.latitude,lng:p.coords.longitude};alert("GPS captured")}):alert("GPS not supported");}
function simulateOCR(){const samples=["MH12AB1234","MH14HM8257","MH20EE4421","MH31CQ9087"];document.getElementById("vehicle").value=samples[Math.floor(Math.random()*samples.length)];}
function photo(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{state.preview=r.result;document.getElementById("preview").innerHTML=`<img src="${r.result}">`};r.readAsDataURL(f);}
function saveProof(){
  const vehicle=val("vehicle").toUpperCase().replace(/\s/g,"");
  const duplicate=state.data.proofs.some(p=>p.vehicle===vehicle&&p.photoType===val("photoType"));
  state.data.proofs.unshift({id:"PF-"+Date.now(),workId:val("exWork").split(" - ")[0],vehicle,photoType:val("photoType"),gps:state.gps||{lat:18.5204,lng:73.8567},img:state.preview||"",verified:!duplicate,duplicate,time:new Date().toLocaleString("en-IN")});
  save();render();
}
function accounts(){
  return `<div class="card"><h2>Accountant Expense Entry</h2><br><div class="form">
    ${select("expOrder","Work Order",state.data.orders.map(o=>o.id+" - "+o.company))}
    ${input("head","Expense Head","Fitting")}
    ${input("amount","Amount","","number")}
  </div><button class="btn" onclick="addExpense()">Create Expense</button></div>`+
  section("Expense & Invoice Approvals","Work-wise expenses, invoice after completion",
    table(["ID","Order","Head","Amount","By","Status"],
      state.data.expenses.map(e=>`<tr><td>${e.id}</td><td>${e.order}</td><td>${e.head}</td><td>${money(e.amount)}</td><td>${e.by}</td><td>${badge(e.status)}</td></tr>`)
    )
  );
}
function addExpense(){state.data.expenses.unshift({id:"EXP-"+Date.now(),order:val("expOrder").split(" - ")[0],head:val("head"),amount:Number(val("amount")),by:"Accountant",status:"Pending Approval"});save();render();}
function makeInvoice(id){const o=state.data.orders.find(x=>x.id===id);state.data.invoices.unshift({id:"INV-"+Date.now(),order:o.id,client:o.company,total:o.amount,status:"Generated"});o.stage=Math.max(o.stage,10);o.status="Invoice Generated";save();render();}
function client(){
  return section("Client Live Portal","Live photos, OCR, GPS, PDF/CSV download",
    `<div class="photo-grid">${state.data.proofs.map(p=>`<div class="photo">${p.img?`<img src="${p.img}">`:""}<div><b>${p.vehicle}</b><br>${p.photoType}<br>${p.time}<br>${p.verified?badge("Verified"):badge("Duplicate")}</div></div>`).join("")}</div>`
  );
}
function reports(){
  return `<div class="cards">
    ${kpi("Order Reports","Ready","blue")}
    ${kpi("Dispatch Excel","Ready","green")}
    ${kpi("Execution PDF","Ready","orange")}
    ${kpi("Photos Download","Ready","cyan")}
    ${kpi("Invoice Queue",state.data.invoices.length,"red")}
  </div>
  <div class="section"><div class="section-head"><h2>Reports Center</h2><small>Work wise, team wise, date wise, client wise</small></div>
  <div class="quick">
    <button onclick="downloadOrders()">📋 Order CSV</button>
    <button onclick="downloadExecution()">⚙️ Execution CSV</button>
    <button onclick="downloadDispatch()">🚚 Dispatch CSV</button>
    <button onclick="window.print()">📄 Print / Save PDF</button>
  </div></div>`;
}
function users(){
  return section("Users & Role Access","Admin full control",
    table(["Name","Role","Access","Status"],state.data.users.map(u=>`<tr><td>${u.name}</td><td>${u.role}</td><td>${u.access}</td><td>${badge(u.status)}</td></tr>`))
  );
}
function ink(){
  const cards=Object.entries(state.data.ink).map(([n,i])=>`<div class="card"><h3>${n}</h3><h1>${Math.round(i.remain/i.total*100)}%</h1><div class="ink-line"><div style="width:${Math.round(i.remain/i.total*100)}%;background:${i.color}"></div></div><p style="color:var(--green)">${i.remain}</p><p style="color:var(--muted)">Used: ${i.used} · Total: ${i.total}</p><br><button class="btn small blue">+ Update</button></div>`).join("");
  return section("Ink Stock","CMYK live levels",`<div class="ink-grid">${cards}</div>`);
}
function csv(name,rows){const data=rows.map(r=>r.map(x=>`"${String(x??"").replaceAll('"','""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data]));a.download=name;a.click();}
function downloadOrders(){csv("orders.csv",[["Order","Company","Media","Qty","Amount","Advance","Balance","Status"],...state.data.orders.map(o=>[o.id,o.company,o.media,o.qty,o.amount,o.advance,o.balance,o.status])]);}
function downloadExecution(){csv("execution.csv",[["Vehicle","Photo Type","GPS","Time","Verified"],...state.data.proofs.map(p=>[p.vehicle,p.photoType,`${p.gps.lat},${p.gps.lng}`,p.time,p.verified])]);}
function downloadDispatch(){csv("dispatch.csv",[["ID","Order","To","Type","Bundles","Per","Total","Vendor","Status"],...state.data.dispatch.map(d=>[d.id,d.order,d.to,d.type,d.bundles,d.per,d.total,d.vendor,d.status])]);}
function backup(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state.data,null,2)]));a.download="mediahub-backup.json";a.click();}
renderLogin();
