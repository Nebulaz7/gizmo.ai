// joshua code
// ocal storage code
const userNameInput = document.getElementById('userName');
const getStartedBtn = document.getElementById('getStarted');
const errorDiv = document.getElementById('error');

// Showing the error messge
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
  setTimeout(() => {
    errorDiv.classList.remove('show');
  }, 3000);
}

function saveUserAndRedirect(userName) {
  try {
    // Saving to localStorage
    localStorage.setItem('gizmoUser', JSON.stringify({
      name: userName,
      dateCreated: new Date()
    }));

    // Redirect to main page
    window.location.href = 'main.html';
  } catch (error) {
    showError('Failed to save user data. Please try again.');
  }
}


getStartedBtn.addEventListener('click', () => {
  const userName = userNameInput.value.trim();

  if (!userName) {
    showError('Please enter your name to continue');
    return;
  }

  if (userName.length < 3) {
    showError('Name must be at least 3 characters long');
    return;
  }

  saveUserAndRedirect(userName);
});


userNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getStartedBtn.click();
  }
});