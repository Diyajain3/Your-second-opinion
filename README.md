# Your Second Opinion 🛍️

**An AI-powered tool that separates genuine customer feedback from fake and fluff reviews — so you can decide before you buy.**

🔗 **Live app:** [your-second-opinion.vercel.app](https://your-second-opinion.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma%20ORM-4169E1?logo=postgresql&logoColor=fff)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?logo=googlegemini&logoColor=fff)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=fff)

---

## About

Product reviews are noisy — a mix of genuine feedback, marketing plants, and bots. **Your Second Opinion** takes raw review text (pasted straight from any e-commerce site) and uses Google's Gemini API to cut through the noise, returning:

- An **authenticity score** with reasoning on how trustworthy the reviews look
- Exactly **3 genuine pros** and **3 genuine cons**, filtered from fluff
- **Red flags** — suspicious patterns that suggest fake or incentivized reviews
- A short, honest **plain-English summary**
- **Category-relevant metrics** (e.g. Battery Life, Build Quality, Value for Money) scored individually

It also supports **head-to-head product comparisons** — paste reviews for two products and get an AI-picked winner with a breakdown of both.

## Features

- **Review Analysis** — paste raw reviews, get an authenticity score, pros/cons, red flags, and a summary
- **Head-to-Head Comparison** — compare two products side by side with an AI-selected winner
- **History** — logged-in users can revisit past analyses and comparisons
- **Feedback loop** — users can rate results and leave comments to help improve accuracy
- **Authentication** — email/password signup and login secured with JWT

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS
- Framer Motion for animations

**Backend**
- Node.js + Express 5
- Prisma ORM
- PostgreSQL (hosted on Supabase)
- Google Gemini API for AI analysis
- JWT-based authentication with bcrypt password hashing

**Deployment**
- Frontend on Vercel
- Backend + database on Supabase-hosted Postgres

## Architecture

```
Client (React)  →  REST API (Express)  →  Prisma ORM  →  PostgreSQL
                          ↓
                   Google Gemini API
```

Four main resources: `auth`, `reviews`, `comparisons`, and `feedback` — each with its own route module and Prisma model (`User`, `Review`, `Comparison`, `Feedback`), linked via foreign keys so every review, comparison, and feedback entry is tied to a user.

## Getting Started

**Prerequisites:** Node.js 18+, a PostgreSQL database (e.g. via Supabase), a Google Gemini API key

```bash
# clone
git clone https://github.com/Diyajain3/Your-second-opinion.git
cd Your-second-opinion

# backend
cd backend
npm install
# add DATABASE_URL, GEMINI_API_KEY, JWT_SECRET to a .env file
npx prisma migrate dev
npm run dev

# frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

## Project Structure

```
Your-second-opinion/
├── backend/
│   ├── prisma/schema.prisma       # User, Review, Comparison, Feedback models
│   └── src/
│       ├── routes/                # auth, reviews, comparisons, feedback
│       ├── services/aiService.js  # Gemini API integration
│       ├── middleware/            # JWT auth guard
│       └── server.js
└── frontend/
    └── src/
        ├── pages/                 # Landing, Review, Compare, History, Auth
        ├── components/
        └── api/                   # API client modules
```

## Roadmap

- [ ] Browser extension for one-click review analysis on product pages
- [ ] Support for pasting review URLs directly instead of raw text
- [ ] Shareable public result links

## Author

**Diya Jain** — [GitHub](https://github.com/Diyajain3)
