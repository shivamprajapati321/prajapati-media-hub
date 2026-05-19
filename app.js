const CONFIG = {
  API_URL:
    "https://script.google.com/macros/s/AKfycbxdXND_xK9HzCr0JUmnQZ8lVHAhZ96ph-lIKem3fwXl9L9DcOB0t5mwdC_r6boiH_8i/exec",

  COMPANY: "Prajapati Advertising",
};

const state = {
  user: null,
  dashboard: null,
};

async function api(action, payload = {}) {
  try {

    const res = await fetch(CONFIG.API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },

      body: JSON.stringify({
        action,
        payload,
      }),
    });

    return await res.json();

  } catch (err) {

    console.error(err);

    return {
      ok: false,
      error: err.message,
    };
  }
}

function renderLogin() {

  document.getElementById("app").innerHTML = `
  
  <div class="login-wrap">

    <div class="login-box">

      <h1>MEDIAHUB</h1>

      <p>Prajapati Advertising ERP</p>

      <input
        id="phone"
        placeholder="Phone Number"
      />

      <input
        id="password"
        type="password"
        placeholder="Password"
      />

      <button onclick="login()">
        Login
      </button>

      <div id="err"></div>

    </div>

  </div>
  `;
}

async function login() {

  const phone =
    document.getElementById("phone").value;

  const password =
    document.getElementById("password").value;

  if (!phone || !password) {

    document.getElementById("err").innerHTML =
      "Enter login details";

    return;
  }

  // TEMP UNIVERSAL LOGIN

  if (password === "9922138138") {

    state.user = {
      name: "Shivam Prajapati",
      role: "admin",
    };

    loadDashboard();

    return;
  }

  document.getElementById("err").innerHTML =
    "Wrong Password";
}

async function loadDashboard() {

  document.getElementById("app").innerHTML =
    "<div class='loading'>Loading Dashboard...</div>";

  const data =
    await api("dashboard");

  state.dashboard = data;

  renderDashboard();
}

function renderDashboard() {

  document.getElementById("app").innerHTML = `

  <div class="app-shell">

    <aside class="sidebar">

      <div class="logo">
        <span>MEDIA</span>HUB
      </div>

      <div class="menu">

        <button>🏢 Dashboard</button>
        <button>💼 Sales</button>
        <button>🖨 Printing</button>
        <button>🪡 Stitching</button>
        <button>⚙️ Execution</button>
        <button>🚚 Delivery</button>
        <button>💳 Accounts</button>
        <button>👑 Admin</button>

      </div>

    </aside>

    <main class="main">

      <div class="topbar">

        <div>

          <h1>
            Enterprise Dashboard
          </h1>

          <p>
            Welcome,
            ${state.user.name}
          </p>

        </div>

        <button class="live-btn">
          LIVE
        </button>

      </div>

      <div class="cards">

        <div class="card">
          <h3>Revenue</h3>
          <h1>₹4.8L</h1>
        </div>

        <div class="card">
          <h3>Campaigns</h3>
          <h1>42</h1>
        </div>

        <div class="card">
          <h3>Execution</h3>
          <h1>752</h1>
        </div>

        <div class="card">
          <h3>Pending</h3>
          <h1>1240</h1>
        </div>

      </div>

      <div class="table">

        <table>

          <thead>
            <tr>
              <th>Campaign</th>
              <th>City</th>
              <th>Status</th>
              <th>Qty</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Aakash Institute</td>
              <td>Pune</td>
              <td>Running</td>
              <td>1000</td>
            </tr>

            <tr>
              <td>Society Tea</td>
              <td>Nagpur</td>
              <td>Completed</td>
              <td>500</td>
            </tr>

          </tbody>

        </table>

      </div>

    </main>

  </div>
  `;
}

renderLogin();
