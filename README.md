# RepairHub: Two-Sided Repair Marketplace

> Repair. Reuse. Reconnect. A modern marketplace connecting people who need device repairs with trusted local repair specialists.

## 🌟 Features

### For Clients
- 📋 Post repair requests in 4 easy steps
- 📸 Upload photos of damaged devices
- 💰 Browse competitive bids from local repairers
- 💬 Real-time chat with repairers
- 🗺️ Find repairers on an interactive map
- ⭐ Leave reviews and track repair progress
- 🔐 Secure payments via Stripe

### For Repairers  
- 📱 Browse available repair jobs in your area
- 💵 Submit competitive bids for jobs
- 💳 Get paid directly via Stripe Connect
- 📊 Track earnings and repair history
- 🎯 Build reputation with client reviews
- 🏆 Earn badges for quality and reliability

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| **Payments** | Stripe Connect |
| **Email** | Resend |
| **Maps** | Leaflet + OpenStreetMap (no API key needed) |
| **Forms** | React Hook Form + Zod validation |
| **Data Fetching** | React Query (@tanstack/react-query) |
| **CI/CD** | GitHub Actions, Vercel |

---

## 📁 Project Structure

```
repairhub/
├── .github/
│   └── workflows/          # GitHub Actions (CI/CD, deploy)
├── supabase/
│   ├── migrations/         # Database schema (4 SQL files)
│   ├── config.toml        # Local dev config
│   └── seed.sql           # Sample data
├── src/
│   ├── app/               # Next.js 14 App Router
│   │   ├── (marketing)/   # Home, landing pages
│   │   ├── (auth)/        # Login, signup
│   │   ├── (dashboard)/   # Client & repairer dashboards
│   │   ├── request/       # 4-step repair wizard
│   │   ├── repairs/[id]/  # Repair detail page
│   │   └── api/           # API routes (Stripe, email, webhooks)
│   ├── components/        # React components
│   │   ├── shared/        # StatusBadge, Avatar, etc.
│   │   ├── layout/        # Navbar, Footer
│   │   ├── wizard/        # 4-step form components
│   │   ├── chat/          # ChatPanel, MessageBubble
│   │   ├── dashboard/     # Dashboard components
│   │   ├── map/           # RepairerMap
│   │   └── payment/       # StripeConnectSetup
│   ├── hooks/             # React Query + custom hooks
│   ├── lib/               # Utilities (Supabase, Stripe, email)
│   └── styles/            # Global CSS
├── docker-compose.yml     # Local Supabase setup
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Design system (colors, fonts)
└── README.md              # This file
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url> repairhub
cd repairhub
npm install
```

### 2. Set Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 3. Start Local Supabase
```bash
docker-compose up -d
# Runs on localhost:8000
```

### 4. Run Development Server
```bash
npm run dev
# Opens http://localhost:3000
```

### 5. Run Database Migrations
```bash
supabase db push
# Or manually run SQL from supabase/migrations/
```

---

## 📦 Installed Features

### ✅ Phase 0: Environment Setup
- Next.js 14 project scaffold
- TypeScript strict mode
- Tailwind CSS with custom design system
- All 400+ dependencies installed
- Production build verified working

### ✅ Phase 1: Core Features  
- **Database Schema**: 11 tables with relations
- **Authentication**: Supabase auth + middleware
- **React Query Hooks**: useRepairs, useChat, useAuth
- **Repair Wizard**: 4-step form with validation
- **Photo Upload**: Supabase Storage integration
- **Real-time Chat**: Supabase Realtime subscriptions
- **Dashboard Components**: BidForm, JourneyTracker, EarningsSummary

### ✅ Phase 2: Integrations
- **Stripe Connect**: Repairer onboarding and payments
- **Email Service**: Resend integration for notifications
- **Maps**: Leaflet map for repairer discovery
- **CI/CD**: GitHub Actions workflows
- **Docker**: Local development environment

---

## 🎨 Design System

### Colors (Tailwind)
- **Green**: `#1D4B20` (action, success)
- **Amber**: `#B35A1E` (warning, in-progress)
- **Cream**: `#F6F3EE` (background, neutral)
- **Ink**: `#1A1916` (text, dark)

### Fonts
- **Display**: Playfair Display (large headings)
- **Body**: Plus Jakarta Sans (readable text)

### Spacing Scale
- Responsive grid: 4px baseline
- Matches standard Tailwind scale

---

## 🔐 Authentication Flow

1. User signs up with email/password
2. Confirmation email sent via Resend
3. Auto-profile created in Supabase
4. Auth middleware protects routes
5. JWT stored in HTTP-only cookies
6. Real-time user presence via Supabase

---

## 💳 Payment Flow

### Client → Repairer Payment
1. Client accepts a bid
2. Stripe payment intent created
3. Client enters card details
4. Webhook confirms payment
5. Repairer sees payout (minus 10% fee)
6. Email confirmation sent to both

### Repairer Onboarding
1. Repairer clicks "Get Paid"
2. Stripe Connect Express account created
3. Redirect to Stripe onboarding
4. Account linked to profile
5. Ready to receive payments

---

## 📊 Database Schema Highlights

### Repair Lifecycle
- Status enum: pending → quoted → accepted → in_progress → completed → reviewed
- Photos: before/after repair images
- Bids: repairer quotes with price & timeline
- Messages: real-time chat between client & repairer
- Reviews: client feedback on repairer

### Gamification
- Repair points: earned on completion
- Badge levels: newcomer → bronze → silver → gold
- User ratings: calculated from reviews

### Row-Level Security (RLS)
- Users see only their own repairs
- Repairers see only jobs in their area
- Admins have full access

---

## 🧪 Testing & Deployment

### Local Testing
```bash
npm run build      # Production build
npm run lint       # ESLint
npm run type-check # TypeScript
npm test           # Unit tests (if Jest configured)
```

### Deploy to Vercel
```bash
git push origin main
# Automatically deploys via GitHub Actions
```

### Deploy Database Migrations
```bash
supabase db push --remote
```

---

## 🛠️ Development Tips

### Add New Components
- Place in `src/components/<category>/ComponentName.tsx`
- Use `"use client"` for interactive components
- Import shared components from `src/components/shared/`

### Add New Routes
- Create folders in `src/app/`
- Use route groups `(name)` for layout sharing
- Protected routes go in `(dashboard)/`

### Update Database
- Create migration file: `supabase/migrations/XXX_name.sql`
- Test locally: `supabase db push`
- Push to production: `supabase db push --remote`

### Add API Endpoints
- Create route file: `src/app/api/name/route.ts`
- Implement GET, POST, etc. handlers
- Use Supabase client for DB access

---

## 📚 Documentation

- [Setup & Deployment Guide](./SETUP.md)
- [Developer Guide](./RepairHub_Developer_Guide.md)
- [UI Design](./UI_design_version2.html) - Click to view in browser

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Make changes locally, test with `npm run build`
3. Push and create a pull request
4. GitHub Actions will run CI checks
5. Merge after review

---

## 📄 License

Private project - All rights reserved.

---

## 🎯 Roadmap

- [ ] User authentication (OAuth providers)
- [ ] Profile completion onboarding
- [ ] Advanced search & filtering
- [ ] Dispute resolution system
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] API for third-party integrations

---

## 📞 Support

For setup questions, see [SETUP.md](./SETUP.md).

For technical issues, check [RepairHub_Developer_Guide.md](./RepairHub_Developer_Guide.md).

---

**Built with ❤️ using Next.js + Supabase**
