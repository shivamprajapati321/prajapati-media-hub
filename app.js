const CFG=window.PMH_CONFIG||{UNIVERSAL_PASSWORD:"9922138138",COMPANY:"Prajapati Advertising"};
const FLOW=["Created","Admin Approval","Payment Check","Design Check","Approved","Ready For Phase 2"];
let state={page:"dashboard",data:null,cities:[],editing:null};

function seed(){return{orders:[{id:"ORD-68151",company:"Apar",person:"Purchase Manager",contact:"9000000002",source:"IndiaMART",media:"Auto Rickshaw Hood Branding",cities:["Mumbai","Pune","Nashik"],qty:11450,rate:425,base:4866250,gstType:"GST",gstNumber:"",gst:875925,final:5742175,advance:3000000,balance:2742175,account:"ICICI",design:"Uploaded",receipt:"Uploaded",start:"2026-05-21",end:"2026-05-30",notes:"Multi city campaign.",status:"Admin Approval Pending",stage:1,approved:false,timeline:[{time:new Date().toLocaleString("en-IN"),text:"Order created"}]}]}}

function load(){try{state.data=JSON.parse(localStorage.getItem("pmh_phase1_orders_final"))||seed()}catch(e){state.data=seed()}save()}
function save(){localStorage.setItem("pmh_phase1_orders_final",JSON.stringify(state.data))}
function money(n){return"₹"+Number(n||0).toLocaleString("en-IN")}
function val(id){return document.getElementById(id)?.value||""}
function badge(t){let c=t==="Approved"?"b-green":String(t).includes("Pending")?"b-red":"b-orange";return`<span class="badge ${c}">${t}</span>`}
function kpi(a,b){return`<div class="card"><h3>${a}</h3><h1>${b}</h1></div>`}
function section(t,s,b){return`<div class="section"><div class="section-head"><h2>${t}</h2><small>${s}</small></div>${b}</div>`}
function table(h,r){return`<div class="table"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${r.join("")}</tbody></table></div>`}

function login(){if(val("pass")!==CFG.UNIVERSAL_PASSWORD){document.getElementById("msg").innerText="Wrong Password";return}load();render()}
function renderLogin(){document.getElementById("app").innerHTML=`<div class="login"><div class="login-box"><div class="logo"><span>MEDIA</span>HUB</div><p style="color:#9ca3af;margin:12px 0 20px">Phase 1 Orders Engine</p><input id="pass" class="input" type="password" placeholder="Password"><button class="btn" onclick="login()">Login</button><div class="err" id="msg"></div></div></div>`}
function go(p){state.page=p;if(p==="create"&&!state.editing)state.cities=[];render()}
function nav(id,l){return`<button class="${state.page===id?'active':''}" onclick="go('${id}')">${l}</button>`}
function title(){return{dashboard:"Orders Dashboard",create:state.editing?"Edit Order":"Create Order",orders:"Orders List",approval:"Admin Approval",timeline:"Timeline"}[state.page]}
function render(){document.getElementById("app").innerHTML=`<div class="shell"><aside class="side"><div class="brand"><span>MEDIA</span>HUB</div><div class="nav">${nav("dashboard","📊 Dashboard")}${nav("create","➕ Create Order")}${nav("orders","📋 Orders")}${nav("approval","✅ Approval")}${nav("timeline","🕒 Timeline")}</div></aside><main class="main"><div class="top"><div><h1>${title()}</h1><p>Phase 1: Create, edit, delete, approve, GST, multi-city, timeline</p></div><button class="btn" onclick="newOrder()">New Order</button></div>${page()}</main></div>`}
function page(){return({dashboard,create:form,orders,approval,timeline}[state.page]||dashboard)()}

