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
delete from lov;
INSERT INTO lov (category, value, created_by_user_id) VALUES
('addresses', 'ሴቻ', 1),
('addresses', 'ሲቀላ ', 1),
('addresses', 'የትነበርሽ', 1),
('addresses', 'ኖክ ሳይት', 1),
('addresses', 'ልማት ', 1),
('addresses', 'ጨርቃ ጨርቅ ', 1),
('addresses', 'ውሃ ምንጭ  ', 1),
('addresses', 'ጉርባ  ', 1),
('addresses', 'ልማት ', 1),
('addresses', 'በቀለሞላ ', 1),
('addresses', 'ኳስ ሜዳ ስፈር', 1),
('addresses', 'ድልፋና  ', 1),
('addresses', 'አርባ ምንጭ ዩኒቨርሲቲ', 1),
('addresses', 'ሻራ', 1),
('addresses', 'ጫኖ', 1),
('addresses', 'ሃይለ ሪዞርት', 1),
('addresses', 'ኤርፖርት', 1),
('addresses', 'አዞ ራንች', 1),
('addresses', 'ዶርዜ ስፈር', 1),
('addresses', 'እትዮፈሽረ', 1),
('addresses', 'ግዞላ ', 1),
('addresses', 'ስሌ', 1),
('addresses', 'ሸሌ', 1);
 







;
