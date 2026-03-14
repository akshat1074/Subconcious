# Subconscious — Next.js + Groq + Gemini

Knowledge vault built with Next.js 15 App Router, NextAuth v5, Prisma, PostgreSQL + pgvector, Groq (Llama 3.3), and Gemini embeddings.

**Entirely free AI tier** — Groq free tier + Gemini free tier = zero cost.

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env — add NEXTAUTH_SECRET, GROQ_API_KEY, GEMINI_API_KEY

# 3. Start Postgres + pgAdmin
docker compose up postgres pgadmin -d

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Start dev server
npm run dev
```

App → http://localhost:3000  
pgAdmin → http://localhost:5050

## Production (full Docker)

```bash
docker compose up -d
```

## Free API Keys

| Service | Get key | Cost |
|---|---|---|
| **Groq** (chat) | console.groq.com | Free tier: 14,400 req/day |
| **Gemini** (embeddings) | aistudio.google.com | Free: 1M tokens/month |
| **Google OAuth** | console.cloud.google.com | Free |

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router |
| Auth | NextAuth v5 (JWT strategy, Google OAuth + credentials) |
| Database | PostgreSQL 16 + pgvector |
| ORM | Prisma |
| AI Chat | Groq SDK (llama-3.3-70b-versatile) |
| Embeddings | Google Gemini (text-embedding-004, 768 dims) |
| State | Redux Toolkit |
| UI | Tailwind CSS |
| Deploy | Docker Compose |

## Auth Flow

NextAuth v5 uses JWT session strategy — no database sessions table needed.

- **Credentials**: Register via `/api/auth/register` → sign in via NextAuth `credentials` provider
- **Google OAuth**: Single button, handled entirely by NextAuth → auto-creates user on first login
- **Session**: JWT stored in cookie (HTTP-only), 30-day expiry
- **Server auth**: `auth()` in Server Components and Route Handlers
- **Client auth**: `useSession()` from `next-auth/react`

## RAG Chat

1. On save: content is embedded with `text-embedding-004` (768 dims) → stored in `contents.embedding` as pgvector
2. On chat: question is embedded → cosine similarity search (`<=>` operator) finds top-6 matches
3. Groq Llama 3.3-70b generates answer using matched content as context
4. Embedding runs in `setImmediate` so saves are never blocked

## Ports

| Service | Port |
|---|---|
| Next.js | 3000 |
| PostgreSQL | 5432 |
| pgAdmin | 5050 |
