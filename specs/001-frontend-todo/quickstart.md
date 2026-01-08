# Quickstart Guide: Frontend Todo Web Application

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Docker (for containerization)
- Access to backend API endpoints

## Setup Instructions

### 1. Clone and Navigate
```bash
# Navigate to the project root
cd /path/to/project
```

### 2. Create Frontend Directory
```bash
mkdir frontend
cd frontend
```

### 3. Initialize Next.js Project
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 4. Install Dependencies
```bash
npm install @better-auth/react @better-auth/client
npm install swr axios framer-motion
npm install --save-dev @types/node @types/react @types/react-dom
```

### 5. Environment Configuration
Create `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=6LrD8qcJ3LL8E70MePBpWRO9y715IEZB
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 6. Project Structure
After setup, your frontend directory should look like:
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── tasks/
│       ├── page.tsx
│       └── [id]/
│           └── page.tsx
├── components/
│   ├── ui/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── Navbar.tsx
│   │   └── Loader.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── SignupForm.tsx
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── types.ts
├── hooks/
│   ├── useTasks.ts
│   └── useAuth.ts
├── .env.local
├── Dockerfile
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### 7. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 8. Docker Containerization
Create `Dockerfile` in frontend directory:
```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run with Docker:
```bash
docker build -t aquatodo-frontend .
docker run -p 3000:3000 aquatodo-frontend
```

## Key Integration Points

### API Client (`lib/api.ts`)
- Automatically attaches JWT tokens to all requests
- Handles authentication errors and redirects
- Implements retry logic for failed requests

### Authentication (`lib/auth.ts`)
- Integrates Better Auth for user management
- Provides session context to the application
- Handles token refresh and expiration

### Task Management (`hooks/useTasks.ts`)
- Fetches user-specific tasks from backend
- Implements CRUD operations with optimistic updates
- Handles loading and error states

## API Endpoints Used
- `GET /api/{user_id}/tasks` - Fetch user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion