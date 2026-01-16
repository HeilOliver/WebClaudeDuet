// Content script for Voice Input extension
// Injects microphone button into Claude's chat interface

(function() {
  'use strict';

  let mediaRecorder = null;
  let audioChunks = [];
  let recordingStartTime = null;
  let timerInterval = null;
  let microphoneButton = null;
  let recordingPopup = null;

  // SVG icons
  const microphoneIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>`;

  const stopIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2"></rect>
  </svg>`;

  // Initialize extension
  function init() {
    // Try to inject immediately
    injectMicrophoneButton();

    // Set up observer for SPA navigation
    const observer = new MutationObserver((mutations) => {
      // Check if we need to re-inject the button
      if (!document.querySelector('.voice-input-mic-btn')) {
        injectMicrophoneButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Find the chat input container and inject the microphone button
  function injectMicrophoneButton() {
    // Find the footer bar with buttons
    const chatInput = document.querySelector('div[data-testid="chat-input"]');
    if (!chatInput) return;

    // Find the parent container that has the footer buttons
    const footerContainer = chatInput.closest('.flex.flex-col.gap-3')?.querySelector('.flex.gap-2.w-full.items-center');
    if (!footerContainer) return;

    // Find the button container (first child with relative class)
    const buttonContainer = footerContainer.querySelector('.relative.flex-1.flex.items-center');
    if (!buttonContainer) return;

    // Check if already injected
    if (buttonContainer.querySelector('.voice-input-mic-btn')) return;

    // Create microphone button
    microphoneButton = document.createElement('button');
    microphoneButton.className = 'voice-input-mic-btn';
    microphoneButton.title = 'Voice input';
    microphoneButton.innerHTML = microphoneIcon;
    microphoneButton.addEventListener('click', handleMicrophoneClick);

    // Insert after the extended thinking button
    const extendedThinkingBtn = buttonContainer.querySelector('[aria-label="Extended thinking"]')?.parentElement;
    if (extendedThinkingBtn) {
      extendedThinkingBtn.after(microphoneButton);
    } else {
      // Fallback: insert at beginning of button container
      buttonContainer.insertBefore(microphoneButton, buttonContainer.firstChild);
    }
  }

  // Handle microphone button click
  async function handleMicrophoneClick() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      stopRecording();
    } else {
      await startRecording();
    }
  }

  // Start recording audio
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        // Process the recording
        await processRecording();
      };

      mediaRecorder.start();
      recordingStartTime = Date.now();

      // Update button state
      microphoneButton.classList.add('recording');
      microphoneButton.innerHTML = stopIcon;

      // Show recording popup
      showRecordingPopup();

    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        showToast('Microphone access denied. Please allow microphone access in your browser settings.', 'error');
      } else {
        showToast('Error starting recording: ' + error.message, 'error');
      }
    }
  }

  // Stop recording
  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();

      // Reset button state
      microphoneButton.classList.remove('recording');
      microphoneButton.innerHTML = microphoneIcon;

      // Clear timer
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }

  // Process the recorded audio
  async function processRecording() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

    // Check if recording is too short
    if (audioBlob.size < 1000) {
      hideRecordingPopup();
      showToast('Recording too short. Please try again.', 'error');
      return;
    }

    // Update popup to show transcribing state
    updatePopupState('transcribing');

    // Convert blob to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = reader.result;

      try {
        // Send to background script for transcription
        const response = await chrome.runtime.sendMessage({
          action: 'transcribe',
          audioData: base64Audio
        });

        hideRecordingPopup();

        if (response.error) {
          showToast(response.error, 'error');
        } else if (response.transcript) {
          insertTranscript(response.transcript);
          showToast('Transcription complete!', 'success');
        }
      } catch (error) {
        hideRecordingPopup();
        showToast('Error transcribing audio: ' + error.message, 'error');
      }
    };
    reader.readAsDataURL(audioBlob);
  }

  // Insert transcript into chat input at cursor position
  function insertTranscript(text) {
    const chatInput = document.querySelector('div[data-testid="chat-input"]');
    if (!chatInput) {
      showToast('Could not find chat input', 'error');
      return;
    }

    // Focus the input
    chatInput.focus();

    // Use execCommand to insert text at cursor position
    // This works with contenteditable elements and triggers proper state updates
    document.execCommand('insertText', false, text);

    // Dispatch input event to ensure React/ProseMirror picks up the change
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text
    });
    chatInput.dispatchEvent(inputEvent);
  }

  // Show recording popup in bottom-right corner
  function showRecordingPopup() {
    if (recordingPopup) {
      recordingPopup.remove();
    }

    recordingPopup = document.createElement('div');
    recordingPopup.className = 'voice-input-popup';
    recordingPopup.innerHTML = `
      <div class="voice-input-popup-content">
        <div class="voice-input-popup-header">
          <div class="voice-input-recording-indicator"></div>
          <span>Recording...</span>
        </div>
        <div class="voice-input-timer">00:00</div>
        <button class="voice-input-stop-btn">
          ${stopIcon}
          <span>Stop Recording</span>
        </button>
      </div>
    `;

    // Add event listener to stop button
    recordingPopup.querySelector('.voice-input-stop-btn').addEventListener('click', stopRecording);

    document.body.appendChild(recordingPopup);

    // Start timer
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    // Animate in
    requestAnimationFrame(() => {
      recordingPopup.classList.add('visible');
    });
  }

  // Update popup state (recording/transcribing)
  function updatePopupState(state) {
    if (!recordingPopup) return;

    if (state === 'transcribing') {
      recordingPopup.innerHTML = `
        <div class="voice-input-popup-content">
          <div class="voice-input-popup-header">
            <div class="voice-input-spinner"></div>
            <span>Transcribing...</span>
          </div>
          <div class="voice-input-subtext">Please wait</div>
        </div>
      `;
    }
  }

  // Hide recording popup
  function hideRecordingPopup() {
    if (recordingPopup) {
      recordingPopup.classList.remove('visible');
      setTimeout(() => {
        recordingPopup?.remove();
        recordingPopup = null;
      }, 200);
    }
  }

  // Update timer display
  function updateTimer() {
    if (!recordingPopup || !recordingStartTime) return;

    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');

    const timerElement = recordingPopup.querySelector('.voice-input-timer');
    if (timerElement) {
      timerElement.textContent = `${minutes}:${seconds}`;
    }
  }

  // Show toast notification
  function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.voice-input-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `voice-input-toast voice-input-toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 200);
    }, 4000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
