function login(){
  const p = document.getElementById("pass").value;

  if(p === window.PMH_CONFIG.UNIVERSAL_PASSWORD){

    document.getElementById("app").innerHTML = `
      <div class="dashboard">
        <h1><span>MEDIA</span> HUB</h1>

        <p>Login Successful</p>

        <div class="cards">
          <div class="card">Sales</div>
          <div class="card">Printing</div>
          <div class="card">Execution</div>
          <div class="card">Accounts</div>
          <div class="card">Operations</div>
          <div class="card">Admin</div>
        </div>
      </div>
    `;

  }else{
    document.getElementById("msg").innerHTML = "Wrong Password";
  }
}
