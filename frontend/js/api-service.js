class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:5000/api'; // Set the base URL directly
        this.token = localStorage.getItem('token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Remove authentication token
    removeToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Get request headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Generic API call method
    async fetchAPI(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders();
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            }
        });

        const contentType = response.headers.get('content-type') || '';

        // Attempt to parse JSON if possible
        const parseBody = async () => {
            if (contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        };

        const data = await parseBody();

        if (!response.ok) {
            // If the body was text/html, show generic message
            const message = typeof data === 'object' ? (data.message || 'API request failed') : data;
            throw new Error(message);
        }

        return data;
    }

    // Authentication methods
    async login(email, password) {
        return this.fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Create a new reservation
    async createReservation(reservationData) {
        return this.fetchAPI('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    }

    // Get user's reservations
    async getReservations() {
        return this.fetchAPI('/reservations', {
            method: 'GET'
        });
    }
}
