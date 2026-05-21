
const app=document.getElementById('app');
let orders=JSON.parse(localStorage.getItem('mediahub_orders'))||[];
function renderSidebar(){return `<aside class="sidebar"><div class="logo">MEDIAHUB</div><button onclick="renderDashboard()">Dashboard</button><button onclick="renderCreateOrder()">Create Order</button><button onclick="renderOrders()">Orders</button></aside>`}
function renderDashboard(){app.innerHTML=`${renderSidebar()}<main class="main-content"><h1>Dashboard</h1><div class="stats-grid"><div class="stat-card"><h3>Total Orders</h3><h2>${orders.length}</h2></div></div></main>`}
function renderCreateOrder(){app.innerHTML=`${renderSidebar()}<main class="main-content"><h1>Create Order</h1><div class="form-grid"><input id="company" placeholder="Company"/><input id="city" placeholder="City"/><input id="quantity" type="number" placeholder="Qty"/><input id="rate" type="number" placeholder="Rate"/></div><button class="main-btn" onclick="createOrder()">Create</button></main>`}
function createOrder(){const order={orderId:'ORD-'+Math.floor(Math.random()*99999),company:document.getElementById('company').value,city:document.getElementById('city').value,quantity:Number(document.getElementById('quantity').value||0),rate:Number(document.getElementById('rate').value||0)};orders.unshift(order);localStorage.setItem('mediahub_orders',JSON.stringify(orders));renderOrders();}
function renderOrders(){app.innerHTML=`${renderSidebar()}<main class="main-content"><h1>Orders</h1><div class="orders-grid">${orders.map(o=>`<div class="order-card"><h2>${o.orderId}</h2><p>${o.company}</p><p>${o.city}</p><p>${o.quantity} PCS</p></div>`).join('')}</div></main>`}
renderDashboard();
