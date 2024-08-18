# ShopSeek

The backend for **ShopSeek** is built using Node.js and Express.js, with MongoDB as the database. This server handles all API requests for products, including search, filtering, pagination, and sorting. It also includes Firebase authentication for Google and Email/Password login.

## Features

1. **Product Management**: Fetch, search, filter, and sort products.
2. **Pagination**: Efficient product pagination on the server-side.
4. **RESTful API**: Provides endpoints for frontend integration with product data.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Environment Variables**: Managed using `.env` for secure configurations

## Project Setup

### Prerequisites

- Node.js installed on your machine
- MongoDB set up locally or a cloud MongoDB instance (e.g., MongoDB Atlas)

### Backend Setup

1. **Clone the backend repository:**
   ```bash
   git clone <backend-repo-url>
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   MONGODB_URI=<your-mongodb-connection-string>
   FIREBASE_API_KEY=<your-firebase-api-key>
   FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   FIREBASE_PROJECT_ID=<your-firebase-project-id>
   FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
   FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
   FIREBASE_APP_ID=<your-firebase-app-id>
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

6. **View the server in the browser:**

    The backend will now be running on `http://localhost:5000` by default.