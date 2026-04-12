const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const welcomeMessage = document.getElementById('welcome-message');

const queryForm = document.getElementById('query-form');
const codeForm = document.getElementById('code-form');
const queryInput = document.getElementById('query-input');
const codeInput = document.getElementById('code-input');
const refreshStatus = document.getElementById('refresh-status');
const submissionLog = document.getElementById('submission-log');

const queryNode = document.getElementById('query-node');
const codeNode = document.getElementById('code-node');
const analysisNode = document.getElementById('analysis-node');
const statusNode = document.getElementById('status-node');

const state = {
  lastQuery: '',
  lastCode: ''
};
const MAX_DIAGRAM_NODE_PREVIEW_CHARS = 26;

const crop = (value, length) => {
  if (!value) {
    return '(waiting)';
  }
  return value.length > length ? `${value.slice(0, length)}…` : value;
};

const addLog = (message) => {
  const item = document.createElement('li');
  item.textContent = message;
  submissionLog.prepend(item);
};

const refreshDiagram = () => {
  const query = state.lastQuery.trim();
  const code = state.lastCode.trim();
  const timestamp = new Date().toLocaleString();

  queryNode.textContent = crop(query, MAX_DIAGRAM_NODE_PREVIEW_CHARS);
  codeNode.textContent = crop(code, MAX_DIAGRAM_NODE_PREVIEW_CHARS);

  if (!query && !code) {
    analysisNode.textContent = 'idle';
    statusNode.textContent = 'not generated';
    refreshStatus.textContent = 'Refresh status will appear here after query/code submission.';
    return;
  }

  const queryWords = query ? query.split(/\s+/).filter(Boolean).length : 0;
  const codeLines = code ? code.split(/\r?\n/).length : 0;

  analysisNode.textContent = `${queryWords} words, ${codeLines} lines`;
  statusNode.textContent = 'generated';
  refreshStatus.textContent = `Refresh generated at ${timestamp} for query "${query || '(none)'}" with ${codeLines} code line(s).`;
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const hasValidEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);

  if (!name || !email || !password) {
    loginMessage.textContent = 'Please provide name, email, and password.';
    return;
  }
  if (!hasValidEmail) {
    loginMessage.textContent = 'Please provide a valid email address.';
    return;
  }
  if (password.length < 6) {
    loginMessage.textContent = 'Password must be at least 6 characters.';
    return;
  }

  loginMessage.textContent = 'Login successful.';
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  welcomeMessage.textContent = `Logged in as ${name} (${email})`;
});

queryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.lastQuery = queryInput.value;
  refreshDiagram();
  addLog(`Query submitted (${state.lastQuery.length} chars)`);
});

codeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.lastCode = codeInput.value;
  refreshDiagram();
  addLog(`Code submitted (${state.lastCode.length} chars)`);
});
