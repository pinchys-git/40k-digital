-- Research items: individual facts/signals captured per scan
CREATE TABLE IF NOT EXISTS research_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                    -- Headline or signal title
  summary TEXT NOT NULL,                  -- 2-3 sentence description
  source_url TEXT,                        -- Verified URL (never hallucinated)
  source_name TEXT,                       -- Publication/site name
  category TEXT NOT NULL,                 -- ai-marketing | ai-agents | performance | agency-news | competitor | tech | audience
  confidence TEXT DEFAULT 'medium',       -- high | medium | low (based on # of sources)
  fact_checked INTEGER DEFAULT 0,         -- 0 = raw, 1 = cross-referenced 2+ sources
  published_date TEXT,                    -- When the source was published (ISO 8601)
  captured_at TEXT DEFAULT (datetime('now')),
  scan_session TEXT,                      -- YYYY-MM-DD-am or YYYY-MM-DD-pm
  tags TEXT,                              -- JSON array string
  relevance_score INTEGER DEFAULT 5,      -- 1-10, how relevant to 40K Digital
  competitor_name TEXT,                   -- If category=competitor, who
  action_recommended TEXT                 -- 'blog' | 'social' | 'newsletter' | 'monitor' | null
);

-- Research briefs: metadata for each scan session
CREATE TABLE IF NOT EXISTS research_briefs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_date TEXT NOT NULL,               -- YYYY-MM-DD
  session TEXT NOT NULL,                 -- 'am' or 'pm'
  executive_summary TEXT,               -- 2-3 sentence overview
  item_count INTEGER DEFAULT 0,
  top_signals TEXT,                      -- JSON array of top 3 item IDs
  content_opportunities TEXT,            -- JSON array of suggested content angles
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_research_items_category ON research_items(category);
CREATE INDEX IF NOT EXISTS idx_research_items_scan_session ON research_items(scan_session);
CREATE INDEX IF NOT EXISTS idx_research_items_captured ON research_items(captured_at);
CREATE INDEX IF NOT EXISTS idx_research_items_action ON research_items(action_recommended);
CREATE INDEX IF NOT EXISTS idx_research_briefs_date ON research_briefs(scan_date);
