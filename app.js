const app=document.getElementById("app");
const FLOW=["Created","Admin Approved","Design Started","Client Approved","Printing","Printing Done","Ready For Stitching"];
let state={
  page:"dashboard",
  editing:null,
  locations:[],
  orders:JSON.parse(localStorage.getItem("mh3_orders"))||[],
  design:JSON.parse(localStorage.getItem("mh3_design"))||[],
  print:JSON.parse(localStorage.getItem("mh3_print"))||[]
};

function save(){localStorage.setItem("mh3_orders",JSON.stringify(state.orders));localStorage.setItem("mh3_design",JSON.stringify(state.design));localStorage.setItem("mh3_print",JSON.stringify(state.print))}
function money(n){return"₹"+Number(n||0).toLocaleString("en-IN")}
function val(id){return document.getElementById(id)?.value||""}
function badge(t){let c=t==="Approved"||t==="Client Approved"||t==="Completed"?"ok":String(t).includes("Pending")?"pending":String(t).includes("Changes")?"bad":String(t).includes("Printing")?"pink":"info";return `<span class="badge ${c}">${t}</span>`}
function kpi(t,v){return `<div class="card"><h3>${t}</h3><h1>${v}</h1></div>`}
function title(t,s=""){return `<div class="top"><div><h1>${t}</h1><p>${s}</p></div><button class="btn" onclick="newOrder()">New Order</button></div>`}
function shell(content){app.innerHTML=`<div class="shell"><aside class="sidebar"><div class="logo">MEDIA<span>HUB</span></div><div class="nav">
<button class="${state.page==='dashboard'?'active':''}" onclick="go('dashboard')">📊 Dashboard</button>
<button class="${state.page==='create'?'active':''}" onclick="newOrder()">➕ Create Order</button>
<button class="${state.page==='orders'?'active':''}" onclick="go('orders')">📋 Orders</button>
<button class="${state.page==='approval'?'active':''}" onclick="go('approval')">✅ Approval</button>
<button class="${state.page==='design'?'active':''}" onclick="go('design')">🎨 Design Queue</button>
<button class="${state.page==='client'?'active':''}" onclick="go('client')">👤 Client Approval</button>
<button class="${state.page==='printing'?'active':''}" onclick="go('printing')">🖨 Printing</button>
<button class="${state.page==='timeline'?'active':''}" onclick="go('timeline')">🕒 Timeline</button>
</div></aside><main class="main">${content}</main></div>`}
function go(p){state.page=p;render()}
function newOrder(){state.page="create";state.editing=null;state.locations=[];render()}
function render(){({dashboard,create,orders,approval,design,client,printing,timeline}[state.page]||dashboard)()}

function dashboard(){
let total=state.orders.reduce((s,o)=>s+o.final,0),qty=state.orders.reduce((s,o)=>s+o.totalQty,0),pending=state.orders.filter(o=>!o.approved).length,clientPend=state.design.filter(d=>d.status==="Sent To Client").length,printRun=state.print.filter(p=>p.status==="Running").length;
shell(`${title("Admin Dashboard","Phase 3: Design + Client Approval + Printing Allocation")}
<div class="cards">${kpi("Orders",state.orders.length)}${kpi("Total Qty",qty)}${kpi("Revenue",money(total))}${kpi("Admin Pending",pending)}${kpi("Client Pending",clientPend)}${kpi("Printing Running",printRun)}</div>
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
</div></div><div id="locationsBox"></div></div>
<div class="cards">${kpi("Total Qty",'<span id="totalQty">0</span>')}${kpi("Base",'<span id="baseAmt">₹0</span>')}${kpi("GST",'<span id="gstAmt">₹0</span>')}${kpi("Final",'<span id="finalAmt">₹0</span>')}</div>
<button class="btn" onclick="${state.editing?'updateOrder()':'saveOrder()'}">${state.editing?'Update Order':'Create Order & Send To Approval'}</button>`);
}
function input(id,l,v="",type="text"){return `<div><label class="label">${l}</label><input id="${id}" type="${type}" value="${v||""}" oninput="calcShow()"></div>`}
function select(id,l,arr,v=""){return `<div><label class="label">${l}</label><select id="${id}" onchange="toggleGST();calcShow()">${arr.map(x=>`<option ${x===v?'selected':''}>${x}</option>`).join("")}</select></div>`}
function area(id,l,v=""){return `<label class="label">${l}</label><textarea id="${id}">${v||""}</textarea>`}
function addLocation(){let city=val("locCity").trim(),qty=Number(val("locQty")),dt=val("locDesignType"),upload=document.getElementById("locDesignFile")?.files?.length?"Uploaded":"Pending";if(!city||!qty){alert("Location and quantity required");return}state.locations.push({city,qty,designType:dt,design:upload,designer:"",clientStatus:"Pending"});document.getElementById("locCity").value="";document.getElementById("locQty").value="";document.getElementById("locDesignFile").value="";renderLocations();calcShow()}
function renderLocations(){let box=document.getElementById("locationsBox"); if(!box)return;box.innerHTML=table(["Location","Qty","Design Type","Design Upload","Action"],state.locations.map((l,i)=>`<tr><td>${l.city}</td><td>${l.qty}</td><td>${l.designType}</td><td>${badge(l.design)}</td><td><button class="btn red small" onclick="removeLocation(${i})">Remove</button></td></tr>`))}
function removeLocation(i){state.locations.splice(i,1);renderLocations();calcShow()}
function totalQty(){return state.locations.reduce((s,l)=>s+Number(l.qty||0),0)}
function toggleGST(){let b=document.getElementById("gstBox"); if(b)b.style.display=val("gstType")==="GST"?"block":"none"}
function calc(){let qty=totalQty(),rate=Number(val("rate")),base=qty*rate,gst=val("gstType")==="GST"?Math.round(base*.18):0,final=base+gst,advance=Number(val("advance"));return{qty,rate,base,gst,final,advance,balance:final-advance}}
function calcShow(){let c=calc(); [["totalQty",c.qty],["baseAmt",money(c.base)],["gstAmt",money(c.gst)],["finalAmt",money(c.final)]].forEach(([id,v])=>{let e=document.getElementById(id);if(e)e.innerHTML=v})}

