class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.baseUrl = 'http://localhost:3000/api'; // Update this with your backend URL
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.isAuthenticated = true;
            this.currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async register(username, email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/html/index.html';
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(user);
            return true;
        }
        return false;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Create a global instance
window.authManager = new AuthManager();