function dashboard(){let o=state.data.orders,total=o.reduce((s,x)=>s+x.final,0),adv=o.reduce((s,x)=>s+x.advance,0),bal=o.reduce((s,x)=>s+x.balance,0),pending=o.filter(x=>!x.approved).length;return`<div class="cards">${kpi("Orders",o.length)}${kpi("Total",money(total))}${kpi("Advance",money(adv))}${kpi("Balance",money(bal))}${kpi("Pending",pending)}</div>${orders()}`}
function input(id,l,v="",t="text"){return`<div><label class="label">${l}</label><input class="input" id="${id}" type="${t}" value="${v||""}" oninput="calcShow()"></div>`}
function sel(id,l,a,v=""){return`<div><label class="label">${l}</label><select id="${id}" onchange="toggleGST();calcShow()">${a.map(x=>`<option ${x===v?"selected":""}>${x}</option>`).join("")}</select></div>`}
function area(id,l,v=""){return`<label class="label">${l}</label><textarea id="${id}" rows="3">${v||""}</textarea>`}
function newOrder(){state.editing=null;state.cities=[];state.page="create";render()}

function form(){let o=state.editing?state.data.orders.find(x=>x.id===state.editing):null;if(o&&state.cities.length===0)state.cities=[...(o.cities||[])];setTimeout(()=>{renderCities();toggleGST();calcShow()},0);return`<div class="card"><h2>${o?"Edit Order":"Create Real Order"}</h2><br><div class="form">
${input("company","Company",o?.company)}${input("person","Person",o?.person)}${input("contact","Contact",o?.contact)}${sel("source","Source",["Manual","Meta","IndiaMART","JustDial","TradeIndia","Referral"],o?.source)}${sel("media","Media",["Auto Rickshaw Hood Branding","Auto Rickshaw Back Panel","No Parking Board","Vinyls Printing","Flex Printing","Digital Wall Wrap"],o?.media)}
<div><label class="label">Multiple City</label><input class="input" id="cityInput" placeholder="Enter city"><button class="btn small" type="button" onclick="addCity()">+ Add City</button><div id="cityTags" class="tags"></div></div>
${input("qty","Quantity",o?.qty,"number")}${input("rate","Rate Per PCS",o?.rate,"number")}${sel("gstType","GST Type",["GST","Non GST"],o?.gstType||"GST")}<div id="gstBox">${input("gstNumber","GST Number",o?.gstNumber)}</div>${input("advance","Part Payment",o?.advance||0,"number")}${sel("account","Payment Account",["HDFC","ICICI","Cash","UPI","Other"],o?.account)}
<div><label class="label">Design Upload</label><input class="input" type="file" id="designFile"><small style="color:#9ca3af">Current: ${o?.design||"Pending"}</small></div>
<div><label class="label">Receipt Upload</label><input class="input" type="file" id="receiptFile"><small style="color:#9ca3af">Current: ${o?.receipt||"Pending"}</small></div>
${input("start","Start Date",o?.start,"date")}${input("end","End Date",o?.end,"date")}<div class="full">${area("notes","Notes",o?.notes)}</div></div>
<div class="cards"><div class="card"><h3>Base</h3><h1 id="baseAmt">₹0</h1></div><div class="card"><h3>GST</h3><h1 id="gstAmt">₹0</h1></div><div class="card"><h3>Final</h3><h1 id="finalAmt">₹0</h1></div></div>
<button class="btn" onclick="${o?"updateOrder()":"createOrder()"}">${o?"Update":"Create & Send To Approval"}</button></div>`}

function addCity(){let c=val("cityInput").trim();if(c&&!state.cities.includes(c))state.cities.push(c);document.getElementById("cityInput").value="";renderCities()}
function renderCities(){let b=document.getElementById("cityTags");if(b)b.innerHTML=state.cities.map((c,i)=>`<div class="tag" onclick="state.cities.splice(${i},1);renderCities()">${c} ✕</div>`).join("")}
function toggleGST(){let b=document.getElementById("gstBox");if(b)b.style.display=val("gstType")==="GST"?"block":"none"}
function calc(){let qty=+val("qty"),rate=+val("rate"),base=qty*rate,gst=val("gstType")==="GST"?Math.round(base*.18):0,final=base+gst,adv=+val("advance");return{qty,rate,base,gst,final,advance:adv,balance:final-adv}}
function calcShow(){let c=calc();["baseAmt","gstAmt","finalAmt"].forEach((id,i)=>{let e=document.getElementById(id);if(e)e.innerText=money([c.base,c.gst,c.final][i])})}

