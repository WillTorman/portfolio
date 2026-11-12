CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  technology VARCHAR(255) NOT NULL,
  project_url VARCHAR(500),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'in_progress', 'replied', 'closed')),
  response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_comments (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO projects (title, slug, summary, description, technology, project_url, featured)
VALUES
  ('Clockr', 'clockr', 'An Android application for tracking work hours and pay.',
   'Clockr helps users record shifts, calculate earnings, and understand their work history through a focused mobile experience.',
   'Android, Kotlin, SQLite', NULL, TRUE),
  ('Lynn''s Library', 'lynns-library', 'A C++ library and book tracking application.',
   'A practical desktop application demonstrating object-oriented design, persistence, and user-focused workflows.',
   'C++, SQL', NULL, TRUE),
  ('Thortech LLC', 'thortech', 'A web application for a personal technology business.',
   'A business-focused web platform designed around clear content, maintainable backend services, and helpful customer interactions.',
   'JavaScript, Node.js, PostgreSQL', NULL, TRUE)
ON CONFLICT (slug) DO NOTHING;
