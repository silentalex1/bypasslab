function setToken(token) {
  localStorage.setItem("batprox_token", token);
}
document.getElementById("login-btn").onclick = async function () {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");
  msg.textContent = "";
  if (!username || !password) {
    msg.textContent = "Username and password required.";
    return;
  }
  try {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (r.status !== 200) {
      msg.textContent = "Invalid login.";
      return;
    }
    const d = await r.json();
    setToken(d.token);
    window.location.href = "/home/home.html";
  } catch {
    msg.textContent = "Network error.";
  }
};
document.getElementById("register-btn").onclick = async function () {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");
  msg.textContent = "";
  if (!username || !password) {
    msg.textContent = "Username and password required.";
    return;
  }
  try {
    const r = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (r.status === 409) {
      msg.textContent = "Username taken.";
      return;
    }
    if (r.status !== 200) {
      msg.textContent = "Registration error.";
      return;
    }
    const d = await r.json();
    setToken(d.token);
    window.location.href = "/home/home.html";
  } catch {
    msg.textContent = "Network error.";
  }
};
