document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const toggleBtn = document.getElementById('toggleVisibility');
  const statusDiv = document.getElementById('status');

  // Load saved API key
  chrome.storage.sync.get(['openaiApiKey'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
      showStatus('API key loaded', 'info');
    }
  });

  // Toggle password visibility
  toggleBtn.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    toggleBtn.title = isPassword ? 'Hide API key' : 'Show API key';
  });

  // Save API key
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      showStatus('Invalid API key format. Keys should start with "sk-"', 'error');
      return;
    }

    chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
      if (chrome.runtime.lastError) {
        showStatus('Error saving API key: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showStatus('API key saved successfully!', 'success');
      }
    });
  });

  // Handle Enter key
  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;

    if (type === 'success') {
      setTimeout(() => {
        statusDiv.className = 'status';
      }, 3000);
    }
  }
});
