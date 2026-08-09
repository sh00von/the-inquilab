CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT,
  description TEXT,
  archive_link TEXT,
  image TEXT,
  is_killed INTEGER NOT NULL DEFAULT 0,
  approved INTEGER NOT NULL DEFAULT 0,
  published TEXT
);
