const card = document.getElementById('card');
const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const chatgptKey = document.getElementById('chatgptKey');
const newChatgptKey = document.getElementById('newChatgptKey');
const chatgptKeyError = document.getElementById('chatgptKeyError');
const newChatgptKeyError = document.getElementById('newChatgptKeyError');

signupToggle.addEventListener('click', () => {
    card.classList.add('flipped');
});

loginToggle.addEventListener('click', () => {
    card.classList.remove('flipped');
});

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const key = chatgptKey.value;
    
    if (!key || !key.startsWith('sk-')) {
        chatgptKeyError.style.display = 'block';
        return;
    }
    
    chatgptKeyError.style.display = 'none';
    localStorage.setItem('apiKey', key);
    localStorage.setItem('username', username);
    window.location.href = '/bypassai';
});

signupBtn.addEventListener('click', () => {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const key = newChatgptKey.value;
    
    if (!key || !key.startsWith('sk-')) {
        newChatgptKeyError.style.display = 'block';
        return;
    }
    
    newChatgptKeyError.style.display = 'none';
    localStorage.setItem('apiKey', key);
    localStorage.setItem('username', username);
    window.location.href = '/bypassai';
});

window.onload = () => {
    const storedKey = localStorage.getItem('apiKey');
    if (storedKey && storedKey.startsWith('sk-')) {
        window.location.href = '/bypassai';
    }
};
