# Hotel Reservation System

**Author:** Dison Methvin

A comprehensive web-based hotel reservation system for managing room bookings, customer information, and billing operations.

## Tech Stack

- **Frontend**: HTML, CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
hotel-reservation-system/
├── frontend/               # React frontend application
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── assets/        # Images, fonts, etc.
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── store/         # State management
│       ├── types/         # TypeScript types
│       └── utils/         # Utility functions
│
├── backend/               # Node.js backend application
│   ├── src/              # Source files
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── tests/            # Backend tests
│
└── docs/                 # Documentation
```

## Features

- Customer reservation management
- Room management
- Check-in/Check-out processing
- Billing and payment processing
- Report generation
- Travel company booking management
- Residential suite reservations
- Admin dashboard
- Customer portal

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Set up environment variables
5. Start the development servers

## Environment Variables

Create `.env` files in both frontend and backend directories with the following variables:

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-reservation
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## License

MIT
