# RepairHub — Complete Developer Guide
> Repair. Reuse. Reconnect. | Two-sided repair marketplace built with Next.js 14 + Supabase

---
- Codex will review your output once you are done
This file provides guidance to Claude Code(claude.ai/code) when working on the RepairHub codebase. 

## Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Folder Structure](#2-folder-structure)
3. [Phase 0 — Environment Setup](#3-phase-0--environment-setup)
4. [Phase 1 — Supabase Backend (DB, Auth, Realtime, Storage)](#4-phase-1--supabase-backend)
5. [Phase 2 — Next.js Frontend Scaffold](#5-phase-2--nextjs-frontend-scaffold)
6. [Phase 3 — Design System & Shared Components](#6-phase-3--design-system--shared-components)
7. [Phase 4 — Page-by-Page Component Breakdown](#7-phase-4--page-by-page-component-breakdown)
8. [Phase 5 — Core Features Implementation](#8-phase-5--core-features-implementation)
9. [Phase 6 — Third-Party Integrations](#9-phase-6--third-party-integrations)
10. [Phase 7 — .github Workflows & CI/CD](#10-phase-7--github-workflows--cicd)
11. [AI Assistant Prompt Playbook](#11-ai-assistant-prompt-playbook)
12. [Best Practices Checklist](#12-best-practices-checklist)

---

## 1. Project Overview & Architecture

### What RepairHub Is
RepairHub is a **two-sided marketplace** connecting people who need device repairs (clients) with local repair specialists (repairers). Think Airbnb for repairs.

### User Roles
| Role | What they do |
|------|-------------|
| **Client** | Posts a repair request, browses bids, tracks repair progress, pays, leaves reviews |
| **Repairer** | Lists their services, bids on repair jobs, completes work, receives payment |

### Pages (from HTML analysis)
| Page ID | Route | Description |
|---------|-------|-------------|
| `home` | `/` | Landing — hero, how it works, featured repairers, trust signals |
| `request` | `/request` | 4-step repair request wizard |
| `repairer` | `/dashboard/repairer` | Repairer's job board, active jobs, earnings |
| `client` | `/dashboard/client` | Client's active/past repairs, chat, journey tracker |

### Architecture Decision: Next.js 14 + Supabase (BaaS)
Instead of a separate Django backend, the tech stack uses Supabase as a Backend-as-a-Service — this gives you:
- PostgreSQL database
- Row-Level Security (auth-aware data access)
- Real-time subscriptions (chat, repair status)
- Auth (email/password + OAuth)
- File storage (repair photos)
- Edge Functions (serverless, for Stripe webhooks etc.)

This means **no separate backend server to host** — perfect for a lean team or solo developer.

```
Browser (Next.js)  ──►  Supabase (DB + Auth + Realtime + Storage)
                   ──►  Stripe (payments)
                   ──►  Resend (email)
                   ──►  Leaflet/OSM (maps, no API key needed)
```

---

## 2. Folder Structure

```
repairhub/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # Lint + type-check on every PR
│   │   ├── deploy.yml           # Deploy to Vercel on merge to main
│   │   └── db-migrations.yml    # Run Supabase migrations on merge
│   ├── CODEOWNERS               # Who reviews what
│   ├── pull_request_template.md
│   └── copilot-instructions.md  # AI assistant context file ← KEY FILE
│
├── supabase/
│   ├── migrations/              # SQL migration files (version-controlled)
│   │   ├── 001_init_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_gamification.sql
│   │   └── 004_realtime.sql
│   ├── seed.sql                 # Dev seed data
│   └── config.toml              # Supabase local dev config
│
├── src/
│   ├── app/                     # Next.js 14 App Router
│   │   ├── (marketing)/         # Route group — no auth required
│   │   │   ├── page.tsx         # Home / landing
│   │   │   └── layout.tsx
│   │   ├── (auth)/              # Route group — auth pages
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # Route group — auth required
│   │   │   ├── layout.tsx       # Shared dashboard shell + nav
│   │   │   ├── client/
│   │   │   │   └── page.tsx     # Client dashboard
│   │   │   └── repairer/
│   │   │       └── page.tsx     # Repairer dashboard
│   │   ├── request/
│   │   │   └── page.tsx         # 4-step repair request wizard
│   │   ├── repairs/
│   │   │   └── [id]/page.tsx    # Individual repair detail
│   │   ├── api/                 # Next.js API routes (thin layer over Supabase)
│   │   │   ├── stripe/
│   │   │   │   └── webhook/route.ts
│   │   │   └── email/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui base components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageNav.tsx      # The sticky tab nav from the HTML
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FeaturedRepairers.tsx
│   │   │   └── TrustSignals.tsx
│   │   ├── request/
│   │   │   ├── RequestWizard.tsx       # Orchestrator
│   │   │   ├── Step1DeviceInfo.tsx
│   │   │   ├── Step2PhotoUpload.tsx
│   │   │   ├── Step3Location.tsx
│   │   │   └── Step4Confirm.tsx
│   │   ├── dashboard/
│   │   │   ├── client/
│   │   │   │   ├── RepairJourneyCard.tsx
│   │   │   │   ├── JourneyTracker.tsx   # Step-progress visualizer
│   │   │   │   ├── PastRepairs.tsx
│   │   │   │   └── StarRating.tsx
│   │   │   └── repairer/
│   │   │       ├── JobBoard.tsx
│   │   │       ├── ActiveJobCard.tsx
│   │   │       ├── EarningsSummary.tsx
│   │   │       └── BidForm.tsx
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── map/
│   │   │   └── RepairerMap.tsx  # Leaflet map (dynamic import, no SSR)
│   │   └── shared/
│   │       ├── StatusBadge.tsx
│   │       ├── Avatar.tsx
│   │       ├── ProgressBar.tsx
│   │       └── FilterTabs.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser Supabase client
│   │   │   ├── server.ts        # Server-side Supabase client (for Server Components)
│   │   │   └── middleware.ts    # Auth middleware helper
│   │   ├── stripe.ts            # Stripe client init
│   │   ├── resend.ts            # Resend email client
│   │   └── utils.ts             # cn(), formatDate(), etc.
│   │
│   ├── hooks/
│   │   ├── useRepairs.ts        # React Query hooks for repair data
│   │   ├── useChat.ts           # Supabase Realtime chat hook
│   │   ├── useAuth.ts           # Auth state hook
│   │   └── useRealtimeStatus.ts # Repair status real-time updates
│   │
│   ├── types/
│   │   └── database.types.ts    # Auto-generated from Supabase schema
│   │
│   └── middleware.ts            # Next.js middleware — auth guard
│
├── .env.local                   # Secret keys (never commit)
├── .env.example                 # Template (commit this)
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Phase 0 — Environment Setup

### 3.1 Prerequisites
```bash
node --version   # 18.17+ required for Next.js 14
npm --version    # 9+
git --version
```

### 3.2 Create the Next.js App
```bash
npx create-next-app@latest repairhub \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd repairhub
```

### 3.3 Install All Dependencies
```bash
# shadcn/ui setup (interactive CLI)
npx shadcn@latest init
# Choose: Default style, Slate base color, CSS variables: yes

# Install shadcn components you'll need
npx shadcn@latest add button badge card dialog input label \
  select textarea tabs progress avatar separator sheet

# Core dependencies
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  @tanstack/react-query \
  stripe \
  @stripe/stripe-js \
  resend \
  leaflet \
  react-leaflet \
  @types/leaflet \
  react-dropzone \
  date-fns \
  clsx \
  tailwind-merge \
  lucide-react \
  zod \
  react-hook-form \
  @hookform/resolvers
```

### 3.4 Supabase Local Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Initialize in project root
supabase init

# Start local Supabase (Docker required)
supabase start

# Output will show:
# API URL:     http://localhost:54321
# Studio URL:  http://localhost:54323  ← Your local admin panel
# DB password: your-local-password
```

### 3.5 Environment Variables
Create `.env.local` (never commit this file):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create `.env.example` (commit this as a template):
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## 4. Phase 1 — Supabase Backend

### 4.1 Database Schema

Create `supabase/migrations/001_init_schema.sql`:

```sql
-- ==============================
-- ENUMS
-- ==============================
CREATE TYPE repair_status AS ENUM (
  'pending',      -- client posted, no bids yet
  'quoted',       -- repairers have placed bids
  'accepted',     -- client accepted a bid
  'in_progress',  -- repairer is working
  'completed',    -- repairer marked done
  'reviewed',     -- client left review
  'disputed',     -- dispute raised
  'cancelled'
);

CREATE TYPE user_role AS ENUM ('client', 'repairer', 'both');

-- ==============================
-- PROFILES (extends Supabase auth.users)
-- ==============================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'client',
  bio           TEXT,
  location      TEXT,
  lat           DECIMAL(9,6),
  lng           DECIMAL(9,6),
  phone         TEXT,
  -- Gamification
  repair_points INT NOT NULL DEFAULT 0,
  badge_level   TEXT NOT NULL DEFAULT 'newcomer', -- newcomer, bronze, silver, gold
  total_repairs INT NOT NULL DEFAULT 0,
  -- Repairer-specific
  specialties   TEXT[],   -- ['phones', 'laptops', 'tablets']
  avg_rating    DECIMAL(3,2),
  review_count  INT NOT NULL DEFAULT 0,
  stripe_account_id TEXT,  -- Stripe Connect account
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- REPAIR REQUESTS
-- ==============================
CREATE TABLE repairs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES profiles(id),
  repairer_id   UUID REFERENCES profiles(id),  -- set when bid accepted
  -- Device info (Step 1 of wizard)
  device_type   TEXT NOT NULL,   -- 'phone', 'laptop', 'tablet', etc.
  device_brand  TEXT NOT NULL,
  device_model  TEXT,
  issue_type    TEXT NOT NULL,   -- 'screen', 'battery', 'water', etc.
  description   TEXT NOT NULL,
  -- Location (Step 3)
  location_text TEXT NOT NULL,
  lat           DECIMAL(9,6),
  lng           DECIMAL(9,6),
  -- Pricing
  budget_min    INT,             -- in cents
  budget_max    INT,
  final_price   INT,             -- agreed price (in cents)
  -- Status
  status        repair_status NOT NULL DEFAULT 'pending',
  -- Meta
  urgency       TEXT DEFAULT 'normal', -- 'asap', 'normal', 'flexible'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Photos for a repair (linked to Supabase Storage)
CREATE TABLE repair_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id  UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,   -- path in Supabase Storage bucket
  is_before  BOOLEAN DEFAULT TRUE,  -- before or after repair photo
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- BIDS
-- ==============================
CREATE TABLE bids (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id   UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  repairer_id UUID NOT NULL REFERENCES profiles(id),
  price       INT NOT NULL,           -- in cents
  eta_hours   INT,                    -- estimated completion hours
  message     TEXT,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- CHAT MESSAGES
-- ==============================
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id   UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id),
  content     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- REVIEWS
-- ==============================
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id    UUID NOT NULL UNIQUE REFERENCES repairs(id),
  reviewer_id  UUID NOT NULL REFERENCES profiles(id),
  reviewed_id  UUID NOT NULL REFERENCES profiles(id),
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- PAYMENTS
-- ==============================
CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id             UUID NOT NULL REFERENCES repairs(id),
  stripe_payment_intent TEXT UNIQUE,
  amount                INT NOT NULL,  -- in cents
  platform_fee          INT,           -- RepairHub's cut
  status                TEXT DEFAULT 'pending', -- pending, captured, released, refunded
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- GAMIFICATION BADGES
-- ==============================
CREATE TABLE user_badges (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id),
  badge_name TEXT NOT NULL,
  earned_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- INDEXES
-- ==============================
CREATE INDEX idx_repairs_client    ON repairs(client_id);
CREATE INDEX idx_repairs_repairer  ON repairs(repairer_id);
CREATE INDEX idx_repairs_status    ON repairs(status);
CREATE INDEX idx_bids_repair       ON bids(repair_id);
CREATE INDEX idx_messages_repair   ON messages(repair_id);
CREATE INDEX idx_messages_sender   ON messages(sender_id);
```

### 4.2 Row Level Security Policies

Create `supabase/migrations/002_rls_policies.sql`:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges   ENABLE ROW LEVEL SECURITY;

-- ==============================
-- PROFILES
-- ==============================
-- Anyone can view profiles (for marketplace)
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profiles are created via trigger (see below), not directly
CREATE POLICY "profiles_insert_trigger" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==============================
-- REPAIRS
-- ==============================
-- Clients see their own repairs; repairers see pending ones + ones they bid on
CREATE POLICY "repairs_select" ON repairs
  FOR SELECT USING (
    client_id = auth.uid()
    OR repairer_id = auth.uid()
    OR status = 'pending'
    OR status = 'quoted'
  );

CREATE POLICY "repairs_insert_client" ON repairs
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "repairs_update_own" ON repairs
  FOR UPDATE USING (
    client_id = auth.uid() OR repairer_id = auth.uid()
  );

-- ==============================
-- BIDS
-- ==============================
CREATE POLICY "bids_select" ON bids
  FOR SELECT USING (
    repairer_id = auth.uid()
    OR repair_id IN (SELECT id FROM repairs WHERE client_id = auth.uid())
  );

CREATE POLICY "bids_insert_repairer" ON bids
  FOR INSERT WITH CHECK (repairer_id = auth.uid());

-- ==============================
-- MESSAGES
-- ==============================
CREATE POLICY "messages_select_participants" ON messages
  FOR SELECT USING (
    repair_id IN (
      SELECT id FROM repairs
      WHERE client_id = auth.uid() OR repairer_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_participants" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND repair_id IN (
      SELECT id FROM repairs
      WHERE client_id = auth.uid() OR repairer_id = auth.uid()
    )
  );

-- ==============================
-- REVIEWS
-- ==============================
CREATE POLICY "reviews_select_public" ON reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "reviews_insert_client" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());
```

### 4.3 Auth Trigger (Auto-create profile on signup)

Add to `001_init_schema.sql` or a new migration:

```sql
-- Automatically create a profile row when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4.4 Gamification Trigger

Create `supabase/migrations/003_gamification.sql`:

```sql
-- Award points when a repair is completed
CREATE OR REPLACE FUNCTION award_completion_points()
RETURNS TRIGGER AS $$
DECLARE
  points_earned INT := 50;
  new_total INT;
BEGIN
  -- Only fire when status changes TO 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Award client points
    UPDATE profiles
    SET repair_points = repair_points + points_earned,
        total_repairs = total_repairs + 1
    WHERE id = NEW.client_id
    RETURNING repair_points INTO new_total;

    -- Award repairer points
    UPDATE profiles
    SET repair_points = repair_points + (points_earned * 2),
        total_repairs = total_repairs + 1
    WHERE id = NEW.repairer_id;

    -- Check badge milestones for client
    IF new_total >= 500 THEN
      UPDATE profiles SET badge_level = 'gold' WHERE id = NEW.client_id;
    ELSIF new_total >= 200 THEN
      UPDATE profiles SET badge_level = 'silver' WHERE id = NEW.client_id;
    ELSIF new_total >= 50 THEN
      UPDATE profiles SET badge_level = 'bronze' WHERE id = NEW.client_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_repair_completed
  AFTER UPDATE ON repairs
  FOR EACH ROW EXECUTE FUNCTION award_completion_points();

-- Update avg_rating on reviews
CREATE OR REPLACE FUNCTION update_repairer_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET avg_rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM reviews
    WHERE reviewed_id = NEW.reviewed_id
  ),
  review_count = (
    SELECT COUNT(*) FROM reviews WHERE reviewed_id = NEW.reviewed_id
  )
  WHERE id = NEW.reviewed_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_repairer_rating();
```

### 4.5 Enable Realtime for Chat

Create `supabase/migrations/004_realtime.sql`:

```sql
-- Enable Supabase Realtime on messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE repairs;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
```

### 4.6 Storage Buckets

Run in Supabase Studio or SQL editor:

```sql
-- Create bucket for repair photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('repair-photos', 'repair-photos', true);

-- Policy: authenticated users can upload
CREATE POLICY "repair_photos_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'repair-photos'
    AND auth.uid() IS NOT NULL
  );

-- Policy: photos are public to read
CREATE POLICY "repair_photos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'repair-photos');
```

### 4.7 Run Migrations
```bash
# Apply all migrations to local Supabase
supabase db reset   # Resets and reapplies all migrations + seed

# Or push just new migrations
supabase migration up

# Generate TypeScript types from your schema
supabase gen types typescript --local > src/types/database.types.ts
```

---

## 5. Phase 2 — Next.js Frontend Scaffold

### 5.1 Supabase Clients

`src/lib/supabase/client.ts` — for Client Components:
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

`src/lib/supabase/server.ts` — for Server Components & API routes:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

### 5.2 Auth Middleware

`src/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/request']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

### 5.3 Root Layout

`src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RepairHub — Repair. Reuse. Reconnect.',
  description: 'Find trusted local repair specialists for your devices.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

`src/app/providers.tsx` — React Query + Auth context:
```typescript
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 5.4 Tailwind Design System

Update `tailwind.config.ts` to mirror your HTML CSS variables:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream:        { DEFAULT: '#F6F3EE', 2: '#EDE8DF', 3: '#E3DDD2' },
        green:        { DEFAULT: '#1D4B20', mid: '#2A6430', soft: '#3F8447',
                        light: '#E6EFE7', border: '#B8D4BA' },
        amber:        { DEFAULT: '#B35A1E', mid: '#D06D28',
                        light: '#F4E8DC', border: '#E0B899' },
        blue:         { DEFAULT: '#1A4568', light: '#E2EDF6', border: '#A8C5DC' },
        ink:          { DEFAULT: '#1A1916', 60: '#585650', 40: '#8F8D87', 20: '#C9C7C1' },
        card:         '#FDFCF9',
      },
      borderRadius: {
        sm: '6px', md: '10px', lg: '16px', xl: '24px', full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(26,25,22,.06), 0 1px 2px rgba(26,25,22,.04)',
        md: '0 4px 12px rgba(26,25,22,.08), 0 2px 4px rgba(26,25,22,.04)',
        lg: '0 12px 32px rgba(26,25,22,.10), 0 4px 8px rgba(26,25,22,.04)',
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 6. Phase 3 — Design System & Shared Components

### 6.1 Utility Function

`src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
  }).format(cents / 100)
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
```

### 6.2 StatusBadge Component

`src/components/shared/StatusBadge.tsx`:
```typescript
import { cn } from '@/lib/utils'

type RepairStatus = 'pending' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'disputed'

const STATUS_CONFIG: Record<RepairStatus, { label: string; className: string }> = {
  pending:     { label: 'Pending',     className: 'bg-cream-2 text-ink-60 border-cream-3' },
  quoted:      { label: 'Quoted',      className: 'bg-blue-light text-blue border-blue-border' },
  accepted:    { label: 'Accepted',    className: 'bg-amber-light text-amber border-amber-border' },
  in_progress: { label: 'In Progress', className: 'bg-amber-light text-amber border-amber-border' },
  completed:   { label: 'Completed',   className: 'bg-green-light text-green border-green-border' },
  disputed:    { label: 'Disputed',    className: 'bg-red-50 text-red-700 border-red-200' },
}

export function StatusBadge({ status }: { status: RepairStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border',
      config.className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}
```

### 6.3 Avatar Component

`src/components/shared/Avatar.tsx`:
```typescript
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) return (
    <img src={src} alt={name}
      className={cn('rounded-full object-cover', sizes[size], className)} />
  )
  return (
    <div className={cn(
      'rounded-full bg-green-light border-2 border-green-border',
      'flex items-center justify-center font-semibold text-green',
      sizes[size], className
    )}>
      {getInitials(name)}
    </div>
  )
}
```

---

## 7. Phase 4 — Page-by-Page Component Breakdown

### 7.1 Home Page (Landing)

The landing page from the HTML has these sections. Each becomes a Server Component:

```
src/app/(marketing)/page.tsx
  └── <HeroSection />          — headline, CTAs, hero image
  └── <HowItWorks />           — 3-step explanation cards
  └── <FeaturedRepairers />    — repairer grid (fetched from DB)
  └── <TrustSignals />         — stats, badges, testimonials
```

**AI Prompt to generate HeroSection:**
```
Using our design system (Tailwind, fonts: Playfair Display + Plus Jakarta Sans,
colors: --green #1D4B20, --cream #F6F3EE), create a HeroSection React component.
It should have: a large serif headline "Repair. Reuse. Reconnect.", a subtitle,
two CTAs (btn-primary "Get a Repair Quote" and btn-outline "Become a Repairer"),
and a stat row showing "2,400+ Repairs Done", "98% Satisfaction", "50+ Cities".
Use the existing StatusBadge component to show "Open in your area" in green.
Match the warm, earthy aesthetic of the design system.
```

### 7.2 Request Wizard (4 Steps)

The multi-step form is a client component with local state:

```typescript
// src/components/request/RequestWizard.tsx
'use client'
import { useState } from 'react'
import { Step1DeviceInfo } from './Step1DeviceInfo'
import { Step2PhotoUpload } from './Step2PhotoUpload'
import { Step3Location } from './Step3Location'
import { Step4Confirm } from './Step4Confirm'

export type RepairFormData = {
  deviceType: string
  deviceBrand: string
  deviceModel: string
  issueType: string
  description: string
  photos: File[]
  location: string
  lat?: number
  lng?: number
  budgetMin: number
  budgetMax: number
  urgency: 'asap' | 'normal' | 'flexible'
}

const STEPS = ['Device Info', 'Add Photos', 'Your Location', 'Confirm']

export function RequestWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<RepairFormData>>({})

  const updateData = (data: Partial<RepairFormData>) =>
    setFormData(prev => ({ ...prev, ...data }))

  const next = () => setStep(s => Math.min(s + 1, 4))
  const prev = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div>
      {/* Step indicator — mirrors the HTML's step-circle + step-connector */}
      <StepIndicator currentStep={step} steps={STEPS} />
      {step === 1 && <Step1DeviceInfo data={formData} onNext={(d) => { updateData(d); next() }} />}
      {step === 2 && <Step2PhotoUpload data={formData} onNext={(d) => { updateData(d); next() }} onBack={prev} />}
      {step === 3 && <Step3Location data={formData} onNext={(d) => { updateData(d); next() }} onBack={prev} />}
      {step === 4 && <Step4Confirm data={formData as RepairFormData} onBack={prev} />}
    </div>
  )
}
```

### 7.3 Client Dashboard

The client dashboard has these sections (from HTML analysis):

```
/dashboard/client
  ├── Active Repairs Column (left)
  │   ├── <FilterTabs />              — All / Active / Done
  │   ├── <RepairJourneyCard />       — For each repair (with journey tracker)
  │   │   └── <JourneyTracker />      — 5-step progress bar (Requested → Matched → In Repair → Ready → Done)
  │   └── <PastRepairs />             — Completed repairs with star ratings
  └── Sidebar (right, sticky)
      ├── <GamificationCard />        — Points + badge progress bar
      ├── <ChatPanel />               — Real-time chat panel
      └── <QuickActions />            — Dispute / Re-repair / New repair buttons
```

### 7.4 Repairer Dashboard

```
/dashboard/repairer
  ├── <EarningsSummary />     — This week / total earnings cards
  ├── <JobBoard />            — Pending repairs to bid on
  │   └── <BidForm />         — Inline bid submission
  └── <ActiveJobCard />       — Jobs repairer is currently working on
```

---

## 8. Phase 5 — Core Features Implementation

### 8.1 Authentication (Supabase Auth)

**Sign Up page** (`src/app/(auth)/signup/page.tsx`):
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()

  async function handleSignup(formData: FormData) {
    const { error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          full_name: formData.get('full_name') as string,
        },
      },
    })
    if (!error) router.push('/dashboard/client')
  }

  // render form...
}
```

### 8.2 Real-Time Chat

`src/hooks/useChat.ts`:
```typescript
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export function useChat(repairId: string, currentUserId: string) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch existing messages
  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('repair_id', repairId)
        .order('created_at', { ascending: true })
      setMessages(data ?? [])
      setIsLoading(false)
    }
    fetchMessages()
  }, [repairId])

  // Subscribe to new messages (Supabase Realtime)
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${repairId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `repair_id=eq.${repairId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [repairId])

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    await supabase.from('messages').insert({
      repair_id: repairId,
      sender_id: currentUserId,
      content,
    })
  }, [repairId, currentUserId])

  return { messages, isLoading, sendMessage }
}
```

### 8.3 Photo Upload (Supabase Storage)

`src/components/request/Step2PhotoUpload.tsx`:
```typescript
'use client'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'

export function PhotoUploader({ repairId, onUploaded }: {
  repairId: string
  onUploaded: (paths: string[]) => void
}) {
  const supabase = createClient()

  const onDrop = useCallback(async (files: File[]) => {
    const uploadedPaths: string[] = []

    for (const file of files) {
      const path = `${repairId}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('repair-photos')
        .upload(path, file)

      if (data) {
        uploadedPaths.push(data.path)
        // Save reference in DB
        await supabase.from('repair_photos').insert({
          repair_id: repairId,
          storage_path: data.path,
          is_before: true,
        })
      }
    }
    onUploaded(uploadedPaths)
  }, [repairId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 5,
  })

  return (
    <div {...getRootProps()} className={`
      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
      ${isDragActive ? 'border-green bg-green-light' : 'border-cream-3 hover:border-green-border'}
    `}>
      <input {...getInputProps()} />
      <p className="text-ink-60">Drag photos here, or click to select</p>
      <p className="text-xs text-ink-40 mt-1">Up to 5 photos · JPG, PNG, WEBP</p>
    </div>
  )
}
```

### 8.4 Map Integration (Leaflet — No API Key)

`src/components/map/RepairerMap.tsx` — must be dynamically imported (no SSR):
```typescript
'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon issue with webpack
const icon = L.icon({
  iconUrl: '/marker-icon.png',  // Copy from node_modules/leaflet/dist/images/
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Repairer {
  id: string
  full_name: string
  lat: number
  lng: number
  avg_rating: number
  specialties: string[]
}

export function RepairerMap({ repairers, center }: {
  repairers: Repairer[]
  center: [number, number]
}) {
  return (
    <MapContainer center={center} zoom={13} className="h-80 w-full rounded-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      {repairers.map(r => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={icon}>
          <Popup>
            <strong>{r.full_name}</strong>
            <br />⭐ {r.avg_rating} · {r.specialties.join(', ')}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
```

Use with dynamic import in your page:
```typescript
import dynamic from 'next/dynamic'
const RepairerMap = dynamic(
  () => import('@/components/map/RepairerMap').then(m => m.RepairerMap),
  { ssr: false, loading: () => <div className="h-80 bg-cream-2 rounded-lg animate-pulse" /> }
)
```

### 8.5 React Query Data Fetching

`src/hooks/useRepairs.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useClientRepairs(userId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['repairs', 'client', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repairs')
        .select(`
          *,
          repairer:profiles!repairs_repairer_id_fkey(full_name, avatar_url, avg_rating),
          bids(count),
          messages(count)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useSubmitRepair() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RepairInsert) => {
      const { data: repair, error } = await supabase
        .from('repairs')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return repair
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] })
    },
  })
}
```

---

## 9. Phase 6 — Third-Party Integrations

### 9.1 Stripe Connect (Payments)

**Flow:**
1. Repairer onboarding → create Stripe Connect account
2. Client pays → create PaymentIntent with application fee
3. Funds held in escrow → released when repair is completed

`src/app/api/stripe/webhook/route.ts`:
```typescript
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    await supabase.from('payments')
      .update({ status: 'captured' })
      .eq('stripe_payment_intent', pi.id)
  }

  return NextResponse.json({ received: true })
}
```

### 9.2 Resend (Email Notifications)

`src/lib/resend.ts`:
```typescript
import { Resend } from 'resend'
export const resend = new Resend(process.env.RESEND_API_KEY)
```

`src/app/api/email/route.ts`:
```typescript
import { resend } from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { to, type, data } = await req.json()

  const templates: Record<string, { subject: string; html: string }> = {
    bid_received: {
      subject: `You have a new bid on your repair request`,
      html: `<p>Hi ${data.clientName}, ${data.repairerName} placed a bid of $${data.price} on your ${data.device} repair.</p>`,
    },
    repair_completed: {
      subject: `Your repair is ready! 🎉`,
      html: `<p>Hi ${data.clientName}, your ${data.device} repair has been completed. Please review your experience.</p>`,
    },
  }

  const template = templates[type]
  if (!template) return NextResponse.json({ error: 'Unknown template' }, { status: 400 })

  await resend.emails.send({ from: 'RepairHub <hello@repairhub.app>', to, ...template })
  return NextResponse.json({ sent: true })
}
```

---

## 10. Phase 7 — .github Workflows & CI/CD

### 10.1 CI Workflow

`.github/workflows/ci.yml`:
```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --passWithNoTests
```

### 10.2 Deploy Workflow

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 10.3 DB Migrations Workflow

`.github/workflows/db-migrations.yml`:
```yaml
name: Supabase Migrations

