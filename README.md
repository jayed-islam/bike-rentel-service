# Bike Rental Application

## Project Overview

The Bike Rental Application is a bike renting platform that allows users to rent bikes online. Users can view available bikes, book a rental. The application ensures that bike availability is updated in real-time, and rental costs are calculated based on the duration of the rental.

### Live URL

[Live URL](https://rental-service-bike-new.vercel.app 'Visit the live application')

# Admin Credentials

To log in as an admin, use the following credentials:

- **Email**: `abdullah-admin@gmail.com`
- **Password**: `password123`

```json
{
  "email": "abdullah-admin@gmail.com",
  "password": "password123"
}
```

## Features

- **User Authentication**: Secure user login and registration.
- **Bike Availability**: View available bikes for rental.
- **Payment with amarpay gateway**: Payment with amarpay gateway.
- **Bike Booking**: Rent a bike by selecting the desired bike and start time.
- **Bike Return**: Return the bike and calculate the total rental cost.
- **Admin Routes**: Manage bike inventory and monitor bookings.
- **Update profile**: Update user or admin profile.
- **Authorization**: Used here authorization for admin and user.
- **Bearer JWT Token**: Used here authorization for admin and user.
- **Global Error Handling**: Used here authorization for admin and user.
- **Not found API Handler**: Used here authorization for admin and user.

## Technology Stack

- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Hosting**: Vercel

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v12.x or higher)
- MongoDB

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/jayed-islam/bike-rentel-service
   cd bike-rentel-service
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   DATABASE_URL=
   BCRYPT_SALT_ROUNDS=
   JWT_ACCESS_SECRET=
   JWT_EXPIRSE_IN=
   ```

4. **Start the application:**

   ```sh
   npm run start:dev
   ```

   The server will start on `http://localhost:5000`.

## Some API Endpoints

### Authentication

- **POST** `/api/auth/signup`: Register a new user
- **POST** `/api/auth/login`: User login

### Users

- **GET** `/api/users/me`: Get user data
- **PUT** `/api/users/me`: Update user

### Bike Management

- **GET** `/api/bikes`: Get all available bikes
- **POST** `/api/bikes`: Add a new bike (Admin only)
- **PATCH** `/api/bikes/:id`: Update bike details (Admin only)
- **DELETE** `/api/bikes/:id`: Delete a bike (Admin only)

### Booking

- **POST** `/api/rentals`: Create a new booking
- **PUT** `/api/rentals/:id/return`: Return a bike and calculate total cost
- **GET** `/api/rentals`: Get all rentals for user

## Also some others related apis here .

## Some Use case

1. **Register and Login:**

   - Create an account by registering.
   - Login to your account to access bike rental features.

2. **View Available Bikes:**

   - Browse through the list of available bikes.

3. **Book a Bike:**

   - Select a bike and choose the start time for your rental.

4. **Return a Bike:**
   - When returning a bike, the application calculates the total rental cost based on the rental duration. this action is for admin only.

## Contact

For any inquiries or feedback, please contact us at [jayedbgh@gmail.com](mailto:jayedbgh@gmail.com 'Send us an email').

---
