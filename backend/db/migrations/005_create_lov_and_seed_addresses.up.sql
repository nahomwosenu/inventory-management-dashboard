-- LOV table: stores lists of values for various categories
CREATE TABLE lov (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  created_by_user_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lov_category ON lov(category);

-- Seed addresses LOV
INSERT INTO lov (category, value, created_by_user_id) VALUES
('addresses', '123 Main St, Springfield', 1),
('addresses', '456 Elm St, Springfield', 1),
('addresses', '789 Oak Ave, Springfield', 1),
('addresses', '12 River Rd, Lakeside', 1),
('addresses', '34 Mountain Dr, Hillside', 1);
