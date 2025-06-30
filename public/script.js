function hash(str) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(buf =>
    Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  );
}
function setToken(token) {
  localStorage.setItem("batprox_token", token);
}
function getUsers() {
  let users = localStorage.getItem("batprox_users");
  if (!users) {
    localStorage.setItem("batprox_users", JSON.stringify([]));
    users = "[]";
  }
  return JSON.parse(users);
}
function writeUsers(users) {
  localStorage.setItem("batprox_users", JSON.stringify(users));
}
function createToken(username) {
  return btoa(username + "|" + Date.now());
}
const card = document.getElementById("auth-card");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const toRegisterBtn = document.getElementById("to-register-btn");
const toLoginBtn = document.getElementById("to-login-btn");
if (toRegisterBtn) {
  toRegisterBtn.onclick = function () {
    card.classList.add("flipped");
  };
}
if (toLoginBtn) {
  toLoginBtn.onclick = function () {
    card.classList.remove("flipped");
  };
}
if (loginBtn) {
  loginBtn.onclick = function () {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const msg = document.getElementById("login-msg");
    msg.textContent = "";
    if (!username || !password) {
      msg.textContent = "Username and password required.";
      return;
    }
    const users = getUsers();
    hash(password).then(pwHash => {
      const user = users.find(u => u.username === username && u.password === pwHash);
      if (!user) {
        msg.textContent = "Invalid login.";
        return;
      }
      setToken(createToken(username));
      window.location.href = "/home/home.html";
    });
  };
}
if (registerBtn) {
  registerBtn.onclick = function () {
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const msg = document.getElementById("register-msg");
    msg.textContent = "";
    if (!username || !password) {
      msg.textContent = "Username and password required.";
      return;
    }
    let users = getUsers();
    if (users.find(u => u.username === username)) {
      msg.textContent = "Username taken.";
      return;
    }
    hash(password).then(pwHash => {
      users.push({ username, password: pwHash });
      writeUsers(users);
      msg.textContent = "Account created! Please login.";
      setTimeout(() => {
        card.classList.remove("flipped");
        document.getElementById("login-username").value = username;
        document.getElementById("login-password").focus();
        document.getElementById("register-username").value = "";
        document.getElementById("register-password").value = "";
        document.getElementById("register-msg").textContent = "";
      }, 1100);
    });
  };
}
