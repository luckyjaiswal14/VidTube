# VidTube - Backend

VidTube is a backend project inspired by YouTube, built with Node.js, Express, and MongoDB. It supports core features such as user authentication, video management, comments, likes, playlists, subscriptions, and tweets.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Multer + Cloudinary for file uploads
- Cookie-based auth support

## Features

- User registration and login
- JWT access/refresh token handling
- Video upload and metadata management
- Commenting on videos
- Likes and dislikes
- Playlists and subscriptions
- Tweet-like user posts

## Project Structure

- src/controllers - route handlers
- src/routes - API endpoints
- src/models - Mongoose schemas
- src/middlewares - auth and error handling
- src/utils - reusable utilities

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and add the required values:

```env
PORT=8000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Run the development server

```bash
npm run dev
```

Or start the server directly:

```bash
npm run start
```

## API Notes

The application exposes REST-style endpoints under the `src/routes` directory. You can test them using tools like Postman or Insomnia.

## Author: Lucky Jaiswal

