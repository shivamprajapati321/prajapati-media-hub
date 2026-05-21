const app=document.getElementById('app');

function render(){
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
<button>🎨 Design</button>
<button>🖨 Printing</button>
<button>🪡 Stitching</button>
<button>🚚 Dispatch</button>
<button>📍 Execution</button>
<button>💰 Accounts</button>
</div>

</div>

<div class="main">

<div class="card top">
<div>
<h1>Phase 5B ERP</h1>
<p>Real Order Flow Engine Working</p>
</div>

<div class="badge">
LIVE
</div>
</div>

<div class="grid">

<div class="stat">
<h3>Total Orders</h3>
<h1 class="orange">53</h1>
</div>

<div class="stat">
<h3>Pending Approval</h3>
<h1 class="orange">11</h1>
</div>

<div class="stat">
<h3>Printing Running</h3>
<h1 class="orange">7</h1>
</div>

<div class="stat">
<h3>Execution Running</h3>
<h1 class="orange">4</h1>
</div>

</div>

<div class="card">

<h2>Recent Orders</h2>

<table class="table">

<tr>
<th>Order</th>
<th>Company</th>
<th>City</th>
<th>Qty</th>
<th>Status</th>
</tr>

<tr>
<td>ORD-1001</td>
<td>Fortune Oil</td>
<td>Nashik</td>
<td>500</td>
<td><span class="badge">Printing</span></td>
</tr>

<tr>
<td>ORD-1002</td>
<td>Apar</td>
<td>Pune</td>
<td>1200</td>
<td><span class="badge">Approval</span></td>
</tr>

<tr>
<td>ORD-1003</td>
<td>Task Academy</td>
<td>Mumbai</td>
<td>300</td>
<td><span class="badge">Execution</span></td>
</tr>

</table>

</div>

</div>

</div>
`;
}

render();
