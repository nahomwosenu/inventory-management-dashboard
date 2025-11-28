-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('manager', 'finance', 'store')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  quantity BIGINT NOT NULL DEFAULT 0,
  price DOUBLE PRECISION,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES items(id),
  quantity BIGINT NOT NULL,
  unit_price DOUBLE PRECISION NOT NULL,
  total_price DOUBLE PRECISION NOT NULL,
  sale_date DATE NOT NULL,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Purchase requests table
CREATE TABLE purchase_requests (
  id BIGSERIAL PRIMARY KEY,
  item_name TEXT NOT NULL,
  item_code TEXT,
  quantity BIGINT NOT NULL,
  estimated_price DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  requested_by BIGINT NOT NULL REFERENCES users(id),
  approved_by BIGINT REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_sales_item_id ON sales(item_id);
CREATE INDEX idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX idx_items_code ON items(code);
