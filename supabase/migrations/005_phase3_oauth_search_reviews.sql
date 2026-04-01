-- Phase 3: OAuth, Advanced Search, and Enhanced Reviews

-- 1. Add OAuth provider columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS oauth_provider text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS oauth_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;

-- 2. Create reviews table with photo support
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id uuid NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  repairer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  photos text[] DEFAULT '{}',
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Index for efficient review querying
CREATE INDEX IF NOT EXISTS idx_reviews_repairer_id ON reviews(repairer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_repair_id ON reviews(repair_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- 4. Add search-related columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 5. Create search index
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING gin(search_vector);

-- 6. Create search trigger function
CREATE OR REPLACE FUNCTION update_profile_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    coalesce(NEW.full_name, '') || ' ' || 
    coalesce(NEW.bio, '') || ' ' ||
    coalesce(array_to_string(NEW.specialties, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger for search vector
DROP TRIGGER IF EXISTS trigger_update_profile_search ON profiles;
CREATE TRIGGER trigger_update_profile_search
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_search_vector();

-- 8. Create helpful_reviews table for tracking helpful votes
CREATE TABLE IF NOT EXISTS helpful_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- 9. RLS Policy for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reviews"
ON reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews for completed repairs"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM repairs
    WHERE repairs.id = repair_id
    AND repairs.client_id = auth.uid()
    AND repairs.status IN ('completed', 'reviewed')
  )
);

CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- 10. RLS Policy for helpful_reviews
ALTER TABLE helpful_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view helpful votes"
ON helpful_reviews FOR SELECT
USING (true);

CREATE POLICY "Users can add helpful votes"
ON helpful_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own helpful votes"
ON helpful_reviews FOR DELETE
USING (auth.uid() = user_id);

-- 11. Function to update repairer rating after review is created
CREATE OR REPLACE FUNCTION update_repairer_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    avg_rating = (
      SELECT AVG(rating)::numeric(3,2) FROM reviews WHERE repairer_id = NEW.repairer_id
    ),
    review_count = (
      SELECT COUNT(*) FROM reviews WHERE repairer_id = NEW.repairer_id
    )
  WHERE id = NEW.repairer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Trigger to update rating
DROP TRIGGER IF EXISTS trigger_update_repairer_rating ON reviews;
CREATE TRIGGER trigger_update_repairer_rating
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_repairer_rating();

-- 13. Create search stored procedure for advanced queries
CREATE OR REPLACE FUNCTION search_repairers(
  search_query text DEFAULT '',
  specialty_filter text DEFAULT NULL,
  min_rating numeric DEFAULT 0,
  limit_results integer DEFAULT 20,
  offset_results integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  bio text,
  specialties text[],
  avg_rating numeric,
  review_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.specialties,
    p.avg_rating,
    p.review_count
  FROM profiles p
  WHERE 
    (p.role = 'repairer' OR p.role = 'both')
    AND (search_query = '' OR p.search_vector @@ plainto_tsquery('english', search_query))
    AND (specialty_filter IS NULL OR specialty_filter = ANY(p.specialties))
    AND (p.avg_rating IS NULL OR p.avg_rating >= min_rating)
  ORDER BY p.avg_rating DESC NULLS LAST, p.review_count DESC
  LIMIT limit_results
  OFFSET offset_results;
END;
$$ LANGUAGE plpgsql;
