-- ==============================
-- ENUMS
-- ==============================
CREATE TYPE repair_status AS ENUM (
  'pending',
  'quoted',
  'accepted',
  'in_progress',
  'completed',
  'reviewed',
  'disputed',
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
  badge_level   TEXT NOT NULL DEFAULT 'newcomer',
  total_repairs INT NOT NULL DEFAULT 0,
  -- Repairer-specific
  specialties   TEXT[],
  avg_rating    DECIMAL(3,2),
  review_count  INT NOT NULL DEFAULT 0,
  stripe_account_id TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- REPAIR REQUESTS
-- ==============================
CREATE TABLE repairs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES profiles(id),
  repairer_id   UUID REFERENCES profiles(id),
  -- Device info
  device_type   TEXT NOT NULL,
  device_brand  TEXT NOT NULL,
  device_model  TEXT,
  issue_type    TEXT NOT NULL,
  description   TEXT NOT NULL,
  -- Location
  location_text TEXT NOT NULL,
  lat           DECIMAL(9,6),
  lng           DECIMAL(9,6),
  -- Pricing
  budget_min    INT,
  budget_max    INT,
  final_price   INT,
  -- Status
  status        repair_status NOT NULL DEFAULT 'pending',
  urgency       TEXT DEFAULT 'normal',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Photos for a repair
CREATE TABLE repair_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id  UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  is_before  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- BIDS
-- ==============================
CREATE TABLE bids (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id   UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  repairer_id UUID NOT NULL REFERENCES profiles(id),
  price       INT NOT NULL,
  eta_hours   INT,
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
  amount                INT NOT NULL,
  platform_fee          INT,
  status                TEXT DEFAULT 'pending',
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
