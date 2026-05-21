const app=document.getElementById("app");
const FLOW=["Created","Admin Approval","Design Check","Payment Verify","Approved","Ready For Design Dept"];
let state={page:"dashboard",editing:null,locations:[],orders:JSON.parse(localStorage.getItem("mh_orders_multicity"))||[]};

function save(){localStorage.setItem("mh_orders_multicity",JSON.stringify(state.orders))}
function money(n){return"₹"+Number(n||0).toLocaleString("en-IN")}
function val(id){return document.getElementById(id)?.value||""}
function badge(t){let c=t==="Approved"?"ok":String(t).includes("Pending")?"pending":"info";return `<span class="badge ${c}">${t}</span>`}
function kpi(t,v){return `<div class="card"><h3>${t}</h3><h1>${v}</h1></div>`}
function shell(content){app.innerHTML=`<div class="shell"><aside class="sidebar"><div class="logo">MEDIA<span>HUB</span></div><div class="nav">
<button class="${state.page==='dashboard'?'active':''}" onclick="go('dashboard')">📊 Dashboard</button>
<button class="${state.page==='create'?'active':''}" onclick="newOrder()">➕ Create Order</button>
<button class="${state.page==='orders'?'active':''}" onclick="go('orders')">📋 Orders</button>
<button class="${state.page==='approval'?'active':''}" onclick="go('approval')">✅ Approval</button>
<button class="${state.page==='design'?'active':''}" onclick="go('design')">🎨 Design Queue</button>
<button class="${state.page==='printing'?'active':''}" onclick="go('printing')">🖨 Printing Queue</button>
</div></aside><main class="main">${content}</main></div>`}
function go(p){state.page=p;render()}
function newOrder(){state.page="create";state.editing=null;state.locations=[];render()}
function title(t,s=""){return `<div class="top"><div><h1>${t}</h1><p>${s}</p></div><button class="btn" onclick="newOrder()">New Order</button></div>`}
function render(){({dashboard,create,orders,approval,design,printing}[state.page]||dashboard)()}

function dashboard(){
let total=state.orders.reduce((s,o)=>s+o.final,0),qty=state.orders.reduce((s,o)=>s+o.totalQty,0),pending=state.orders.filter(o=>!o.approved).length;
shell(`${title("Admin Dashboard","Multi-city order engine with quantity and design mapping")}
<div class="cards">${kpi("Orders",state.orders.length)}${kpi("Total Qty",qty)}${kpi("Revenue",money(total))}${kpi("Pending Approval",pending)}</div>
${ordersTable()}`);
}

function create(){
let o=state.editing?state.orders.find(x=>x.id===state.editing):null;
if(o && state.locations.length===0) state.locations=JSON.parse(JSON.stringify(o.locations||[]));
setTimeout(()=>{renderLocations();toggleGST();calcShow()},0);
shell(`${title(state.editing?"Edit Order":"Real Order Create","Location → Quantity → Same/Different Design → Upload")}
<div class="section"><h2>Campaign Details</h2><div class="grid">
${input("company","Company Name",o?.company)}${input("person","Person Name",o?.person)}
${input("contact","Contact Number",o?.contact)}${select("source","Lead Source",["Meta Ads","IndiaMART","JustDial","Trade India","Manual"],o?.source)}
${select("media","Media",["Auto Rickshaw Hood Branding","Auto Rickshaw Back Panel","No Parking Board","Vinyl Printing","Flex Printing","Digital Wall Wrap"],o?.media)}
${input("rate","Rate Per PCS",o?.rate,"number")}
${select("gstType","GST / Non GST",["GST","Non GST"],o?.gstType||"GST")}<div id="gstBox">${input("gstNumber","GST Number",o?.gstNumber)}</div>
${input("advance","Part Payment",o?.advance||0,"number")}${select("account","Payment Account",["HDFC","ICICI","SBI","Cash","UPI"],o?.account)}
${input("start","Start Date",o?.start,"date")}${input("end","End Date",o?.end,"date")}
<div class="full">${area("notes","Full Clarity / Notes",o?.notes)}</div>
</div></div>

<div class="section"><h2>Location-wise Quantity & Design</h2>
<div class="location-box"><div class="loc-row">
<div><label class="label">Location / City Search</label><input id="locCity" placeholder="Type city/location e.g. Pune"></div>
<div><label class="label">Quantity</label><input id="locQty" type="number" placeholder="500"></div>
<div><label class="label">Design Type</label><select id="locDesignType"><option>Same Design</option><option>Different Design</option></select></div>
<div><label class="label">Design Upload</label><input id="locDesignFile" type="file"></div>
<div><button class="btn small" onclick="addLocation()">+ Add</button></div>
</div></div>
<div id="locationsBox"></div>
</div>

<div class="cards">${kpi("Total Qty",'<span id="totalQty">0</span>')}${kpi("Base",'<span id="baseAmt">₹0</span>')}${kpi("GST",'<span id="gstAmt">₹0</span>')}${kpi("Final",'<span id="finalAmt">₹0</span>')}</div>
<button class="btn" onclick="${state.editing?'updateOrder()':'saveOrder()'}">${state.editing?'Update Order':'Create Order & Send To Approval'}</button>`);
}

function input(id,l,v="",type="text"){return `<div><label class="label">${l}</label><input id="${id}" type="${type}" value="${v||""}" oninput="calcShow()"></div>`}
function select(id,l,arr,v=""){return `<div><label class="label">${l}</label><select id="${id}" onchange="toggleGST();calcShow()">${arr.map(x=>`<option ${x===v?'selected':''}>${x}</option>`).join("")}</select></div>`}
function area(id,l,v=""){return `<label class="label">${l}</label><textarea id="${id}">${v||""}</textarea>`}