function build(id=null){let c=calc(); if(!val("company")||!state.locations.length||!c.rate){alert("Company, location and rate required");return null}let old=id?state.orders.find(x=>x.id===id):null;return {id:id||"ORD-"+Math.floor(10000+Math.random()*89999),company:val("company"),person:val("person"),contact:val("contact"),source:val("source"),media:val("media"),locations:JSON.parse(JSON.stringify(state.locations)),totalQty:c.qty,rate:c.rate,base:c.base,gstType:val("gstType"),gstNumber:val("gstNumber"),gst:c.gst,final:c.final,advance:c.advance,balance:c.balance,account:val("account"),start:val("start"),end:val("end"),notes:val("notes"),status:old?.status||"Admin Approval Pending",approved:old?.approved||false,stage:old?.stage||1,timeline:old?.timeline||[]}}
function saveOrder(){let o=build(); if(!o)return; o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Order created with location-wise design split"}); state.orders.unshift(o); save(); state.page="approval"; render()}
function editOrder(id){state.editing=id;state.locations=JSON.parse(JSON.stringify(state.orders.find(x=>x.id===id)?.locations||[]));state.page="create";render()}
function updateOrder(){let o=build(state.editing); if(!o)return; o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Order updated"}); let i=state.orders.findIndex(x=>x.id===state.editing); state.orders[i]=o; state.editing=null; save(); state.page="orders"; render()}
function approve(id){let o=state.orders.find(x=>x.id===id);o.approved=true;o.status="Approved";o.stage=2;o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Admin approved order"});state.design.unshift({id:"DSN-"+Date.now(),orderId:o.id,company:o.company,locations:JSON.parse(JSON.stringify(o.locations)),designer:"",status:"Design Pending",clientStatus:"Pending",notes:""});save();render()}
function delOrder(id){if(confirm("Delete order?")){state.orders=state.orders.filter(o=>o.id!==id);state.design=state.design.filter(d=>d.orderId!==id);state.print=state.print.filter(p=>p.orderId!==id);save();render()}}

function table(h,r){return `<div class="table"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${r.join("")}</tbody></table></div>`}
function locText(o){return (o.locations||[]).map(l=>`${l.city}: ${l.qty} (${l.designType})`).join("<br>")}
function ordersTable(){return `<div class="section"><h2>Orders</h2>${table(["Order","Company","Media","Location Split","Qty","Amount","Status","Action"],state.orders.map(o=>`<tr><td><b style="color:var(--blue)">${o.id}</b><br>${o.source}</td><td>${o.company}<br><small>${o.person||""} ${o.contact||""}</small></td><td>${o.media}</td><td>${locText(o)}</td><td>${o.totalQty}</td><td>${money(o.advance)} / ${money(o.final)}<br>Bal: ${money(o.balance)}</td><td>${badge(o.status)}</td><td><button class="btn small blue" onclick="editOrder('${o.id}')">Edit</button> <button class="btn small" onclick="approve('${o.id}')">Approve</button> <button class="btn small red" onclick="delOrder('${o.id}')">Delete</button></td></tr>`))}</div>`}
function orders(){shell(`${title("Orders","Location-wise order list")}${ordersTable()}`)}
function approval(){shell(`${title("Admin Approval","Approve order before design department")}${table(["Order","Company","Qty","Amount","Status","Action"],state.orders.filter(o=>!o.approved).map(o=>`<tr><td>${o.id}</td><td>${o.company}</td><td>${o.totalQty}</td><td>${money(o.final)}</td><td>${badge(o.status)}</td><td><button class="btn small" onclick="approve('${o.id}')">Approve</button></td></tr>`))}`)}

function design(){
shell(`${title("Design Queue","Assign designer, upload artwork, send to client")}
${table(["Task","Order","Company","Locations","Designer","Status","Action"],state.design.map(d=>`<tr><td>${d.id}</td><td>${d.orderId}</td><td>${d.company}</td><td>${(d.locations||[]).map(l=>`${l.city}: ${l.qty} - ${l.designType}`).join("<br>")}</td><td><input value="${d.designer||""}" onchange="setDesigner('${d.id}',this.value)" placeholder="Designer"></td><td>${badge(d.status)}</td><td><button class="btn small blue" onclick="designStarted('${d.id}')">Start</button> <button class="btn small" onclick="sendClient('${d.id}')">Send Client</button></td></tr>`))}`);
}
function setDesigner(id,v){let d=state.design.find(x=>x.id===id);d.designer=v;save()}
function designStarted(id){let d=state.design.find(x=>x.id===id);d.status="In Design";let o=state.orders.find(x=>x.id===d.orderId);if(o){o.stage=3;o.status="Design Started";o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Design started"});}save();design()}
function sendClient(id){let d=state.design.find(x=>x.id===id);d.status="Sent To Client";d.clientStatus="Pending";let o=state.orders.find(x=>x.id===d.orderId);if(o){o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Design sent to client"});}save();design()}

function client(){
shell(`${title("Client Approval","Approve design or request changes")}
${table(["Order","Company","Status","Action"],state.design.map(d=>`<tr><td>${d.orderId}</td><td>${d.company}</td><td>${badge(d.clientStatus)}</td><td><button class="btn small green" onclick="clientApprove('${d.id}')">Client Approved</button> <button class="btn small red" onclick="clientChanges('${d.id}')">Changes Required</button></td></tr>`))}`);
}
function clientApprove(id){let d=state.design.find(x=>x.id===id);d.clientStatus="Client Approved";d.status="Client Approved";let o=state.orders.find(x=>x.id===d.orderId);if(o){o.stage=4;o.status="Client Approved";o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Client approved design"});}state.print.unshift({id:"PRT-"+Date.now(),orderId:d.orderId,company:d.company,totalQty:o?.totalQty||0,operator:"",machine:"",printed:0,status:"Printing Pending"});save();client()}
function clientChanges(id){let d=state.design.find(x=>x.id===id);d.clientStatus="Changes Required";d.status="Changes Required";save();client()}

function printing(){
shell(`${title("Printing Allocation","Only client-approved orders enter printing")}
${table(["Print ID","Order","Company","Operator","Machine","Total Qty","Printed","Pending","Status","Action"],state.print.map(p=>`<tr><td>${p.id}</td><td>${p.orderId}</td><td>${p.company}</td><td><input value="${p.operator}" onchange="setPrint('${p.id}','operator',this.value)" placeholder="Operator"></td><td><input value="${p.machine}" onchange="setPrint('${p.id}','machine',this.value)" placeholder="Machine"></td><td>${p.totalQty}</td><td><input type="number" value="${p.printed}" onchange="setPrinted('${p.id}',this.value)"></td><td>${Math.max(0,p.totalQty-p.printed)}</td><td>${badge(p.status)}</td><td><button class="btn small" onclick="completePrint('${p.id}')">Complete</button></td></tr>`))}`);
}
function setPrint(id,k,v){let p=state.print.find(x=>x.id===id);p[k]=v;save()}
function setPrinted(id,v){let p=state.print.find(x=>x.id===id);p.printed=Number(v);p.status=p.printed>=p.totalQty?"Completed":"Running";let o=state.orders.find(x=>x.id===p.orderId);if(o){o.stage=5;o.status="Printing";}save();printing()}
function completePrint(id){let p=state.print.find(x=>x.id===id);p.printed=p.totalQty;p.status="Completed";let o=state.orders.find(x=>x.id===p.orderId);if(o){o.stage=6;o.status="Printing Done";o.timeline.push({time:new Date().toLocaleString("en-IN"),text:"Printing completed"});}save();printing()}

function timeline(){
shell(`${title("Timeline","Live order progress")}
${state.orders.map(o=>`<div class="section"><h2>${o.id} · ${o.company}</h2><div class="workflow">${FLOW.map((f,i)=>`<div class="stage ${i<o.stage?'done':i===o.stage?'active':''}">${f}</div>`).join("")}</div><br>${(o.timeline||[]).map(e=>`<div class="card"><b>${e.text}</b><br><small style="color:var(--muted)">${e.time}</small></div>`).join("")}</div>`).join("")}`);
}

render();
