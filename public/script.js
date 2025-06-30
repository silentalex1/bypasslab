function showLogin() {
  document.getElementById("login-section").style.display = "";
  document.getElementById("proxy-section").style.display = "none";
}
function showProxy() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("proxy-section").style.display = "";
}

function setToken(token) {
  localStorage.setItem("batprox_token", token);
}
function getToken() {
  return localStorage.getItem("batprox_token");
}
function removeToken() {
  localStorage.removeItem("batprox_token");
}

function checkAuth() {
  if (getToken()) {
    showProxy();
  } else {
    showLogin();
  }
}
checkAuth();

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
    showProxy();
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
    showProxy();
  } catch {
    msg.textContent = "Network error.";
  }
};

document.getElementById("logout-btn").onclick = function () {
  removeToken();
  showLogin();
};

document.getElementById("go").onclick = runService;
document.getElementById("urlbar").addEventListener("keypress", function (event) {
  if (event.key === "Enter") runService();
});
function runService() {
  const url = document.getElementById("urlbar").value.trim();
  if (!/^https?:\/\//.test(url)) {
    document.getElementById("randomDescription").textContent = "Please enter a valid URL starting with http:// or https://";
    return;
  }
  const token = getToken();
  if (!token) {
    showLogin();
    return;
  }
  window.open(`/api/proxy?url=${encodeURIComponent(url)}&token=${encodeURIComponent(token)}`, '_blank');
}
document.getElementById("urlbar").addEventListener("contextmenu", function (e) {
  e.preventDefault();
  document.getElementById("sidebar").style.display = "block";
});
function closeSidebar() {
  document.getElementById("sidebar").style.display = "none";
}
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle", stroke: { width: 0, color: "#000" }, polygon: { nb_sides: 5 } },
    opacity: { value: 0.5 },
    size: { value: 3, random: true },
    line_linked: { enable: false },
    move: { enable: true, speed: 6, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
});