function addLocation(){
let city=val("locCity").trim(),qty=Number(val("locQty")),dt=val("locDesignType"),upload=document.getElementById("locDesignFile")?.files?.length?"Uploaded":"Pending";
if(!city||!qty){alert("Location and quantity required");return}
state.locations.push({city,qty,designType:dt,design:upload});
document.getElementById("locCity").value="";document.getElementById("locQty").value="";document.getElementById("locDesignFile").value="";
renderLocations();calcShow();
}
function renderLocations(){
let box=document.getElementById("locationsBox"); if(!box)return;
box.innerHTML=table(["Location","Qty","Design Type","Design Upload","Action"],state.locations.map((l,i)=>`<tr><td>${l.city}</td><td>${l.qty}</td><td>${l.designType}</td><td>${badge(l.design)}</td><td><button class="btn red small" onclick="removeLocation(${i})">Remove</button></td></tr>`));
}
function removeLocation(i){state.locations.splice(i,1);renderLocations();calcShow()}
function totalQty(){return state.locations.reduce((s,l)=>s+Number(l.qty||0),0)}
function toggleGST(){let b=document.getElementById("gstBox"); if(b)b.style.display=val("gstType")==="GST"?"block":"none"}
function calc(){let qty=totalQty(),rate=Number(val("rate")),base=qty*rate,gst=val("gstType")==="GST"?Math.round(base*.18):0,final=base+gst,advance=Number(val("advance"));return{qty,rate,base,gst,final,advance,balance:final-advance}}
function calcShow(){let c=calc(); [["totalQty",c.qty],["baseAmt",money(c.base)],["gstAmt",money(c.gst)],["finalAmt",money(c.final)]].forEach(([id,v])=>{let e=document.getElementById(id);if(e)e.innerHTML=v})}

function build(id=null){
let c=calc(); if(!val("company")||!state.locations.length||!c.rate){alert("Company, location and rate required");return null}
let old=id?state.orders.find(x=>x.id===id):null;
return {id:id||"ORD-"+Math.floor(10000+Math.random()*89999),company:val("company"),person:val("person"),contact:val("contact"),source:val("source"),media:val("media"),locations:JSON.parse(JSON.stringify(state.locations)),totalQty:c.qty,rate:c.rate,base:c.base,gstType:val("gstType"),gstNumber:val("gstNumber"),gst:c.gst,final:c.final,advance:c.advance,balance:c.balance,account:val("account"),start:val("start"),end:val("end"),notes:val("notes"),status:old?.status||"Admin Approval Pending",approved:old?.approved||false,stage:old?.stage||1,timeline:old?.timeline||[]}
}
function saveOrder(){let o=build(); if(!o)return; o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Order created with location-wise design split"}); state.orders.unshift(o); save(); state.page="approval"; render()}
function editOrder(id){state.editing=id;state.locations=JSON.parse(JSON.stringify(state.orders.find(x=>x.id===id)?.locations||[]));state.page="create";render()}
function updateOrder(){let o=build(state.editing); if(!o)return; o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Order updated"}); let i=state.orders.findIndex(x=>x.id===state.editing); state.orders[i]=o; state.editing=null; save(); state.page="orders"; render()}
function approve(id){let o=state.orders.find(x=>x.id===id);o.approved=true;o.status="Approved";o.stage=4;o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Admin approved order"});save();render()}
function delOrder(id){if(confirm("Delete order?")){state.orders=state.orders.filter(o=>o.id!==id);save();render()}}

function table(h,r){return `<div class="table"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${r.join("")}</tbody></table></div>`}
function locText(o){return (o.locations||[]).map(l=>`${l.city}: ${l.qty} (${l.designType})`).join("<br>")}
function ordersTable(){return `<div class="section"><h2>Orders</h2>${table(["Order","Company","Media","Location Split","Qty","Amount","Status","Action"],state.orders.map(o=>`<tr><td><b style="color:var(--blue)">${o.id}</b><br>${o.source}</td><td>${o.company}<br><small>${o.person||""} ${o.contact||""}</small></td><td>${o.media}</td><td>${locText(o)}</td><td>${o.totalQty}</td><td>${money(o.advance)} / ${money(o.final)}<br>Bal: ${money(o.balance)}</td><td>${badge(o.status)}</td><td><button class="btn small blue" onclick="editOrder('${o.id}')">Edit</button> <button class="btn small" onclick="approve('${o.id}')">Approve</button> <button class="btn small red" onclick="delOrder('${o.id}')">Delete</button></td></tr>`))}</div>`}
function orders(){shell(`${title("Orders","Location-wise order list")}${ordersTable()}`)}
function approval(){shell(`${title("Admin Approval","Approve order before design department")}${table(["Order","Company","Qty","Amount","Status","Action"],state.orders.filter(o=>!o.approved).map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${o.totalQty}</td><td>${money(o.final)}</td><td>${badge(o.status)}</td><td><button class="btn small" onclick="approve('${o.id}')">Approve</button></td></tr>`))}`)}
function design(){shell(`${title("Design Queue","City-wise design upload and approval will continue in next phase")}${table(["Order","Company","Locations","Status"],state.orders.map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${locText(o)}</td><td>${badge(o.approved?"Design Pending":"Admin Pending")}</td></tr>`))}`)}
function printing(){shell(`${title("Printing Queue","Approved orders ready for printing")}${table(["Order","Company","Qty","Status"],state.orders.filter(o=>o.approved).map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${o.totalQty}</td><td>${badge("Printing Pending")}</td></tr>`))}`)}
render();
