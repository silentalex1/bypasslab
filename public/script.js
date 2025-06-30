async function hash(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function setToken(token) {
  localStorage.setItem("batprox_token", token);
}
async function getUsers() {
  let users = localStorage.getItem("batprox_users");
  if (!users) {
    localStorage.setItem("batprox_users", JSON.stringify([]));
    users = "[]";
  }
  return JSON.parse(users);
}
async function writeUsers(users) {
  localStorage.setItem("batprox_users", JSON.stringify(users));
}
async function createToken(username) {
  return btoa(username + "|" + Date.now());
}

const card = document.getElementById("auth-card");
const cardInner = document.getElementById("card-inner");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const toRegisterBtn = document.getElementById("to-register-btn");
const toLoginBtn = document.getElementById("to-login-btn");

toRegisterBtn.onclick = function () {
  card.classList.add("flipped");
};
toLoginBtn.onclick = function () {
  card.classList.remove("flipped");
};

loginBtn.onclick = async function () {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");
  msg.textContent = "";
  if (!username || !password) {
    msg.textContent = "Username and password required.";
    return;
  }
  const users = await getUsers();
  const pwHash = await hash(password);
  const user = users.find(u => u.username === username && u.password === pwHash);
  if (!user) {
    msg.textContent = "Invalid login.";
    return;
  }
  setToken(await createToken(username));
  window.location.href = "/home/home.html";
};

registerBtn.onclick = async function () {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const msg = document.getElementById("register-msg");
  msg.textContent = "";
  if (!username || !password) {
    msg.textContent = "Username and password required.";
    return;
  }
  let users = await getUsers();
  if (users.find(u => u.username === username)) {
    msg.textContent = "Username taken.";
    return;
  }
  const pwHash = await hash(password);
  users.push({ username, password: pwHash });
  await writeUsers(users);
  msg.textContent = "Account created! Please login.";
  setTimeout(() => {
    card.classList.remove("flipped");
    document.getElementById("login-username").value = username;
    document.getElementById("login-password").focus();
    document.getElementById("register-username").value = "";
    document.getElementById("register-password").value = "";
    document.getElementById("register-msg").textContent = "";
  }, 1100);
};
