# Mental Health Platform: Frontend

A web app that connects clients with therapists. Clients can read mental health articles, browse therapists, and book sessions. Therapists can manage their profile, articles, and availability.
I aim to make sessions experience more practical and easy for both clients and therapists, also I would like the website to become a web community to help supporting mental health awarness.

> Backend repository: [https://github.com/DanahAlAbdallah/Mental-Health-backend]

## Features

- Sign up and log in with email and password (JWT authentication)
- Role-based experience for **clients** and **therapists**
- Editable user profile (name, phone, profile picture)
- Therapist profile (bio, specialties, languages, session price, location)
- Mental health articles (browse, create, edit)
- Therapist availability slots and session booking
- Form validation with clear error messages under each input

## Tech Stack

| Area       | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | [React](https://react.dev)                   |
| Language   | [TypeScript](https://www.typescriptlang.org) |
| Build tool | [Vite](https://vite.dev)                     |
| Styling    | [Tailwind CSS](https://tailwindcss.com)      |
| Routing    | [React Router](https://reactrouter.com)      |
| State      | React Context API (authentication)           |
| Linting    | ESLint                                       |

**Backend (separate repo):** Node.js, Express, Prisma, JWT, bcrypt

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- npm
- The backend running locally or deployed (see the backend repo)

### Installation

```bash
# 1. Clone the repository
git clone <https://github.com/DanahAlAbdallah/Mental-Health-Frontend>

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
```

### Environment variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:3001
```

For production, set `VITE_API_URL` to your deployed backend URL.

> Restart the dev server after changing any `.env` file.

### Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

src/
├── api/ # API helpers (apiRequest and endpoint functions)
├── components/ # Reusable UI components
├── context/ # AuthContext (user, token, login, signup, logout)
├── pages/ # Page components (Home, Login, Signup, Profile, ...)
├── types/ # Shared TypeScript types (User, TherapistProfile, Article, ...)
└── main.tsx # App entry point

## How Authentication Works

1. The user logs in or signs up and the backend returns a JWT and the user object.
2. `AuthContext` saves both in state and `localStorage`.
3. `apiRequest` attaches the token as `Authorization: Bearer <token>` on protected requests.
4. If the token expires, an `auth:expired` event logs the user out automatically.

## Still working on..

- [ ] Profile picture upload
- [ ] Password reset
- [ ] Login with Google
- [ ] Booked sessions for clients and therapists
- [ ] Email notifications for sessions
- [ ] AI-assisted therapist matching
- [ ] Session notes and client folders for therapists

## Author

Danah Al-Abdallah : [GitHub](https://github.com/DanahAlAbdallah) · [LinkedIn](https://www.linkedin.com/in/danahalabdallah)
