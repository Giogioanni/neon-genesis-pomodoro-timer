document.addEventListener('DOMContentLoaded', () => {
  const timer = document.getElementById('timer');
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const resetButton = document.getElementById('reset');
  const celebration = document.getElementById('celebration');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = musicToggle.querySelector('i');
  const lofiMusic = document.getElementById('lofi-music');
  
  let countdown;
  let totalSeconds = 25 * 60;
  let isRunning = false;
  let musicInitiated = false;

  // Set volume to 45%
  lofiMusic.volume = 0.45;

  // Start music on first user interaction with the page
  function initiateMusic() {
    if (!musicInitiated) {
      lofiMusic.play()
        .then(() => {
          musicIcon.className = 'fas fa-volume-up';
          musicToggle.classList.add('playing');
          musicInitiated = true;
          
          // Add a small notification that music started
          const notification = document.createElement('div');
          notification.textContent = 'Music playing ♫';
          notification.style.position = 'fixed';
          notification.style.bottom = '20px';
          notification.style.right = '20px';
          notification.style.background = 'rgba(1, 255, 56, 0.3)';
          notification.style.padding = '10px';
          notification.style.borderRadius = '5px';
          notification.style.zIndex = '1000';
          notification.style.transition = 'opacity 0.5s ease';
          
          document.body.appendChild(notification);
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(notification);
            }, 500);
          }, 3000);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
      
      // Remove the page-wide click event once music has been initiated
      document.removeEventListener('click', pageClickHandler);
    }
  }

  // Function to handle page clicks
  function pageClickHandler(event) {
    // Don't initiate music if the click is directly on the music toggle button
    // or if the click is on the timer element
    if (!event.target.closest('#music-toggle') && !event.target.closest('#timer')) {
      initiateMusic();
    }
  }

  // Add click event to the entire page
  document.addEventListener('click', pageClickHandler);
  
  // Make timer editable on double click - Use separate inputs for minutes and seconds
  timer.addEventListener('dblclick', function(event) {
    event.stopPropagation(); // Prevent page click from triggering
    
    if (!isRunning) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      // Create a temporary input form
      const timerPosition = timer.getBoundingClientRect();
      const originalText = timer.textContent;
      
      // Create container for inputs
      const inputContainer = document.createElement('div');
      inputContainer.style.position = 'absolute';
      inputContainer.style.top = `${timerPosition.top}px`;
      inputContainer.style.left = `${timerPosition.left}px`;
      inputContainer.style.width = `${timerPosition.width}px`;
      inputContainer.style.height = `${timerPosition.height}px`;
      inputContainer.style.display = 'flex';
      inputContainer.style.alignItems = 'center';
      inputContainer.style.justifyContent = 'center';
      inputContainer.style.zIndex = '1000';
      
      // Minutes input
      const minutesInput = document.createElement('input');
      minutesInput.type = 'number';
      minutesInput.min = '0';
      minutesInput.value = minutes;
      minutesInput.style.background = 'transparent';
      minutesInput.style.border = 'none';
      minutesInput.style.borderBottom = '2px solid #0ff';
      minutesInput.style.color = 'white';
      minutesInput.style.fontSize = '5em';
      minutesInput.style.width = '40%';
      minutesInput.style.textAlign = 'right';
      minutesInput.style.padding = '0';
      minutesInput.style.margin = '0';
      
      // Colon span (not editable)
      const colonSpan = document.createElement('span');
      colonSpan.textContent = ':';
      colonSpan.style.fontSize = '5em';
      colonSpan.style.color = 'white';
      colonSpan.style.margin = '0 5px';
      
      // Seconds input
      const secondsInput = document.createElement('input');
      secondsInput.type = 'number';
      secondsInput.min = '0';
      secondsInput.max = '59';
      secondsInput.value = seconds.toString().padStart(2, '0');
      secondsInput.style.background = 'transparent';
      secondsInput.style.border = 'none';
      secondsInput.style.borderBottom = '2px solid #0ff';
      secondsInput.style.color = 'white';
      secondsInput.style.fontSize = '5em';
      secondsInput.style.width = '40%';
      secondsInput.style.textAlign = 'left';
      secondsInput.style.padding = '0';
      secondsInput.style.margin = '0';
      
      // Add to container
      inputContainer.appendChild(minutesInput);
      inputContainer.appendChild(colonSpan);
      inputContainer.appendChild(secondsInput);
      
      // Hide the timer and show inputs
      timer.style.visibility = 'hidden';
      document.body.appendChild(inputContainer);
      
      // Focus on the minutes input
      minutesInput.focus();
      minutesInput.select();
      
      // Function to handle input submission
      function submitTimerEdit() {
        const newMinutes = parseInt(minutesInput.value) || 0;
        const newSeconds = parseInt(secondsInput.value) || 0;
        
        totalSeconds = newMinutes * 60 + Math.min(newSeconds, 59);
        updateTimerDisplay();
        
        // Remove input container and show timer again
        document.body.removeChild(inputContainer);
        timer.style.visibility = 'visible';
      }
      
      // Event listeners for inputs
      minutesInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          secondsInput.focus();
          secondsInput.select();
        }
      });
      
      secondsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitTimerEdit();
        }
      });
      
      // Submit on blur
      inputContainer.addEventListener('focusout', function(e) {
        // Only submit if the focus is not within the container
        if (!inputContainer.contains(e.relatedTarget)) {
          submitTimerEdit();
        }
      });
    }
  });

  function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    celebration.classList.add('hidden');
    
    countdown = setInterval(() => {
      totalSeconds--;
      updateTimerDisplay();
      
      if (totalSeconds <= 0) {
        clearInterval(countdown);
        isRunning = false;
        celebration.classList.remove('hidden');
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(countdown);
    isRunning = false;
  }

  function resetTimer() {
    stopTimer();
    totalSeconds = 25 * 60;
    updateTimerDisplay();
    celebration.classList.add('hidden');
  }

  // Function to toggle music play/pause
  function toggleMusic(event) {
    event.stopPropagation(); // Prevent the page click from triggering
    
    if (lofiMusic.paused) {
      lofiMusic.play()
        .then(() => {
          musicIcon.className = 'fas fa-volume-up';
          musicToggle.classList.add('playing');
          musicInitiated = true;
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    } else {
      lofiMusic.pause();
      musicIcon.className = 'fas fa-volume-mute';
      musicToggle.classList.remove('playing');
    }
  }

  // Event listeners
  startButton.addEventListener('click', startTimer);
  stopButton.addEventListener('click', stopTimer);
  resetButton.addEventListener('click', resetTimer);
  musicToggle.addEventListener('click', toggleMusic);

  // Initial display
  updateTimerDisplay();
});
