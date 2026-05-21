
const app=document.getElementById('app');

let orders=JSON.parse(localStorage.getItem('mediahub_orders'))||[];

function layout(content){
return `
<div class="shell">
<div class="sidebar">
<div class="logo">MEDIA<span>HUB</span></div>
<div class="nav">
<button onclick="dashboard()">Dashboard</button>
<button onclick="createOrder()">Create Order</button>
<button onclick="ordersPage()">Orders</button>
<button onclick="approvalPage()">Approval</button>
<button onclick="printingPage()">Printing</button>
<button onclick="stitchingPage()">Stitching</button>
<button onclick="dispatchPage()">Dispatch</button>
<button onclick="executionPage()">Execution</button>
<button onclick="accountsPage()">Accounts</button>
</div>
</div>
<div class="main">${content}</div>
</div>`;
}

function dashboard(){
app.innerHTML=layout(`
<div class="top">
<div>
<h1>Admin Dashboard</h1>
<p>Media Hub Workflow Control</p>
</div>
</div>

<div class="cards">
<div class="card"><h3>Total Orders</h3><h1>${orders.length}</h1></div>
<div class="card"><h3>Pending Approval</h3><h1>12</h1></div>
<div class="card"><h3>Execution Running</h3><h1>641</h1></div>
<div class="card"><h3>Total Revenue</h3><h1>₹1.48Cr</h1></div>
</div>

<div class="section">
<h2>Workflow</h2>
<div class="workflow">
<div class="stage active">Sales</div>
<div class="stage active">Approval</div>
<div class="stage">Design</div>
<div class="stage">Printing</div>
<div class="stage">Stitching</div>
<div class="stage">Dispatch</div>
<div class="stage">Execution</div>
<div class="stage">Invoice</div>
</div>
</div>
`);
}

function createOrder(){
app.innerHTML=layout(`
<div class="section">
<h2>Real Order Create</h2>

<div class="form-grid">
<input id="company" placeholder="Company Name">
<input id="person" placeholder="Person Name">
<input id="contact" placeholder="Contact Number">
<select id="source">
<option>Meta Ads</option>
<option>IndiaMART</option>
<option>JustDial</option>
<option>Trade India</option>
<option>Manual</option>
</select>

<select id="media">
<option>Auto Rickshaw Hood Branding</option>
<option>Auto Rickshaw Back Panel</option>
<option>No Parking Board</option>
<option>Vinyl Printing</option>
<option>Flex Printing</option>
<option>Digital Wall Wrap</option>
</select>

<input id="city" placeholder="Multiple Cities">
<input id="qty" type="number" placeholder="Quantity">
<input id="rate" type="number" placeholder="Rate Per PCS">

<select id="gst">
<option>GST</option>
<option>Non GST</option>
</select>

<input id="gstnumber" placeholder="GST Number">
<input id="payment" placeholder="Part Payment">
<select id="account">
<option>HDFC</option>
<option>ICICI</option>
<option>SBI</option>
<option>Cash</option>
</select>

<input type="date">
<input type="date">

<textarea class="full" placeholder="Full Clarity / Notes"></textarea>
</div>

<br>
<button class="btn" onclick="saveOrder()">Create Order</button>
</div>
`);
}

function saveOrder(){
const order={
id:'ORD-'+Math.floor(Math.random()*99999),
company:document.getElementById('company').value,
person:document.getElementById('person').value,
contact:document.getElementById('contact').value,
media:document.getElementById('media').value,
city:document.getElementById('city').value,
qty:document.getElementById('qty').value,
rate:document.getElementById('rate').value
};

orders.unshift(order);
localStorage.setItem('mediahub_orders',JSON.stringify(orders));
ordersPage();
}

function ordersPage(){
app.innerHTML=layout(`
<div class="section">
<h2>All Orders</h2>

<table>
<tr>
<th>Order</th>
<th>Company</th>
<th>Media</th>
<th>City</th>
<th>Qty</th>
<th>Status</th>
</tr>

${orders.map(o=>`
<tr>
<td>${o.id}</td>
<td>${o.company}</td>
<td>${o.media}</td>
<td>${o.city}</td>
<td>${o.qty}</td>
<td><span class="badge orange">Pending</span></td>
</tr>
`).join('')}

</table>
</div>
`);
}

function approvalPage(){
app.innerHTML=layout(`
<div class="section">
<h2>Admin Approval</h2>
<table>
<tr><th>Order</th><th>Company</th><th>Status</th></tr>
<tr><td>ORD-63974</td><td>Apar</td><td><span class="badge orange">Pending</span></td></tr>
</table>
</div>
`);
}

function printingPage(){
app.innerHTML=layout(`
<div class="section">
<h2>Printing Department</h2>
<p>Assign operator and update printed quantity.</p>
</div>
`);
}

function stitchingPage(){
app.innerHTML=layout(`
<div class="section">
<h2>Stitching Department</h2>
<p>Track stitching entries, OT and manager approval.</p>
</div>
`);
}

function dispatchPage(){
app.innerHTML=layout(`
<div class="section">
<h2>Dispatch Management</h2>
<p>Bundle, transport and vendor dispatch tracking.</p>
</div>
`);
}

function executionPage(){
app.innerHTML=layout(`
<div class="section">
<h2>Execution Management</h2>
<p>GPS photos, OCR verification and live execution.</p>
</div>
`);
}

function accountsPage(){
app.innerHTML=layout(`
<div class="section">
<h2>Accounts & Expenses</h2>
<p>Payment tracking, expenses and invoice generation.</p>
</div>
`);
}

dashboard();