on:
  push:
    branches: [main]
    paths: ['supabase/migrations/**']

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

### 10.4 Pull Request Template

`.github/pull_request_template.md`:
```markdown
## What changed?
<!-- Brief description -->

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] DB migration (schema change)
- [ ] UI/UX update
- [ ] Dependency update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Checked on mobile viewport

## DB Changes
- [ ] Migration file added in `supabase/migrations/`
- [ ] RLS policies updated if needed
- [ ] TypeScript types regenerated (`supabase gen types`)

## Screenshots (if UI change)
<!-- Paste before/after screenshots -->
```

### 10.5 AI Assistant Context File (KEY FILE)

`.github/copilot-instructions.md` — This file is automatically read by GitHub Copilot as project context. Also use it as your Claude prompt prefix:

```markdown
# RepairHub — AI Assistant Context

## Project
Two-sided repair marketplace. Clients post repair jobs; repairers bid and complete them.

## Tech Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS with custom design system (see tailwind.config.ts)
- shadcn/ui for base components
- Supabase (PostgreSQL, Auth, Realtime, Storage)
- React Query (@tanstack/react-query) for data fetching
- Stripe Connect for payments
- Resend for transactional emails
- Leaflet + OpenStreetMap for maps

## Key Conventions
- All database access goes through `@/lib/supabase/client` (client) or `@/lib/supabase/server` (server)
- Never hardcode colors — use Tailwind classes that map to the design system
- All monetary values are stored and handled in **cents** (integer)
- User roles: 'client', 'repairer', 'both'
- Repair statuses: pending → quoted → accepted → in_progress → completed → reviewed
- Use React Query for all client-side data fetching
- Use Server Components for initial page data, Client Components only when needed
- All forms use react-hook-form + zod validation
- Dynamic import `{ ssr: false }` for Leaflet components

## File Naming
- Components: PascalCase.tsx
- Hooks: camelCase.ts (prefix: use*)
- Utilities: camelCase.ts
- DB migrations: NNN_description.sql

## Design System
- Font display: Playfair Display (var(--font-display))
- Font body: Plus Jakarta Sans (var(--font-body))
- Primary green: #1D4B20 (text-green, bg-green)
- Background: #F6F3EE (cream)
- Cards: #FDFCF9 (card)
- Status colors: green=completed, amber=in-progress, blue=quoted, gray=pending

## Database Schema (key tables)
- profiles (extends auth.users)
- repairs (repair_status enum)
- bids (repairers bid on repairs)
- messages (real-time chat per repair)
- reviews (1-5 stars, after completion)
- payments (Stripe integration)
- user_badges (gamification)
```

