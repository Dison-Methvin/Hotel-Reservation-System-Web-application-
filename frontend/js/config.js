const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login',
            STAFF_LOGIN: '/auth/staff/login',
            COMPANY_LOGIN: '/auth/company/login'
        },
        ROOMS: {
            GET_ALL: '/rooms',
            GET_AVAILABLE: '/rooms/available',
            GET_BY_TYPE: '/rooms/type'
        },
        RESERVATIONS: {
            CREATE: '/reservations',
            GET_USER_RESERVATIONS: '/reservations/user',
            UPDATE: '/reservations',
            CANCEL: '/reservations/cancel'
        },
        PROFILE: {
            GET: '/customers/profile',
            UPDATE: '/customers/profile'
        }
    }
};
