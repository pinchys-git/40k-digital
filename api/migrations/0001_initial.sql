-- Contacts / Lead capture
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact_form',
  turnstile_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  metadata TEXT
);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_created ON contacts(created_at);

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  tags TEXT, -- JSON array string
  author TEXT DEFAULT '40K Digital',
  hero_image TEXT,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at);

-- Fit test results
CREATE TABLE IF NOT EXISTS fit_tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  answers TEXT NOT NULL, -- JSON object of question:answer
  score INTEGER,
  grade TEXT, -- A, B, C, D, F
  email TEXT,
  name TEXT,
  company TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_fit_tests_created ON fit_tests(created_at);
CREATE INDEX idx_fit_tests_grade ON fit_tests(grade);
