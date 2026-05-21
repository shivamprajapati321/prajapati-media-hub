const app=document.getElementById('app');

const orders=[
{id:'ORD-1001',company:'Fortune Oil',city:'Nashik',qty:500,status:'Printing',progress:55},
{id:'ORD-1002',company:'Apar',city:'Pune',qty:1200,status:'Design',progress:25},
{id:'ORD-1003',company:'Task Academy',city:'Mumbai',qty:300,status:'Execution',progress:88}
];

app.innerHTML=`
<div class="shell">

<div class="sidebar">

<div class="logo">
MEDIA<span>HUB</span>
</div>

<div class="menu">
<button>📊 Dashboard</button>
<button>➕ Create Order</button>
<button>📋 Orders</button>
<button>✅ Approval</button>
<button>🎨 Design Queue</button>
<button>🖨 Printing</button>
<button>🪡 Stitching</button>
<button>🚚 Dispatch</button>
<button>📍 Execution</button>
<button>💰 Accounts</button>
<button>📄 Reports</button>
</div>

</div>

<div class="main">

<div class="card">
<h1>Phase 5C ERP Upgrade</h1>
<p>Department workflow + live production tracking</p>
</div>

<div class="grid">

<div class="stat">
<h3>Total Orders</h3>
<h1 class="orange">53</h1>
</div>

<div class="stat">
<h3>Pending Design</h3>
<h1 class="orange">9</h1>
</div>

<div class="stat">
<h3>Printing Running</h3>
<h1 class="orange">7</h1>
</div>

<div class="stat">
<h3>Dispatch Pending</h3>
<h1 class="orange">4</h1>
</div>

</div>

<div class="card">

<h2>Live Workflow Orders</h2>

<table class="table">

<tr>
<th>Order</th>
<th>Company</th>
<th>City</th>
<th>Qty</th>
<th>Status</th>
<th>Progress</th>
</tr>

${orders.map(o=>`
<tr>
<td>${o.id}</td>
<td>${o.company}</td>
<td>${o.city}</td>
<td>${o.qty}</td>
<td><span class="badge">${o.status}</span></td>
<td>
<div class="progress">
<div class="bar" style="width:${o.progress}%"></div>
</div>
${o.progress}%
</td>
</tr>
`).join('')}

</table>

</div>

<div class="card">

<h2>Phase 5C Added</h2>

<ul>
<li>Workflow Progress</li>
<li>Department Structure</li>
<li>Live ERP Layout</li>
<li>Production Tracking</li>
<li>Execution Status</li>
<li>Dispatch Monitoring</li>
<li>Accounts Module Base</li>
</ul>

</div>

</div>

</div>
`;