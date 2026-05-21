
const app = document.getElementById('app');

function loginScreen(){
app.innerHTML = `
<div class="login">
<div class="box">

<div class="logo">
MEDIA<span>HUB</span>
</div>

<select id="role">
<option>Admin</option>
<option>Sales</option>
<option>Printing</option>
<option>Execution</option>
</select>

<input id="password" type="password" placeholder="Password">

<button onclick="login()">Login</button>

<p id="error" style="color:red;"></p>

</div>
</div>
`;
}

function login(){
const pass = document.getElementById('password').value;

if(pass !== window.PMH_CONFIG.PASSWORD){
document.getElementById('error').innerText = 'Wrong Password';
return;
}

dashboard();
}

function dashboard(){
app.innerHTML = `
<div class="shell">

<div class="sidebar">

<div class="brand">
MEDIA<span>HUB</span>
</div>

<div class="nav">
<button>Dashboard</button>
<button>Orders</button>
<button>Design</button>
<button>Printing</button>
<button>Dispatch</button>
<button>Execution</button>
<button>Accounts</button>
</div>

</div>

<div class="main">

<div class="card">
<h1>Phase 5A Working</h1>
<p>Role ERP Shell Loaded Successfully</p>
</div>

<div class="card">
<h2>Modules</h2>

<ul>
<li>Orders</li>
<li>Design</li>
<li>Printing</li>
<li>Dispatch</li>
<li>Execution</li>
<li>Accounts</li>
</ul>

</div>

</div>

</div>
`;
}

loginScreen();
