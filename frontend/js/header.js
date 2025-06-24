document.addEventListener('DOMContentLoaded', () => {
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.querySelector('.user-info');
    const usernameSpan = userInfo.querySelector('.username');
    const datetimeSpan = userInfo.querySelector('.datetime');
    const logoutBtn = userInfo.querySelector('.logout-btn');
    const registerBtn = document.querySelector('.register-btn');
    const signinBtn = document.querySelector('.signin-btn');

    // Function to update datetime
    const updateDateTime = () => {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        datetimeSpan.textContent = now.toLocaleDateString('en-US', options);
    };

    // Function to check auth state and update UI
    const updateAuthUI = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
            // User is logged in
            authButtons.style.display = 'none';
            userInfo.style.display = 'flex';
            usernameSpan.textContent = user.username;
            updateDateTime();
        } else {
            // User is logged out
            authButtons.style.display = 'flex';
            userInfo.style.display = 'none';
        }
    };

    // Update datetime every minute
    setInterval(updateDateTime, 60000);

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        updateAuthUI();
        window.location.href = 'login.html';
    });

    // Handle register button click
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }

    // Handle signin button click
    if (signinBtn) {
        signinBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Initial UI update
    updateAuthUI();
});
