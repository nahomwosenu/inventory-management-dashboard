ALTER TABLE users ADD COLUMN clerk_user_id TEXT UNIQUE;
ALTER TABLE sales ADD COLUMN clerk_user_id TEXT;
ALTER TABLE purchase_requests ADD COLUMN clerk_requested_by TEXT;
ALTER TABLE purchase_requests ADD COLUMN clerk_approved_by TEXT;
ALTER TABLE announcements ADD COLUMN clerk_user_id TEXT;

CREATE INDEX idx_users_clerk_user_id ON users(clerk_user_id);
