-- Seed data for development

-- Insert test users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'client@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"full_name":"Alice Client","role":"client"}'),
  ('00000000-0000-0000-0000-000000000002', 'repairer@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"full_name":"Bob Repairer","role":"repairer"}')
ON CONFLICT DO NOTHING;

-- Profiles are created automatically via trigger
