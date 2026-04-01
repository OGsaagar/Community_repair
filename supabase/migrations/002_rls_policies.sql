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
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_trigger" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==============================
-- REPAIRS
-- ==============================
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

-- ==============================
-- REPAIR_PHOTOS
-- ==============================
CREATE POLICY "repair_photos_select" ON repair_photos
  FOR SELECT USING (TRUE);

CREATE POLICY "repair_photos_insert" ON repair_photos
  FOR INSERT WITH CHECK (
    repair_id IN (
      SELECT id FROM repairs
      WHERE client_id = auth.uid() OR repairer_id = auth.uid()
    )
  );

-- ==============================
-- PAYMENTS
-- ==============================
CREATE POLICY "payments_select" ON payments
  FOR SELECT USING (
    repair_id IN (
      SELECT id FROM repairs
      WHERE client_id = auth.uid() OR repairer_id = auth.uid()
    )
  );

CREATE POLICY "payments_insert" ON payments
  FOR INSERT WITH CHECK (
    repair_id IN (
      SELECT id FROM repairs WHERE client_id = auth.uid()
    )
  );

-- ==============================
-- USER_BADGES
-- ==============================
CREATE POLICY "user_badges_select" ON user_badges
  FOR SELECT USING (TRUE);

CREATE POLICY "user_badges_insert" ON user_badges
  FOR INSERT WITH CHECK (user_id = auth.uid());
