const CFG=window.PMH_CONFIG||{PASSWORD:"9922138138"};
const app=document.getElementById("app");
const roles=["Admin","Sales","Design","Printing","Stitching","Dispatch","Execution","Accounts"];
const pipeline=["New","Approved","Design","Printing","Stitching","Dispatch","Execution","Accounts","Done"];
let S={user:null,page:"dashboard",locations:[],orders:JSON.parse(localStorage.getItem("mh5b_orders")||"[]")};

function save(){localStorage.setItem("mh5b_orders",JSON.stringify(S.orders))}
function money(n){return"₹"+Number(n||0).toLocaleString("en-IN")}
function v(id){return document.getElementById(id)?.value||""}
function badge(t){let c=t==="Done"||t==="Approved"?"ok":t==="Rejected"?"bad":t==="New"?"info":"";return `<span class="badge ${c}">${t}</span>`}
function stageIndex(st){return Math.max(0,pipeline.indexOf(st))}
function progress(o){let si=stageIndex(o.status);return `<div class="progress">${pipeline.slice(0,8).map((p,i)=>`<div class="step ${i<si?'done':i===si?'current':''}">${p}</div>`).join("")}</div>`}

function loginUI(){app.innerHTML=`<div class="login"><div class="loginBox"><div class="logo">MEDIA<span>HUB</span></div><p style="color:#9ca3af">Phase 5B · Real Order Flow</p><select id="role">${roles.map(r=>`<option>${r}</option>`).join("")}</select><input id="pass" type="password" placeholder="Password"><button onclick="login()">Login</button><p id="err" style="color:#ef4444"></p></div></div>`}
function login(){if(v("pass")!==CFG.PASSWORD){document.getElementById("err").innerText="Wrong Password";return}S.user={role:v("role")};render()}
function logout(){S.user=null;loginUI()}
function can(m){return S.user.role==="Admin"||m==="dashboard"||m==="reports"||m.toLowerCase()===S.user.role.toLowerCase()|| (S.user.role==="Sales" && m==="orders")}
function nav(id,label,module=id){return can(module)?`<button class="${S.page===id?'active':''}" onclick="go('${id}')">${label}</button>`:""}
function shell(content){app.innerHTML=`<div class="shell"><aside class="side"><div class="brand">MEDIA<span>HUB</span></div><div class="role">👤 ${S.user.role}</div><div class="nav">${nav("dashboard","📊 Dashboard")}${nav("orders","➕ Orders","orders")}${nav("approval","✅ Approval","Admin")}${nav("design","🎨 Design")}${nav("printing","🖨 Printing")}${nav("stitching","🪡 Stitching")}${nav("dispatch","🚚 Dispatch")}${nav("execution","📍 Execution")}${nav("accounts","💳 Accounts")}${nav("reports","📄 Reports")}<button onclick="logout()">Logout</button></div></aside><main class="main">${content}</main></div>`}
function go(p){S.page=p;render()}
function top(t,s=""){return `<div class="top"><div><h1>${t}</h1><p>${s}</p></div><button class="btn dark" onclick="backup()">Backup</button></div>`}
function kpi(t,v){return `<div class="card"><h3>${t}</h3><h1>${v}</h1></div>`}
function table(h,r){return `<div class="table"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${r.join("")||'<tr><td colspan="10">No data</td></tr>'}</tbody></table></div>`}
function render(){({dashboard,orders,approval,design,printing,stitching,dispatch,execution,accounts,reports}[S.page]||dashboard)()}

function dashboard(){
 let total=S.orders.reduce((a,o)=>a+o.final,0),qty=S.orders.reduce((a,o)=>a+o.qty,0);
 shell(`${top("Admin Dashboard","Phase 5B: Real order flow engine")}
 <div class="cards">${kpi("Orders",S.orders.length)}${kpi("Total Qty",qty)}${kpi("Revenue",money(total))}${kpi("Approval Pending",S.orders.filter(o=>o.status==="New").length)}${kpi("Printing",S.orders.filter(o=>o.status==="Printing").length)}${kpi("Execution",S.orders.filter(o=>o.status==="Execution").length)}</div>
 ${ordersTable()}`)
}

