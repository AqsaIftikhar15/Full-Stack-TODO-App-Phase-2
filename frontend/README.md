# AquaTodo Frontend

A responsive and visually appealing Todo application with secure per-user task access via authentication.

## Features

- User authentication and registration
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive design for mobile, tablet, and desktop
- Light bluish and purplish color theme
- Smooth animations for task operations

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to backend API endpoints

## Setup Instructions

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Create a `.env.local` file based on the example with your environment variables
5. Run the development server: `npm run dev`

## Development

To run the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

To build the application for production:

```bash
npm run build
```

## Docker Containerization

To build and run with Docker:

```bash
docker build -t aquatodo-frontend .
docker run -p 3000:3000 aquatodo-frontend
```

## Tech Stack

- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- SWR for data fetching
- Framer Motion for animations