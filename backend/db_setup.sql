-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  usn VARCHAR(10) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  college_name VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Listings Table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  condition VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  suggested_min DECIMAL(10,2),
  suggested_max DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  location VARCHAR(200),
  is_sold BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Price Reference Table
CREATE TABLE IF NOT EXISTS price_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) UNIQUE NOT NULL,
  base_price_min DECIMAL(10,2) NOT NULL,
  base_price_max DECIMAL(10,2) NOT NULL
);

-- Seed Price Reference Data
INSERT INTO price_reference (category, base_price_min, base_price_max) VALUES
  ('Books', 100, 800),
  ('Electronics', 1000, 50000),
  ('Furniture', 500, 15000),
  ('Clothing', 100, 3000),
  ('Cycles & Sports', 500, 10000),
  ('Stationery', 50, 500),
  ('Other', 100, 5000)
ON CONFLICT (category) DO NOTHING;
