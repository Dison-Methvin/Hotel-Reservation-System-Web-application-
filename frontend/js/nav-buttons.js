document.addEventListener('DOMContentLoaded', () => {
  // Attach handlers to all Register and Sign-In buttons that may appear in the header.
  document.querySelectorAll('.register-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'signup.html';
    });
  });

  document.querySelectorAll('.signin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  });
}); 