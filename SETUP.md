# RepairHub Setup & Deployment Guide

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ 
- Docker & Docker Compose (for local Supabase)
- Git

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Update with your credentials:
# - NEXT_PUBLIC_SUPABASE_URL (get from Supabase dashboard)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (get from Supabase dashboard)
# - STRIPE_SECRET_KEY (get from Stripe dashboard)
# - STRIPE_WEBHOOK_SECRET (create in Stripe webhooks)
# - RESEND_API_KEY (get from Resend)
```

### 3. Start Local Supabase
```bash
docker-compose up -d

# This creates:
# - PostgreSQL database on localhost:5432
# - Supabase Studio on localhost:8000
```

### 4. Run Database Migrations
```bash
# Option A: Using Supabase CLI
supabase db push

# Option B: Manual SQL (via Supabase Studio)
# Paste contents of supabase/migrations/*.sql in correct order
```

### 5. Seed Development Data
```bash
# Via psql:
psql postgresql://postgres:postgres@localhost:5432/postgres -f supabase/seed.sql
```

### 6. Start Development Server
```bash
npm install
npm run dev

# Server runs on http://localhost:3000
```

---

## Production Deployment

### Deploy to Vercel

```bash
# Push to GitHub (main branch triggers deploy)
git push origin main

# Environment Variables (set in Vercel dashboard):
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
RESEND_API_KEY=...
```

### Deploy Supabase to Production

1. Create Supabase project: https://supabase.com
2. Push migrations:
   ```bash
   supabase db push --remote
   ```
3. Set up row-level security (migrations handle this)
4. Configure Auth providers (Email/Password, Google OAuth, etc.)

---

## Feature Implementation Checklist

### Phase 1 ✅ Complete
- [x] Supabase database schema (11 tables)
- [x] Row-Level Security policies
- [x] Gamification system (points/badges)
- [x] Real-time subscriptions setup
- [x] React Query hooks (useRepairs, useChat, useAuth)
- [x] 4-step repair request wizard with form validation
- [x] Photo upload to Supabase Storage
- [x] Real-time chat system
- [x] Dashboard components (BidForm, JourneyTracker, EarningsSummary)

### Phase 2 ✅ Complete
- [x] Stripe Connect onboarding for repairers
- [x] Payment intent creation with application fees
- [x] Stripe webhook handling
- [x] Transactional emails via Resend
- [x] Leaflet map with repairer discovery
- [x] Docker Compose for local development
- [x] GitHub Actions CI/CD (lint, type-check, build, deploy)

### Phase 3 (Ready for Implementation)
- [ ] User authentication (password reset, OAuth)
- [ ] Profile completion workflow
- [ ] Advanced search & filtering
- [ ] Review & rating system
- [ ] Dispute resolution interface
- [ ] Admin dashboard

---

## Key API Endpoints

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/signup` - Create account
- `POST /auth/logout` - Sign out

### Repairs
- `POST /api/repairs` - Create repair request
- `GET /api/repairs` - List repairs
- `GET /api/repairs/[id]` - Get repair detail
- `PATCH /api/repairs/[id]` - Update repair status

### Bids
- `POST /api/bids` - Submit bid
- `PATCH /api/bids/[id]/accept` - Accept bid

### Payments
- `POST /api/stripe/onboarding` - Start Stripe Connect onboarding
- `POST /api/stripe/webhook` - Webhook for payment events
- `POST /api/email` - Send transactional email

### Chat
- `WebSocket /api/chat/[repairId]` - Real-time messaging (via Supabase Realtime)

---

## Database Structure

### Core Tables
- `profiles` - User profiles (client/repairer/both)
- `repairs` - Repair requests with status tracking
- `bids` - Repair bids from repairers
- `repair_photos` - Photos linked to repairs
- `messages` - Chat messages for repairs
- `reviews` - Client reviews for repairers
- `payments` - Payment records for repairs
- `user_badges` - Gamification badges earned

---

## Testing

### Unit Tests
```bash
npm run test
```

### Build Check
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

---

## Troubleshooting

### "Supabase client not initialized"
- Check `.env.local` has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Verify docker-compose is running: `docker ps`

### Photos not uploading
- Ensure "repair-photos" bucket exists in Supabase Storage
- Check bucket policies allow inserts for authenticated users

### Stripe webhook not receiving events
- Verify STRIPE_WEBHOOK_SECRET is set correctly
- Test with: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Chat not real-time
- Check Supabase Realtime is enabled for `messages` table
- Verify browser allows WebSocket connections

---

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [Resend Email Docs](https://resend.com/docs)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)

---

## Team Notes

- **AI Assistant Context**: See `.github/copilot-instructions.md`
- **Code Style**: TypeScript strict mode, ESLint config included
- **Database**: All schema changes via migrations (never direct ALTER)
- **Secrets**: Never commit .env.local or API keys to Git
