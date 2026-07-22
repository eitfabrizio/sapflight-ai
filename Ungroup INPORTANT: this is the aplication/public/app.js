// SapFlight AI - App Core Logic
const chatContainer = document.getElementById('chat-container');
const queryInput = document.getElementById('query');
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const settingsModal = document.getElementById('settings-modal');
const historyList = document.getElementById('history-list');
const updateBanner = document.getElementById('update-banner');
const restartBtn = document.getElementById('restart-btn');

// State
let currentUser = null;
let currentTheme = localStorage.getItem('sapflight-theme') || 'dark';
let currentModel = localStorage.getItem('sapflight-model') || 'llama3:8b';
let chats = [];
try {
  chats = JSON.parse(localStorage.getItem('sapflight-chats')) || [];
} catch (e) { chats = []; }
let currentChat = { id: Date.now(), messages: [], title: 'Nueva Misión' };

// --- Initialization ---
function init() {
  setTheme(currentTheme);
  renderHistory();
  
  // Load settings UI
  document.getElementById('model-select').value = currentModel;
  const savedLang = localStorage.getItem('sapflight-lang') || 'es';
  document.getElementById('lang-select').value = savedLang;
  
  // Auto-Update Handlers
  if (window.electronAPI) {
    window.electronAPI.onUpdateAvailable(() => {
      updateBanner.classList.remove('hidden');
    });
    window.electronAPI.onUpdateDownloaded(() => {
      updateBanner.innerHTML = '✨ Actualización lista.';
      restartBtn.classList.remove('hidden');
      updateBanner.appendChild(restartBtn);
    });
  }

  const savedUser = localStorage.getItem('sapflight-user');
  if (savedUser) login(savedUser);
}

// --- Update Logic ---
function restartApp() {
  window.electronAPI.restartApp();
}

// --- Settings Functions ---
function setModel(model) {
  currentModel = model;
  localStorage.setItem('sapflight-model', model);
}

function updateProfileName(newName) {
  if (!newName) return;
  currentUser = newName;
  localStorage.setItem('sapflight-user', newName);
  document.getElementById('display-username').innerText = newName;
}

function setLanguage(lang) { localStorage.setItem('sapflight-lang', lang); }

function toggleAnimations(enabled) {
  localStorage.setItem('sapflight-anim', enabled);
  enabled ? document.body.classList.remove('no-animations') : document.body.classList.add('no-animations');
}

function exportCurrentChat() {
  if (currentChat.messages.length === 0) return alert('No hay mensajes para exportar.');
  let text = `Bitácora de SapFlight AI - ${currentChat.title}\n`;
  text += `Fecha: ${new Date(currentChat.id).toLocaleString()}\n\n`;
  currentChat.messages.forEach(m => {
    text += `${m.isUser ? 'PILOTO' : 'SAPFLIGHT AI'}: ${m.text}\n\n`;
  });
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sapflight-chat-${currentChat.id}.txt`;
  a.click();
}

function clearAllHistory() {
  if (confirm('¿Confirmar purga total de datos?')) {
    chats = []; localStorage.removeItem('sapflight-chats');
    renderHistory(); startNewChat(); toggleSettings();
  }
}

// --- Auth ---
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    if (user) login(user);
  });
}

function login(username) {
  currentUser = username;
  localStorage.setItem('sapflight-user', username);
  document.getElementById('display-username').innerText = username;
  document.getElementById('edit-username').value = username;
  loginScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');
  showView('chat');
}

function logout() { localStorage.removeItem('sapflight-user'); window.location.reload(); }

function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('sapflight-theme', theme);
}

function toggleSettings() { settingsModal.classList.toggle('hidden'); }

// --- Navigation ---
function showView(view) {
  const views = { chat: document.getElementById('chat-view'), history: document.getElementById('history-view'), flights: document.getElementById('flights-view'), map: document.getElementById('map-view') };
  Object.values(views).forEach(v => v && v.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (views[view]) {
    views[view].classList.remove('hidden');
    const btn = document.querySelector(`button[onclick="showView('${view}')"]`);
    if (btn) btn.classList.add('active');
    if (view === 'chat') document.getElementById('view-title').innerText = currentChat.title;
    else if (view === 'history') renderFullHistory();
  }
}

// --- Chat Engine (Turbo Streaming) ---
function appendMessage(text, isUser = false, animate = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'} ${animate ? 'animate-in' : ''}`;
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'avatar-sm';
  avatarDiv.innerHTML = isUser ? '<i class="fas fa-user-pilot"></i>' : '<i class="fas fa-robot"></i>';
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'bubble';
  bubbleDiv.innerText = text;
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(bubbleDiv);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
  return bubbleDiv;
}

async function buscar() {
  const q = queryInput.value.trim();
  if (!q) return;
  queryInput.value = '';
  
  appendMessage(q, true);
  currentChat.messages.push({ text: q, isUser: true });
  if (currentChat.messages.length === 1) {
    currentChat.title = q.substring(0, 25);
    document.getElementById('view-title').innerText = currentChat.title;
  }

  const aiBubble = appendMessage("", false);
  let fullAiResponse = "";

  try {
    const currentLang = localStorage.getItem('sapflight-lang') || 'es';
    const res = await fetch('http://localhost:3000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, language: currentLang, model: currentModel })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullAiResponse += decoder.decode(value, { stream: true });
      aiBubble.innerText = fullAiResponse;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    currentChat.messages.push({ text: fullAiResponse, isUser: false });
    updateChatInHistory();

  } catch (error) { aiBubble.innerText = "Error de enlace con el servidor."; }
}

function updateChatInHistory() {
  const index = chats.findIndex(c => c.id === currentChat.id);
  if (index >= 0) chats[index] = JSON.parse(JSON.stringify(currentChat));
  else chats.unshift(JSON.parse(JSON.stringify(currentChat)));
  localStorage.setItem('sapflight-chats', JSON.stringify(chats));
  renderHistory();
}

function startNewChat() {
  currentChat = { id: Date.now(), messages: [], title: 'Nueva Misión' };
  chatContainer.innerHTML = '';
  showView('chat');
}

function loadChat(id) {
  const chat = chats.find(c => c.id === id);
  if (chat) {
    currentChat = JSON.parse(JSON.stringify(chat));
    chatContainer.innerHTML = '';
    currentChat.messages.forEach(m => appendMessage(m.text, m.isUser, false));
    showView('chat');
  }
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = '';
  chats.slice(0, 8).forEach(chat => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerText = chat.title;
    item.onclick = () => loadChat(chat.id);
    historyList.appendChild(item);
  });
}

function renderFullHistory() {
  const container = document.getElementById('full-history-list');
  if (!container) return;
  container.innerHTML = chats.length === 0 ? '<p style="padding: 20px;">Historial vacío.</p>' : '';
  chats.forEach(chat => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.style.cssText = 'background: var(--sidebar-bg); margin: 10px 20px; padding: 15px; border-radius: 12px; cursor: pointer; border: 1px solid var(--glass-border);';
    card.innerHTML = `<h4 style="color: white;">${chat.title}</h4><p style="color: gray;">${chat.messages.length} entradas</p>`;
    card.onclick = () => loadChat(chat.id);
    container.appendChild(card);
  });
}

if (queryInput) queryInput.addEventListener('keypress', (e) => e.key === 'Enter' && buscar());
init();
