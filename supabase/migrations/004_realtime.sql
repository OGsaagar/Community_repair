-- Enable Realtime for real-time features
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE repairs;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
