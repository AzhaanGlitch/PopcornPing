# PopcornPing - Video Calling Platform

A modern video calling platform with screen sharing capabilities, built with React, Node.js, and WebRTC.

## Features

- 🔐 User authentication (Google OAuth & Email/Password)
- 📹 HD video calling
- 🖥️ Screen sharing
- 🏠 Create and join rooms
- 🔒 Secure and encrypted
- 📱 Responsive design

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Socket.io-client
- Simple-peer (WebRTC)
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Passport.js (Google OAuth & Local Strategy)
- Socket.io
- bcryptjs

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Google OAuth credentials

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_very_secret_session_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - Add production URL when deploying
6. Copy the Client ID and Client Secret to your `.env` file

## MongoDB Atlas Setup

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env`

## Project Structure

```
popcornping/
├── backend/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # React context
│       └── utils/       # Utility functions
└── README.md
```

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features Implementation

### Authentication
- Local authentication with email/password
- Google OAuth integration
- Session management with express-session
- Password hashing with bcryptjs

### Video Calling
- WebRTC peer-to-peer connections
- Socket.io for signaling
- Simple-peer for WebRTC handling

### Room Management
- Create rooms with custom names
- Join existing rooms by room ID
- Rooms expire after 24 hours
- Host can end rooms

## Deployment

### Backend Deployment (Heroku example)
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set SESSION_SECRET=your_secret
heroku config:set GOOGLE_CLIENT_ID=your_google_id
heroku config:set GOOGLE_CLIENT_SECRET=your_google_secret
git push heroku main
```

### Frontend Deployment (Vercel example)
```bash
vercel --prod
```

Update environment variables in your deployment platform.

## Security Notes

- Never commit `.env` files
- Use strong session secrets
- Enable HTTPS in production
- Set proper CORS origins
- Use secure cookies in production

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using React, Node.js, and WebRTC