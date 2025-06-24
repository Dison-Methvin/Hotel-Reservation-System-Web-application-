document.addEventListener('DOMContentLoaded', () => {
    console.log('Signup script loaded');
    
    const signupForm = document.getElementById('signupForm');
    console.log('Form element found:', signupForm !== null);

    // Initialize API service
    const apiService = new ApiService();

    if (!signupForm) {
        console.error('Signup form not found!');
        return;
    }

    signupForm.addEventListener('submit', async (e) => {
        console.log('Form submit event triggered');
        e.preventDefault();
        
        // Get all form data using FormData API
        const formData = new FormData(signupForm);
        
        // Create the data object
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            phoneNumber: formData.get('phoneNumber'),
            address: {
                houseNo: formData.get('houseNo'),
                lane: formData.get('laneName'),
                city: formData.get('cityName')
            }
        };

        console.log('Form data collected:', {
            ...userData,
            password: '*****' // Hide password in logs
        });

        // Get the submit button
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Signing up...';

        // Validation
        if (!userData.firstName || !userData.lastName || !userData.username || 
            !userData.phoneNumber || !userData.email || !userData.password || 
            !userData.address.houseNo || !userData.address.lane || !userData.address.city) {
            console.log('Validation failed: Missing fields');
            alert('Please fill in all fields');
            submitButton.disabled = false;
            submitButton.textContent = 'Signup';
            return;
        }

        if (userData.password.length < 6) {
            console.log('Validation failed: Password too short');
            alert('Password must be at least 6 characters long');
            submitButton.disabled = false;
            submitButton.textContent = 'Signup';
            return;
        }

        try {
            console.log('Sending registration request to backend...');
            await apiService.register(userData);
            console.log('Registration successful');
            
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message || 'An error occurred during registration');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Signup';
        }
    });

    // Handle sign in link click
    signInLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/html/login.html';
    });

    // Handle social signup buttons
    const googleBtn = document.querySelector('.google');
    const appleBtn = document.querySelector('.apple');

    googleBtn.addEventListener('click', () => {
        alert('Google sign-up functionality will be implemented soon');
    });

    appleBtn.addEventListener('click', () => {
        alert('Apple sign-up functionality will be implemented soon');
    });

    console.log('Form event listener attached');
});
