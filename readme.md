# VidTube Backend

A Node.js/Express backend for the VidTube application.

## Overview

This backend provides authentication, video management, comments, likes, tweets, playlists, subscriptions, and dashboard APIs.

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- Cloudinary for media uploads
- JWT-based authentication
- Multer for file uploads

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.sample` and fill in the required values:

- `PORT`
- `MONGODB_URI` or connection pieces
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY`
- `REFRESH_TOKEN_EXPIRY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CORS_ORIGIN`

3. Start the server:

```bash
npm start
```

## API Base URL

`http://localhost:8000/api/v1`

## Routes

### Health

- `GET /api/v1/healthcheck/`

### Users

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `POST /api/v1/users/logout`
- `POST /api/v1/users/refresh-token`
- `POST /api/v1/users/change-password`
- `GET /api/v1/users/current-user`
- `PATCH /api/v1/users/update-account`
- `PATCH /api/v1/users/avatar`
- `PATCH /api/v1/users/cover-image`
- `GET /api/v1/users/c/:username`
- `GET /api/v1/users/history`

### Videos

- `GET /api/v1/videos/`
- `POST /api/v1/videos/`
- `GET /api/v1/videos/:videoId`
- `PATCH /api/v1/videos/:videoId`
- `DELETE /api/v1/videos/:videoId`
- `PATCH /api/v1/videos/toggle/publish/:videoId`

### Tweets

- `POST /api/v1/tweets/`
- `GET /api/v1/tweets/user/:userId`
- `PATCH /api/v1/tweets/:tweetId`
- `DELETE /api/v1/tweets/:tweetId`

### Comments

- `GET /api/v1/comments/:videoId`
- `POST /api/v1/comments/:videoId`
- `PATCH /api/v1/comments/c/:commentId`
- `DELETE /api/v1/comments/c/:commentId`

### Likes

- `POST /api/v1/likes/toggle/v/:videoId`
- `POST /api/v1/likes/toggle/c/:commentId`
- `POST /api/v1/likes/toggle/t/:tweetId`
- `GET /api/v1/likes/videos`

### Playlists

- `POST /api/v1/playlist/`
- `GET /api/v1/playlist/user/:userId`
- `GET /api/v1/playlist/:playlistId`
- `PATCH /api/v1/playlist/:playlistId`
- `DELETE /api/v1/playlist/:playlistId`
- `PATCH /api/v1/playlist/add/:videoId/:playlistId`
- `PATCH /api/v1/playlist/remove/:videoId/:playlistId`

### Subscriptions

- `POST /api/v1/subscriptions/c/:channelId`
- `GET /api/v1/subscriptions/c/:channelId`
- `GET /api/v1/subscriptions/u/:subscriberId`

### Dashboard

- `GET /api/v1/dashboard/stats`
- `GET /api/v1/dashboard/videos`

## Notes

- `npm test` is not configured; it currently reports `Error: no test specified`.
- The backend requires valid Cloudinary credentials and a running MongoDB instance.
- Authentication is JWT-based and uses cookies for access/refresh tokens.
