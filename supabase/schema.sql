-- Create reports table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('shikko', 'shokuho')) NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  destinations JSONB,
  total_distance NUMERIC NOT NULL,
  etc_fee NUMERIC NOT NULL,
  holiday_allowance NUMERIC NOT NULL,
  travel_allowance NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('draft', 'pending', 'submitted')) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
