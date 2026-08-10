# Your Second Opinion 🛍️

<p>
  <img alt="Made with JavaScript" src="https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?logo=javascript&logoColor=000&style=flat-square" />
  <img alt="Frontend: React 19" src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=000&style=flat-square" />
  <img alt="Backend: Node.js + Express" src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-000000?logo=express&logoColor=fff&style=flat-square" />
  <img alt="ORM: Prisma" src="https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=fff&style=flat-square" />
  <img alt="Database: PostgreSQL" src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=flat-square" />
  <img alt="Hosted on Supabase" src="https://img.shields.io/badge/DB%20Hosting-Supabase-3ECF8E?logo=supabase&logoColor=fff&style=flat-square" />
  <img alt="AI: Google Gemini" src="https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?logo=googlegemini&logoColor=fff&style=flat-square" />
</p>

<p>
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Diyajain3/Your-second-opinion?style=flat-square" />
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/Diyajain3/Your-second-opinion?style=flat-square" />
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/Diyajain3/Your-second-opinion?style=flat-square" />
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/Diyajain3/Your-second-opinion?style=flat-square" />
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/Diyajain3/Your-second-opinion?style=flat-square" />
  <img alt="Deployed on Vercel" src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=fff&style=flat-square" />
</p>

**Your Second Opinion** is a full-stack web app that uses AI to give you an honest, no-nonsense read on product reviews. Paste in a pile of reviews for a product (or two products you're deciding between), and it separates genuine feedback from fluff and fake-review noise — surfacing real pros, real cons, red flags, and a plain-English verdict.

🔗 Live app: [your-second-opinion.vercel.app](https://your-second-opinion.vercel.app)

<br />


<p align="center">
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a8c10479-9baa-4c24-8cba-2ff1d528ca11" />

</p>

<p align="center"><em>The live AI analysis preview on the landing page: authenticity scoring, genuine pros, and real trade-offs — before you buy.</em></p>

## Features

- **Review Analysis** — Paste raw customer reviews for a product and get:
  - An authenticity ("fake review") score with reasoning
  - Exactly 3 genuine pros and 3 genuine cons
  - Red flags / suspicious patterns
  - A short, honest summary
  - Category-relevant metrics (e.g. Battery Life, Build Quality, Value for Money) with scores and labels
- **Head-to-Head Comparison** — Drop in reviews for two products and get an AI-picked winner with a comparison summary and per-product breakdown.
- **History** — Revisit your past reviews and comparisons.
- **Feedback** — Rate results and leave comments to help improve accuracy.
- **Accounts** — Email/password signup and login with JWT-based sessions.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS
- Framer Motion (animations)
- Lucide Icons

**Backend**
- Node.js + Express 5
- Prisma ORM for schema modeling and queries
- PostgreSQL as the database, hosted/deployed on Supabase
- Google Gemini API (`@google/genai`) for AI analysis
- JWT authentication (`jsonwebtoken`) + `bcrypt` for password hashing

## Project Structure

```
Your-second-opinion/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # User, Review, Comparison, Feedback models
│   └── src/
│       ├── routes/             # auth, reviews, comparisons, feedback
│       ├── services/aiService.js   # Gemini prompt building + calls
│       ├── middleware/requireAuth.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── pages/              # Landing, Auth, Review, Compare, Result, History
│       ├── components/         # AppShell, Navbar, ResultCards, ReviewForm, etc.
│       ├── api/                # fetch wrappers for the backend API
│       └── context/            # Auth context
└── package.json                 # root scripts to run both apps
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A PostgreSQL database — this project uses [Supabase](https://supabase.com) to host Postgres, but any Postgres instance works
- A Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/Diyajain3/Your-second-opinion.git
cd Your-second-opinion
```

### 2. Install dependencies
```bash
npm install          # installs root deps and triggers frontend install via postinstall
cd backend && npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend/`:

```env
# Get this from your Supabase project → Settings → Database → Connection string
DATABASE_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="a-long-random-secret"
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=5000
```

### 4. Set up the database
```bash
npm run db:push
```

### 5. Run the app in development

In one terminal:
```bash
npm run dev:backend
```

In another terminal:
```bash
npm run dev:frontend
```

The frontend runs on Vite's dev server (default `http://localhost:5173`) and talks to the backend API (default `http://localhost:5000`).

### 6. Build for production
```bash
npm run build   # builds the frontend
npm start       # serves the built frontend via server.js
```

## API Overview

| Method | Endpoint              | Description                                  | Auth required |
|--------|------------------------|-----------------------------------------------|:--------------:|
| POST   | `/api/auth/signup`     | Create an account                             | No |
| POST   | `/api/auth/login`      | Log in and receive a JWT                      | No |
| POST   | `/api/reviews`         | Analyze and save a product review             | Yes |
| GET    | `/api/reviews`         | List reviews (`?scope=all` for all users)     | Yes |
| GET    | `/api/reviews/:id`     | Get a single review result                    | Yes |
| POST   | `/api/comparisons`     | Compare two products head-to-head             | Yes |
| GET    | `/api/comparisons`     | List comparisons (`?scope=all` for all users) | Yes |
| POST   | `/api/feedback`        | Submit feedback on a result                   | Optional |
| GET    | `/api/feedback`        | Get your feedback history                     | Optional |

## Contributing

Issues and pull requests are welcome. If you spot a bug or have an idea for improvement, feel free to open an issue.

## License

No license has been specified for this repository yet. Contact the repo owner if you'd like to use this code beyond personal reference.
