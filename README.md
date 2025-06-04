# Intern Management System

A full-stack application for efficiently managing and tracking intern progress, built with React, Node.js, Express, and MongoDB.

## Features

- Admin Dashboard for intern onboarding and task management
- Intern Dashboard for task tracking and work submission
- Real-time progress tracking
- Secure authentication and authorization
- Task management and deadline tracking
- Feedback system

## Tech Stack

- **Frontend**: React with JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Styling**: Material-UI

## Project Structure

```
intern-management-system/
├── client/          # Frontend React application
└── server/          # Backend Node.js/Express application
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd intern-management-system
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Follow the `.env.example` files for required variables

4. Start the development servers:

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Development

- Frontend development server runs on port 3000
- Backend development server runs on port 5000
- API documentation available at `/api-docs` when running the backend server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 