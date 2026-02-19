
-- Bu komutları Vercel Proje Paneli -> Storage -> Data sekmesindeki "Query" alanına yapıştırıp çalıştırın.

-- 1. Kullanıcılar Tablosu
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'therapist', 'client', 'admin'
  avatar_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Materyaller Tablosu (AI ile üretilenler buraya kaydedilir)
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- 'Flashcards', 'Story' etc.
  content JSONB, -- AI'dan gelen yapısal JSON verisi
  image_url TEXT,
  target_sound VARCHAR(10),
  age_group VARCHAR(50),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seanslar Tablosu
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  therapist_id INTEGER REFERENCES users(id),
  client_id INTEGER REFERENCES users(id),
  session_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metrics JSONB, -- { accuracy: 80, fluency: 70 } gibi veriler
  status VARCHAR(50) DEFAULT 'completed'
);

-- 4. Örnek Veri Ekleme (Opsiyonel)
INSERT INTO users (full_name, email, role, status) VALUES 
('Dr. Selin Kaya', 'selin@theraspeech.ai', 'therapist', 'active'),
('Ahmet Yılmaz', 'ahmet@gmail.com', 'client', 'active')
ON CONFLICT (email) DO NOTHING;