function build(id=null){let c=calc();if(!val("company")||!c.qty||!c.rate){alert("Company, Qty, Rate required");return null}let old=id?state.data.orders.find(x=>x.id===id):null;return{id:id||"ORD-"+Math.floor(10000+Math.random()*89999),company:val("company"),person:val("person"),contact:val("contact"),source:val("source"),media:val("media"),cities:[...state.cities],qty:c.qty,rate:c.rate,base:c.base,gstType:val("gstType"),gstNumber:val("gstNumber"),gst:c.gst,final:c.final,advance:c.advance,balance:c.balance,account:val("account"),design:document.getElementById("designFile")?.files?.length?"Uploaded":old?.design||"Pending",receipt:document.getElementById("receiptFile")?.files?.length?"Uploaded":old?.receipt||"Pending",start:val("start"),end:val("end"),notes:val("notes"),status:old?.status||"Admin Approval Pending",stage:old?.stage||1,approved:old?.approved||false,timeline:old?.timeline||[]}}
function createOrder(){let o=build();if(!o)return;o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Order created"});state.data.orders.unshift(o);save();state.page="approval";render()}
function edit(id){state.editing=id;state.cities=[...(state.data.orders.find(x=>x.id===id)?.cities||[])];state.page="create";render()}
function updateOrder(){let o=build(state.editing);if(!o)return;o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Order updated"});let i=state.data.orders.findIndex(x=>x.id===state.editing);state.data.orders[i]=o;state.editing=null;save();state.page="orders";render()}
function approve(id){let o=state.data.orders.find(x=>x.id===id);o.approved=true;o.status="Approved";o.stage=4;o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Admin approved"});save();render()}
function del(id){if(confirm("Delete order?")){state.data.orders=state.data.orders.filter(x=>x.id!==id);save();render()}}

function orders(){return section("Orders","Edit / delete / approve",table(["Order","Client","Media","Cities","Amount","GST","Uploads","Status","Action"],state.data.orders.map(o=>`<tr><td><b style="color:#38bdf8">${o.id}</b><br>${o.source}</td><td>${o.company}<br><small>${o.person} ${o.contact}</small></td><td>${o.media}<br>${o.qty} x ${money(o.rate)}</td><td>${(o.cities||[]).join(", ")}</td><td>${money(o.advance)} / ${money(o.final)}<br>Bal: ${money(o.balance)}</td><td>${o.gstType}<br>${o.gstNumber||"-"}<br>${money(o.gst)}</td><td>Design: ${o.design}<br>Receipt: ${o.receipt}</td><td>${badge(o.status)}</td><td><button class="btn small dark" onclick="view('${o.id}')">View</button> <button class="btn small blue" onclick="edit('${o.id}')">Edit</button> <button class="btn small" onclick="approve('${o.id}')">Approve</button> <button class="btn small red" onclick="del('${o.id}')">Delete</button></td></tr>`))+`<div id="detail"></div>`)}
function approval(){let rows=state.data.orders.filter(x=>!x.approved).map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${money(o.final)}</td><td>${o.receipt}</td><td>${badge(o.status)}</td><td><button class="btn small" onclick="approve('${o.id}')">Approve</button></td></tr>`);return section("Admin Approval","Pending approvals",table(["Order","Company","Amount","Receipt","Status","Action"],rows))}
function timeline(){return state.data.orders.map(o=>`<div class="card"><h3>${o.id} · ${o.company}</h3><div class="workflow">${FLOW.map((f,i)=>`<div class="stage ${i<o.stage?'done':i===o.stage?'current':''}">${f}</div>`).join("")}</div><br>${(o.timeline||[]).map(e=>`<div class="event">${e.text}<br><small>${e.time}</small></div>`).join("")}</div>`).join("")}
function view(id){let o=state.data.orders.find(x=>x.id===id);document.getElementById("detail").innerHTML=`<div class="card" style="margin-top:12px"><h2>${o.id} ${o.company}</h2><div class="cards">${kpi("Base",money(o.base))}${kpi("GST",money(o.gst))}${kpi("Final",money(o.final))}${kpi("Balance",money(o.balance))}</div><div class="workflow">${FLOW.map((f,i)=>`<div class="stage ${i<o.stage?'done':i===o.stage?'current':''}">${f}</div>`).join("")}</div></div>`}
function backup(){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state.data,null,2)]));a.download="phase1-orders-backup.json";a.click()}
renderLogin();
