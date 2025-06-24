document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const generalError = document.getElementById('general-error');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const successMessage = document.getElementById('success-message');

    // Initialize API service
    const apiService = new ApiService();

    // Function to show error message
    const showError = (elementId, message) => {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.style.display = 'block';
    };

    // Function to clear all error messages
    const clearErrors = () => {
        generalError.style.display = 'none';
        usernameError.style.display = 'none';
        passwordError.style.display = 'none';
        successMessage.style.display = 'none';
    };

    // Function to set loading state
    const setLoading = (isLoading) => {
        loginButton.disabled = isLoading;
        loginButton.textContent = isLoading ? 'Logging in...' : 'Login';
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation
        let hasError = false;
        
        if (!username) {
            showError('username-error', 'Username is required');
            hasError = true;
        }

        if (!password) {
            showError('password-error', 'Password is required');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store the token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Show success message briefly before redirecting
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            showError('general-error', error.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    });

    // Handle "Remember me" checkbox
    const rememberCheckbox = document.getElementById('remember');
    if (rememberCheckbox) {
        rememberCheckbox.checked = localStorage.getItem('remember') === 'true';
        rememberCheckbox.addEventListener('change', () => {
            localStorage.setItem('remember', rememberCheckbox.checked);
        });
    }

    // Handle social login buttons
    const googleBtn = document.querySelector('.google');
    const appleBtn = document.querySelector('.apple');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showError('general-error', 'Google sign-in is not yet implemented');
        });
    }

    if (appleBtn) {
        appleBtn.addEventListener('click', () => {
            showError('general-error', 'Apple sign-in is not yet implemented');
        });
    }
});