---

## 11. AI Assistant Prompt Playbook

Use these prompts with Claude or GitHub Copilot. Always prefix with the content of `.github/copilot-instructions.md`.

### Starting a New Component
```
[Paste copilot-instructions.md content]

Create a <ComponentName> React component in src/components/<folder>/.
It receives these props: <describe props>.
It should: <describe behavior>.
Use our Tailwind design system. Do not use inline styles.
Use shadcn/ui primitives where appropriate.
Include TypeScript types for all props.
```

### Writing a Database Query
```
[Paste copilot-instructions.md content]

Write a React Query hook called `use<FeatureName>` in src/hooks/.
It should fetch: <describe what data>.
Use the Supabase client from @/lib/supabase/client.
Include error handling and loading state.
The query key should follow our pattern: ['repairs', 'type', userId].
```

### Writing a DB Migration
```
[Paste copilot-instructions.md content]

Write a Supabase SQL migration file for: <describe change>.
Follow these rules:
- Always use IF NOT EXISTS / IF EXISTS guards
- Add RLS policies for any new table
- Add indexes for foreign keys and commonly filtered columns
- Monetary values in cents (integer)
- Use TIMESTAMPTZ for all timestamps
```

### Debugging a Supabase RLS Issue
```
[Paste copilot-instructions.md content]

I'm getting a Supabase 403 error when trying to <action>.
The user is authenticated as role: <role>.
The table is: <table name>.
Here are the current RLS policies: <paste policies>.
What's wrong and how do I fix it?
```

