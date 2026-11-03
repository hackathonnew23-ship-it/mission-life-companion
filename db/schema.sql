CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), phone TEXT UNIQUE, district TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE footprints (id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES users(id), kg_co2 NUMERIC, breakdown JSONB, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE tasks (id SERIAL PRIMARY KEY, code TEXT UNIQUE, title TEXT, kg_saved NUMERIC, points INT);
CREATE TABLE task_completions (id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES users(id), task_id INT REFERENCES tasks(id), done_on DATE, proof_url TEXT, verified BOOLEAN DEFAULT false, UNIQUE (user_id, task_id, done_on));
CREATE TABLE communities (id SERIAL PRIMARY KEY, name TEXT, district TEXT, goal_kg NUMERIC);
CREATE TABLE community_members (community_id INT REFERENCES communities(id), user_id UUID REFERENCES users(id), PRIMARY KEY (community_id, user_id));
CREATE TABLE vendors (id SERIAL PRIMARY KEY, name TEXT, city TEXT, kind TEXT, empanelled BOOLEAN, location GEOGRAPHY(Point));
CREATE TABLE solar_leads (id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES users(id), vendor_id INT REFERENCES vendors(id), kw NUMERIC, status TEXT DEFAULT 'new');
CREATE INDEX idx_completions_user_date ON task_completions (user_id, done_on);
CREATE MATERIALIZED VIEW district_stats AS
  SELECT u.district, count(DISTINCT u.id) users, sum(t.kg_saved) kg_saved
  FROM task_completions c JOIN users u ON u.id=c.user_id JOIN tasks t ON t.id=c.task_id WHERE c.verified GROUP BY u.district;
