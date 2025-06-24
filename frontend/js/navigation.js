// Navigation and button click handlers
document.addEventListener('DOMContentLoaded', function() {
    // Function to get current page name
    const getCurrentPage = () => {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        return page || 'home.html';
    };

    // Call setupNavLinks immediately
    setupNavLinks();

    // Update current page in navigation
    const currentPage = getCurrentPage();
    const allNavLinks = document.querySelectorAll('.left-nav a, .right-nav a');
    allNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Header button handlers
    const registerBtn = document.querySelector('.register-btn');
    const signinBtn = document.querySelector('.signin-btn');
    const signoutBtn = document.querySelector('.signout-btn');
    
    // Authentication buttons
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    if (signinBtn) {
        signinBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    if (signoutBtn) {
        signoutBtn.addEventListener('click', function() {
            // Add any logout logic here
            window.location.href = 'home.html';
        });
    }    // Navigation links handlers
    const setupNavLinks = () => {
        // Navigation link mappings
        const navMappings = {
            'HOME': 'home.html',
            'SERVICES': 'Services.html',
            'RESERVATIONS': 'reservations.html',
            'MY BOOKINGS': 'YourBookings.html',
            'ABOUT US': 'AboutUs.html',
            'CONTACT US': 'ContactUs.html',
            'GALLERY': 'Gallery.html'
        };

        // Update all navigation links
        document.querySelectorAll('.left-nav a, .right-nav a').forEach(link => {
            const text = link.textContent.trim();
            if (navMappings[text]) {
                link.href = navMappings[text];
                
                // Check if this is the current page
                const currentPage = window.location.pathname.split('/').pop() || 'home.html';
                if (navMappings[text].toLowerCase() === currentPage.toLowerCase()) {
                    link.classList.add('active');
                }
            }
        });

        // Logo click handler
        const logo = document.querySelector('.logo-container img');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', () => {
                window.location.href = 'home.html';
            });
        }
    };

    // Set up navigation links
    setupNavLinks();

    // Learn more button handler
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            window.location.href = 'AboutUs.html';
        });
    }

    // Update current date in the header if it exists
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = date.toLocaleDateString('en-US', options);
    }

    const authLinks = document.querySelectorAll('.auth-links');
    const userMenu = document.querySelector('.user-menu');
    const logoutBtn = document.querySelector('.logout-btn');
    const usernameDisplay = document.querySelector('.username-display');

    // Check authentication state
    const updateNavigation = () => {
        const isAuthenticated = window.authManager.checkAuth();
        const currentUser = window.authManager.getCurrentUser();

        authLinks.forEach(link => {
            if (isAuthenticated) {
                // Show user menu, hide auth links
                link.style.display = 'none';
                if (userMenu) userMenu.style.display = 'block';
                if (usernameDisplay) usernameDisplay.textContent = currentUser?.username || 'User';
            } else {
                // Show auth links, hide user menu
                link.style.display = 'block';
                if (userMenu) userMenu.style.display = 'none';
            }
        });
    };

    // Initial update
    updateNavigation();

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.authManager.logout();
            updateNavigation();
        });
    }

    // Update navigation when auth state changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'token' || e.key === 'user') {
            updateNavigation();
        }
    });
});
