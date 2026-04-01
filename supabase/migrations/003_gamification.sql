-- Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Award points for completed repairs
CREATE OR REPLACE FUNCTION award_completion_points()
RETURNS TRIGGER AS $$
DECLARE
  points_earned INT := 50;
  new_total INT;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE profiles
    SET repair_points = repair_points + points_earned,
        total_repairs = total_repairs + 1
    WHERE id = NEW.client_id
    RETURNING repair_points INTO new_total;

    UPDATE profiles
    SET repair_points = repair_points + (points_earned * 2),
        total_repairs = total_repairs + 1
    WHERE id = NEW.repairer_id;

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

CREATE OR REPLACE TRIGGER on_repair_completed
  AFTER UPDATE ON repairs
  FOR EACH ROW EXECUTE FUNCTION award_completion_points();

-- Update repairer rating on reviews
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

CREATE OR REPLACE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_repairer_rating();
