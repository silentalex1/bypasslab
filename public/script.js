function getToken() {
  return localStorage.getItem("batprox_token");
}
function removeToken() {
  localStorage.removeItem("batprox_token");
}
function checkAuth() {
  if (!getToken()) window.location.href = "/login/accountcreation.html";
}
checkAuth();
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
    window.location.href = "/login/accountcreation.html";
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
document.getElementById("logout-btn").onclick = function () {
  removeToken();
  window.location.href = "/login/accountcreation.html";
};
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