### Converting HTML Section to React Component
```
[Paste copilot-instructions.md content]

Convert this HTML section into a React component.
Preserve all visual design — replace inline CSS with equivalent Tailwind classes from our design system.
Add prop types for any hardcoded data (names, numbers, statuses).
Split into sub-components if the section has clearly distinct parts.

HTML:
<paste the HTML section here>
```

---

## 12. Best Practices Checklist

### Before You Start Each Feature
- [ ] Write the Supabase migration first, then the UI
- [ ] Check if an RLS policy is needed
- [ ] Is there existing shared component for this? Check `src/components/shared/`
- [ ] Will this need real-time updates? Use Supabase Realtime

### Code Quality
- [ ] No `any` TypeScript types
- [ ] All monetary values in cents
- [ ] No hardcoded user IDs or emails
- [ ] All API calls have error handling
- [ ] Secrets only in `.env.local`, never in code

### Performance
- [ ] Server Components for anything that doesn't need interactivity
- [ ] Dynamic import `{ ssr: false }` for Leaflet and other browser-only libs
- [ ] Images use `next/image` with proper `width`/`height`
- [ ] Supabase queries select only needed columns (not `select('*')` in production)

### Security
- [ ] Every table has RLS enabled
- [ ] Stripe webhooks verify signature before processing
- [ ] No Supabase service role key in client-side code (only anon key)
- [ ] User input validated with Zod before DB insert

### Development Workflow
1. Create a feature branch: `git checkout -b feature/chat-realtime`
2. Write migration, apply locally: `supabase db reset`
3. Regenerate types: `supabase gen types typescript --local > src/types/database.types.ts`
4. Build the feature
5. Open a PR — CI runs automatically
6. Merge → Vercel deploys + migrations run automatically

---

## Quick Start Commands (Daily Dev)

```bash
# Start everything
supabase start          # Local Supabase (Docker)
npm run dev             # Next.js dev server → localhost:3000
# Supabase Studio →     localhost:54323

# After changing DB schema
supabase migration new my_change_name   # Creates new migration file
# Edit the file, then:
supabase db reset                       # Apply + reseed
supabase gen types typescript --local > src/types/database.types.ts

# Stripe webhooks (in a third terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Before committing
npm run lint
npm run type-check
```

---

*This guide covers the complete RepairHub build path. Follow Phases 0→7 in order. Each phase has a clear start and end state. When stuck, use the AI Prompt Playbook with the copilot-instructions.md context file for best results.*
