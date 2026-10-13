CREATE TABLE IF NOT EXISTS songs (
  id_song      SERIAL PRIMARY KEY,
  song_name    VARCHAR(70) NOT NULL,
  artist_name  VARCHAR(70) NOT NULL,
  lyrics_path  VARCHAR(100),            -- synced lyrics (.lrc file), e.g. /lrc/die-for-me.lrc
  audio_path   VARCHAR(100) NOT NULL,   -- audio file, e.g. /audio/die-for-me.mp3
  cover_path   VARCHAR(100) NOT NULL,   -- album cover image, e.g. /images/die-for-me.png
  album_name   VARCHAR(70),
  explicit_tag BOOLEAN
);

-- Example row. Paths are relative to the app's public/ folder.
-- (public/lrc, public/audio, public/images).
INSERT INTO songs (song_name, artist_name, lyrics_path, audio_path, cover_path, album_name, explicit_tag)
VALUES (
  'DIE FOR ME',
  'Chase Atlantic',
  '/lrc/die-for-me.lrc',
  '/audio/die-for-me.mp3',
  '/images/die-for-me.png',
  'DIE FOR ME',
  TRUE
);