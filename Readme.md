# Event Calendar Application

## Overview

This is a full-stack Event Calendar application built with React for the frontend and Node.js with Express for the backend. It allows users to sign up, log in, and manage their events through an interactive calendar interface.

## Features

- User authentication (signup and login)
- Interactive calendar view
- Create, read, update, and delete events
- Responsive design for both light and dark modes

## Tech Stack

### Frontend
- React
- Vite
- React Big Calendar
- Axios for API calls
- CSS for styling

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL database
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing


## Setup and Installation

### Prerequisites
- Node.js
- PostgreSQL

### Backend Setup
1. Navigate to the `backend` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your `.env` file with your PostgreSQL database URL and JWT secret:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   JWT_SECRET="your_secret_key"
   ```
4. Run Prisma migrations:
   ```
   npx prisma migrate dev
   ```
5. Start the server:
   ```
   node index.js
   ```

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Open your browser and go to `http://localhost:5173` (or the port Vite is running on)
2. Sign up for a new account or log in
3. Use the calendar interface to view, create, edit, or delete events

## API Endpoints

- POST `/signup`: Create a new user account
- POST `/login`: Authenticate a user and receive a JWT
- GET `/events`: Retrieve all events for the authenticated user
- POST `/events`: Create a new event
- PUT `/events/:id`: Update an existing event
- DELETE `/events/:id`: Delete an event

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE)
