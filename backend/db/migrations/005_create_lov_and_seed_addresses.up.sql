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
('addresses', 'ሴቻ', 4),
('addresses', 'ሲቀላ ', 4),
('addresses', 'የትነበርሽ', 4),
('addresses', 'ኖክ ሳይት', 4),
('addresses', 'ልማት ', 4),
('addresses', 'ጨርቃ ጨርቅ ', 4),
('addresses', 'ውሃ ምንጭ  ', 4),
('addresses', 'ጉርባ  ', 4),
('addresses', 'ልማት ', 4),
('addresses', 'በቀለሞላ ', 4),
('addresses', 'ኳስ ሜዳ ስፈር', 4),
('addresses', 'ድልፋና  ', 4),
('addresses', 'አርባ ምንጭ ዩኒቨርሲቲ', 4),
('addresses', 'ሻራ', 4),
('addresses', 'ጫኖ', 4),
('addresses', 'ሃይለ ሪዞርት', 4),
('addresses', 'ኤርፖርት', 4),
('addresses', 'አዞ ራንች', 4),
('addresses', 'ዶርዜ ስፈር', 4),
('addresses', 'እትዮፈሽረ', 4),
('addresses', 'ግዞላ ', 4),
('addresses', 'ስሌ', 4),
('addresses', 'ሸሌ', 4);
 







;