function orders(){
 S.locations=[];
 shell(`${top("Create Order","Multi-city quantity, design type, GST, payment")}
 <div class="section"><h2>Order Details</h2><div class="grid">
 ${input("company","Company")} ${input("person","Person")}
 ${input("contact","Contact")} ${select("source","Lead Source",["Manual","Meta Ads","IndiaMART","JustDial","Trade India"])}
 ${select("media","Media",["Auto Rickshaw Hood Branding","Auto Rickshaw Back Panel","No Parking Board","Flex Printing","Vinyl Printing","Digital Wall Wrap"])}
 ${input("rate","Rate Per PCS","","number")} ${select("gstType","GST Type",["GST","Non GST"])} ${input("gstNo","GST Number")}
 ${input("advance","Part Payment","0","number")} ${select("account","Payment Account",["HDFC","ICICI","Cash","UPI"])}
 <div class="full"><label class="label">Notes</label><textarea id="notes"></textarea></div>
 </div></div>
 <div class="section"><h2>Location Split</h2>
 <div class="locRow"><div>${input("locCity","Location / City")}</div><div>${input("locQty","Qty","","number")}</div><div>${select("locDesign","Design",["Same Design","Different Design"])}</div><button class="btn small" onclick="addLocation()">Add</button></div>
 <div id="locBox"></div></div>
 <div class="cards">${kpi("Total Qty",'<span id="totalQty">0</span>')}${kpi("Base",'<span id="baseAmt">₹0</span>')}${kpi("GST",'<span id="gstAmt">₹0</span>')}${kpi("Final",'<span id="finalAmt">₹0</span>')}</div>
 <button class="btn" onclick="createOrder()">Create Order</button>
 ${ordersTable()}`)
}
function input(id,l,val="",type="text"){return `<label class="label">${l}</label><input id="${id}" type="${type}" value="${val}" oninput="calcShow()">`}
function select(id,l,arr){return `<label class="label">${l}</label><select id="${id}" onchange="calcShow()">${arr.map(x=>`<option>${x}</option>`).join("")}</select>`}
function addLocation(){let city=v("locCity"),qty=+v("locQty"),design=v("locDesign");if(!city||!qty){alert("City and Qty required");return}S.locations.push({city,qty,design});document.getElementById("locCity").value="";document.getElementById("locQty").value="";renderLoc();calcShow()}
function renderLoc(){document.getElementById("locBox").innerHTML=table(["City","Qty","Design","Action"],S.locations.map((l,i)=>`<tr><td>${l.city}</td><td>${l.qty}</td><td>${l.design}</td><td><button class="btn small red" onclick="S.locations.splice(${i},1);renderLoc();calcShow()">Remove</button></td></tr>`))}
function calc(){let qty=S.locations.reduce((a,b)=>a+b.qty,0),rate=+v("rate"),base=qty*rate,gst=v("gstType")==="GST"?Math.round(base*.18):0,final=base+gst,advance=+v("advance");return{qty,rate,base,gst,final,advance,balance:final-advance}}
function calcShow(){let c=calc();[["totalQty",c.qty],["baseAmt",money(c.base)],["gstAmt",money(c.gst)],["finalAmt",money(c.final)]].forEach(([id,val])=>{let e=document.getElementById(id);if(e)e.innerHTML=val})}
function createOrder(){let c=calc();if(!v("company")||!S.locations.length||!c.rate){alert("Company, locations and rate required");return}S.orders.unshift({id:"ORD-"+Date.now(),company:v("company"),person:v("person"),contact:v("contact"),source:v("source"),media:v("media"),locations:[...S.locations],qty:c.qty,rate:c.rate,gstType:v("gstType"),gstNo:v("gstNo"),base:c.base,gst:c.gst,final:c.final,advance:c.advance,balance:c.balance,account:v("account"),notes:v("notes"),status:"New",timeline:[{t:new Date().toLocaleString("en-IN"),m:"Order created"}]});save();S.locations=[];go("approval")}
function move(id,status){let o=S.orders.find(x=>x.id===id);o.status=status;o.timeline.push({t:new Date().toLocaleString("en-IN"),m:"Moved to "+status});save();render()}
function approval(){shell(`${top("Admin Approval","Approve new orders")}
 ${table(["Order","Company","Qty","Amount","Status","Action"],S.orders.filter(o=>o.status==="New").map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${o.qty}</td><td>${money(o.final)}</td><td>${badge(o.status)}</td><td><button class="btn small green" onclick="move('${o.id}','Approved')">Approve</button> <button class="btn small red" onclick="move('${o.id}','Rejected')">Reject</button></td></tr>`))}`)}
function modulePage(titleName,fromStatus,nextStatus){shell(`${top(titleName,nextStatus?"Complete and move to "+nextStatus:"Final account check")}
 ${table(["Order","Company","Location Split","Qty","Amount","Status","Action"],S.orders.filter(o=>o.status===fromStatus).map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${locText(o)}</td><td>${o.qty}</td><td>${money(o.final)}</td><td>${badge(o.status)}</td><td>${nextStatus?`<button class="btn small" onclick="move('${o.id}','${nextStatus}')">Move Next</button>`:`<button class="btn small green" onclick="move('${o.id}','Done')">Complete</button>`}</td></tr>`))}`)}
function design(){modulePage("Design Department","Approved","Design")}
function printing(){modulePage("Printing Department","Design","Printing")}
function stitching(){modulePage("Stitching Department","Printing","Stitching")}
function dispatch(){modulePage("Dispatch Department","Stitching","Dispatch")}
function execution(){modulePage("Execution Department","Dispatch","Execution")}
function accounts(){modulePage("Accounts Department","Execution",null)}
function reports(){shell(`${top("Reports","All orders with timelines")}${ordersTable()}`)}
function locText(o){return (o.locations||[]).map(l=>`${l.city}: ${l.qty} (${l.design})`).join("<br>")}
function ordersTable(){return `<div class="section"><h2>Orders List</h2>${table(["Order","Company","Media","Location Split","Qty","Amount","Status","Progress"],S.orders.map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${o.media}</td><td>${locText(o)}</td><td>${o.qty}</td><td>${money(o.final)}<br>Bal: ${money(o.balance)}</td><td>${badge(o.status)}</td><td>${progress(o)}</td></tr>`))}</div>`}
function backup(){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S.orders,null,2)]));a.download="mediahub-phase5B-orders.json";a.click()}
loginUI();
