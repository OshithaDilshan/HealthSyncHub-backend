# Health Sync Hub - Backend

This is the backend server for the Health Sync Hub application, built with Node.js, Express, and MongoDB.

## Features

- User registration and authentication
- JWT-based authentication
- Protected routes
- User profile management
- MongoDB database integration

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "firstName": "John", "lastName": "Doe", "email": "john@example.com", "password": "password123" }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "john@example.com", "password": "password123" }`

- `GET /api/auth/profile` - Get user profile (protected route)
  - Headers: `Authorization: Bearer <token>`

## Environment Variables

- `NODE_ENV` - Application environment (development/production)
- `PORT` - Port to run the server on
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation

## License

This project is licensed under the MIT License.
