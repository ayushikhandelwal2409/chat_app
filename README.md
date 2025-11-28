# Chat App

Full-stack real-time messaging app with authentication, profile management, and a modern React UI. Built with an Express/MongoDB backend and a Vite + React frontend that communicates via REST and Socket.IO for live updates.

## Features

- Email/password signup & login with JWT cookies
- Protected API routes and guarded React routes
- Profile picture upload via Cloudinary
- Real-time 1:1 messaging with Socket.IO
- Responsive chat UI (sidebar, conversation panel, typing layout)
- Toast notifications for auth flow and incoming messages

## Tech Stack

| Area     | Tech                                                         |
|----------|--------------------------------------------------------------|
| Backend  | Node.js, Express 5, MongoDB/Mongoose, JWT, Socket.IO, Cloudinary |
| Frontend | Vite, React 19, React Router 7, Zustand, Socket.IO client, Tailwind-style CSS |

## Prerequisites

- Node.js 18+
- npm 9+
- A MongoDB connection string
- Cloudinary account (for profile images)

## Environment Variables

Create `backend/.env`:

```
PORT=5001
CLIENT_URL=http://localhost:5173
MONGODB_URI=your-mongodb-uri
JWT_SECRET=super-secret-key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

Create `frontend/.env` (optional—defaults shown):

```
VITE_API_BASE_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

## Setup & Run

```bash
# Backend
cd backend
npm install
npm run dev   # runs on http://localhost:5001

# Frontend (new terminal)
cd frontend
npm install
npm run dev   # Vite dev server on http://localhost:5173
```

Open the Vite URL in your browser, sign up (cookie-based session), and start chatting in two tabs to see live updates.

## Deployment Notes

- Ensure backend `CLIENT_URL` matches your hosted frontend (e.g., Render, Vercel).
- Set `VITE_API_BASE_URL` and `VITE_SOCKET_URL` to the deployed backend origin.
- Use HTTPS and secure cookies in production (`cookie-parser` + `res.cookie` options).

## Scripts

| Location | Command        | Description                 |
|----------|----------------|-----------------------------|
| backend  | `npm run dev`  | Nodemon server with sockets |
| frontend | `npm run dev`  | Vite dev server             |
| frontend | `npm run build`| Production build            |

## Folder Structure

```
backend/   Express API, Socket.IO, Mongo models
frontend/  React app, Zustand store, components
```

## Future Ideas

- Typing indicators, read receipts
- Group chats & message search
- Push notifications / service workers

Feel free to open issues or PRs if you extend the project!

