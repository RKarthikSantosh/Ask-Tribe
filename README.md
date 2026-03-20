# AskTribe - Community-Based Q&A Portal

AskTribe is a full-stack Q&A platform where developers can ask questions, post answers, comment, explore tags, view user profiles, and collaborate in private communities.

This repository contains:

- `backend` - Node.js + Express + Sequelize + MySQL API
- `frontend` - React + Redux + Vite web client

## Features

- User authentication with JWT
- Ask, browse, and delete questions
- Answer and comment on questions
- Tag-based discovery
- User listing and profile pages
- Community module:
	- Create communities
	- Add community members
	- Ask community-specific questions
	- Answer and comment on community questions
	- Member-only community visibility and access
- Optional Ask AI while posting:
	- Users can enable or disable Ask AI in the question form
	- When enabled, backend generates an answer using question title and body

## Tech Stack

- Frontend: React 17, Redux, React Router, Sass, Vite
- Backend: Node.js, Express, Sequelize, MySQL
- Auth: JSON Web Tokens (JWT)

## Repository Structure

```text
qna-portal/
	backend/
	frontend/
```

## Prerequisites

- Node.js (LTS recommended)
- npm
- MySQL server

## Backend Setup

1. Go to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend` based on `.env.example`:

```env
HOST=localhost
DATABASE_PORT=3306
USER=root
DATABASE=iomp
PASSWORD=your_mysql_password

JWT_SECRET=community_based_qna_portal_for_iomp
JWT_EXPIRES_IN=1

# Optional Ask AI setup
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
# or use Groq (OpenAI-compatible endpoint)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Ask AI responses are generated in a short Stack Overflow-like format:
- Short answer
- Why (brief reason)
- Fix steps

4. Start backend server:

```bash
npm start
```

Backend runs on:

- `http://localhost:5000`

## Frontend Setup

1. Go to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create `.env` in `frontend`:

```env
VITE_API_URL=http://localhost:5000
```

4. Start frontend development server:

```bash
npm run dev
```

## Running the Full Project

Run both services in separate terminals:

Terminal 1:

```bash
cd backend
npm start
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## Scripts

### Backend (`backend/package.json`)

- `npm start` - start backend with nodemon
- `npm run server` - start backend with node
- `npm test` - run tests
- `npm run lint-check` - run lint checks

### Frontend (`frontend/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm start` - preview build

## API Overview

Base URL:

- `http://localhost:5000/api`

Core endpoints:

- Auth: `/auth`
- Users: `/users`
- Posts: `/posts`
- Tags: `/tags`
- Answers: `/posts/answers/:id`
- Comments: `/posts/comments/:id`
- Communities: `/communities`

Community endpoints include:

- `GET /communities` (member-only)
- `POST /communities`
- `GET /communities/:id/members` (member-only)
- `POST /communities/:id/members` (member-only)
- `GET /communities/:id/questions` (member-only)
- `POST /communities/:id/questions` (member-only)
- `GET /communities/questions/:id/answers` (member-only)
- `POST /communities/questions/:id/answers` (member-only)
- `GET /communities/questions/:id/comments` (member-only)
- `POST /communities/questions/:id/comments` (member-only)

## Security Notes

- JWT token is required for protected routes via `x-auth-token` header.
- Community visibility is restricted to community members.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
