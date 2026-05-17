// ==========================================================================
// WHISPERISLAND LANDING PAGE INTERACTION CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupCapsuleSimulator();
  setupTabSystem();
});

// --- 1. Tab System ---
function setupTabSystem() {
  window.openTab = function(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].classList.remove('active');
    }

    const tabLinks = document.getElementsByClassName('tab-link');
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
  };
}

// --- 2. Live Capsule & Typing Simulator ---
function setupCapsuleSimulator() {
  const capsule = document.getElementById('mock-capsule');
  const micBtn = document.getElementById('mock-mic-btn');
  const statusText = document.getElementById('mock-status');
  const timerText = document.getElementById('mock-timer');
  const canvas = document.getElementById('mock-canvas');
  const textarea = document.getElementById('mock-textarea');
  const cursor = document.getElementById('mock-cursor');
  const autoDemoBtn = document.getElementById('trigger-playground-btn');
  
  // Icon selectors
  const iconMic = micBtn.querySelector('.mock-icon-mic');
  const iconStop = micBtn.querySelector('.mock-icon-stop');

  // Step instruction highlights
  const step1 = document.querySelector('.step-1');
  const step2 = document.querySelector('.step-2');
  const step3 = document.querySelector('.step-3');

  let state = 'IDLE'; // IDLE, RECORDING, TRANSCRIBING, PASTING
  let timerInterval = null;
  let seconds = 0;
  let waveAnimationId = null;

  // Canvas visualizer details
  const ctx = canvas.getContext('2d');
  let wavePhase = 0;

  // Transcription text payload
  const demoText = "WhisperIsland is officially the easiest way to write with my voice on Windows! 🚀🧡";

  // A. Expand Capsule on Hover
  capsule.addEventListener('mouseenter', () => {
    if (state === 'IDLE') {
      capsule.classList.remove('mock-idle');
      capsule.classList.add('mock-expanded');
      statusText.textContent = "Ready to record (Click Mic)";
      highlightStep(step2);
    }
  });

  // B. Retract Capsule on Mouse Leave
  capsule.addEventListener('mouseleave', () => {
    if (state === 'IDLE') {
      capsule.classList.remove('mock-expanded');
      capsule.classList.add('mock-idle');
      statusText.textContent = "Hover to expand capsule";
      highlightStep(step1);
    }
  });

  // C. Click Mic Button to Toggle recording
  micBtn.addEventListener('click', () => {
    if (state === 'IDLE') {
      startRecording();
    } else if (state === 'RECORDING') {
      stopRecordingAndTranscribe();
    }
  });

  // D. Run Auto-Demo Button
  autoDemoBtn.addEventListener('click', () => {
    if (state !== 'IDLE') return; // Only allow when idle
    autoDemoBtn.disabled = true;
    autoDemoBtn.textContent = "Demo Running... 🛸";

    // Step 1: Hover/Expand Capsule
    capsule.classList.remove('mock-idle');
    capsule.classList.add('mock-expanded');
    statusText.textContent = "Ready to record...";
    highlightStep(step2);

    // Step 2: Start Recording after 1 second
    setTimeout(() => {
      startRecording();
      
      // Step 3: Record for 3.5 seconds, then stop & transcribe
      setTimeout(() => {
        stopRecordingAndTranscribe(() => {
          // Reset Auto-Demo button once typing is completely done
          setTimeout(() => {
            autoDemoBtn.disabled = false;
            autoDemoBtn.textContent = "Launch Auto-Demo! ⚡";
          }, demoText.length * 30 + 2000);
        });
      }, 3500);

    }, 1000);
  });

  // --- Core Simulation Functions ---

  function startRecording() {
    state = 'RECORDING';
    micBtn.classList.add('active');
    iconMic.classList.add('hidden');
    iconStop.classList.remove('hidden');
    
    // Toggle Status Panel Views
    statusText.classList.add('hidden');
    timerText.classList.remove('hidden');
    canvas.classList.remove('hidden');
    cursor.style.display = 'block';

    highlightStep(step3);
    textarea.value = "";
    textarea.placeholder = "Listening to your microphone...";

    // Start Timer
    seconds = 0;
    timerText.textContent = "00:00";
    timerInterval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      timerText.textContent = `${mins}:${secs}`;
    }, 1000);

    // Start Drawing Canvas Waves
    waveAnimationId = requestAnimationFrame(drawAudioWave);
  }

  function stopRecordingAndTranscribe(callback) {
    state = 'TRANSCRIBING';
    
    // Stop recording indicators
    micBtn.classList.remove('active');
    iconStop.classList.add('hidden');
    iconMic.classList.remove('hidden');

    clearInterval(timerInterval);
    cancelAnimationFrame(waveAnimationId);

    // Show Loader State
    timerText.classList.add('hidden');
    canvas.classList.add('hidden');
    statusText.classList.remove('hidden');
    statusText.textContent = "Transcribing... (via Groq Cloud)";
    textarea.placeholder = "Uploading buffer and analyzing voice...";

    // 1. Simulate API Latency (1.5 seconds)
    setTimeout(() => {
      statusText.textContent = "Auto-Pasting...";
      state = 'PASTING';
      
      // 2. Simulate typing transcription
      setTimeout(() => {
        typeWriterEffect(demoText, 0, () => {
          // Complete and Success pulse
          statusText.textContent = "Success! (Clipboard Restored)";
          textarea.placeholder = "Text auto-pasted successfully!";
          
          setTimeout(() => {
            // Shrink back to idle
            state = 'IDLE';
            capsule.classList.remove('mock-expanded');
            capsule.classList.add('mock-idle');
            statusText.textContent = "Hover to expand capsule";
            cursor.style.display = 'none';
            highlightStep(step1);
            if (callback) callback();
          }, 1500);

        });
      }, 400);

    }, 1500);
  }

  // E. Helper: Interactive Steps Highlighter
  function highlightStep(activeStep) {
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
    activeStep.classList.add('active');
  }

  // F. Helper: Typwriter typing script
  function typeWriterEffect(text, index, doneCallback) {
    if (index < text.length) {
      textarea.value = text.substring(0, index + 1);
      
      // Keep cursor positioned at the end
      const textLength = textarea.value.length;
      textarea.selectionStart = textLength;
      textarea.selectionEnd = textLength;
      
      // Calculate cursor position dynamically
      const charWidth = 8.4; // Average Courier font character spacing
      cursor.style.left = `${charWidth * textLength}px`;

      setTimeout(() => {
        typeWriterEffect(text, index + 1, doneCallback);
      }, 30); // 30ms per character typing speed
    } else {
      if (doneCallback) doneCallback();
    }
  }

  // G. Helper: Sine Wave Visualizer Drawer
  function drawAudioWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'hsl(24, 100%, 65%)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const amp = state === 'RECORDING' ? 6 : 0; // Amplitude of sine wave
    wavePhase += 0.15;

    for (let x = 0; x < canvas.width; x++) {
      // Create multi-frequency breathing sine wave
      const y = (canvas.height / 2) + 
                Math.sin(x * 0.08 + wavePhase) * amp + 
                Math.cos(x * 0.05 - wavePhase) * (amp * 0.5);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    waveAnimationId = requestAnimationFrame(drawAudioWave);
  }
}
