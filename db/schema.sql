
-- ==========================================
-- THERASPEECH PROD SCHEMA v2.0
-- Modüller: Auth, Klinik, Gamification, Community, Marketing, Finans
-- ==========================================

-- 1. KULLANICILAR VE PROFİLLER
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('therapist', 'client', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  
  -- Gamification Alanları
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  
  -- Abonelik Durumu
  subscription_plan VARCHAR(50) DEFAULT 'Free', -- Free, Basic, Pro, Clinic
  subscription_status VARCHAR(50) DEFAULT 'active',
  next_billing_date TIMESTAMP WITH TIME ZONE,
  remaining_sessions INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP WITH TIME ZONE
);

-- 2. KLİNİK MATERYALLER (AI & Manuel)
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- Flashcards, Story, MinimalPairs, Game
  category VARCHAR(100) DEFAULT 'General',
  
  -- AI İçeriği (JSONB ile esnek yapı)
  content JSONB, 
  image_url TEXT,
  
  -- Filtreleme Etiketleri
  target_sound VARCHAR(10),
  position VARCHAR(20), -- Initial, Medial, Final
  age_group VARCHAR(50),
  difficulty VARCHAR(20), -- Easy, Medium, Hard
  
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SEANSLAR VE RANDEVULAR
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  therapist_id INTEGER REFERENCES users(id),
  client_id INTEGER REFERENCES users(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, active, completed, cancelled
  type VARCHAR(50) DEFAULT 'Online Therapy',
  
  -- Seans Verileri
  clinical_notes TEXT,
  session_flow JSONB, -- Seans sırasında kullanılan materyal listesi
  ai_analysis_report TEXT, -- Gemini tarafından üretilen özet
  metrics JSONB, -- { accuracy: 85, engagement: 90 }
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. GAMIFICATION: ROZETLER VE GÖREVLER
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  condition_type VARCHAR(50), -- streak, xp, session_count
  condition_value INTEGER
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id INTEGER REFERENCES users(id),
  badge_id INTEGER REFERENCES badges(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS quests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  xp_reward INTEGER,
  category VARCHAR(50), -- daily, weekly
  target_count INTEGER, -- Örn: 10 tekrar
  icon VARCHAR(50)
);

-- 5. COMMUNITY: SOHBET VE KANALLAR
CREATE TABLE IF NOT EXISTS chat_channels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) DEFAULT 'public', -- public, private
  category VARCHAR(50), -- clinical, general
  icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER REFERENCES chat_channels(id),
  sender_id INTEGER REFERENCES users(id),
  content TEXT,
  type VARCHAR(20) DEFAULT 'text', -- text, material, image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. FİNANS VE FATURALAR
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  status VARCHAR(20) DEFAULT 'Paid', -- Paid, Pending, Overdue
  service_name VARCHAR(255),
  invoice_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  pdf_url TEXT
);

-- 7. PAZARLAMA KAMPANYALARI
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50), -- Meta, Google, LinkedIn
  budget DECIMAL(10, 2),
  spend DECIMAL(10, 2),
  conversions INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, paused, completed
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);

-- 8. AKADEMİK KÜTÜPHANE & KAYDEDİLENLER
CREATE TABLE IF NOT EXISTS academic_papers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source VARCHAR(100), -- PubMed, Cochrane
  year INTEGER,
  uri TEXT,
  clinical_impact TEXT,
  tags TEXT[] -- Array of strings
);

CREATE TABLE IF NOT EXISTS saved_papers (
  user_id INTEGER REFERENCES users(id),
  paper_id INTEGER REFERENCES academic_papers(id),
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, paper_id)
);

-- 9. SİSTEM LOGLARI (Admin & Quality Control)
CREATE TABLE IF NOT EXISTS system_logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(10), -- INFO, WARN, ERROR, CRIT
  message TEXT,
  source VARCHAR(50), -- API, DB, AUTH
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA (BAŞLANGIÇ VERİLERİ)
-- ==========================================

-- Kullanıcılar
INSERT INTO users (full_name, email, role, avatar_url, subscription_plan, xp, level, bio) VALUES
('Dr. Selin Kaya', 'selin@theraspeech.ai', 'therapist', 'https://i.pravatar.cc/150?u=u1', 'Clinic', 12500, 14, '12 Yıllık pediatrik dil ve konuşma terapisti.'),
('Ahmet Yılmaz', 'ahmet@gmail.com', 'client', 'https://i.pravatar.cc/150?u=u2', 'Pro', 450, 3, 'Artikülasyon bozukluğu terapisi alıyor.'),
('Sistem Yöneticisi', 'admin@theraspeech.ai', 'admin', 'https://i.pravatar.cc/150?u=u3', 'Enterprise', 99999, 99, 'Root Access'),
('Dkt. Elif Ak', 'elif@theraspeech.ai', 'therapist', 'https://i.pravatar.cc/150?u=u4', 'Clinic', 8200, 10, 'Kekemelik uzmanı.')
ON CONFLICT (email) DO NOTHING;

-- Sohbet Kanalları
INSERT INTO chat_channels (name, description, category, icon) VALUES
('Artikülasyon & Fonoloji', 'Ses üretim hataları tartışma grubu.', 'clinical', 'record_voice_over'),
('Otizm Spektrum', 'OSB iletişim stratejileri.', 'clinical', 'extension'),
('Klinik İşletme', 'Ofis yönetimi ve kariyer.', 'general', 'work');

-- Pazarlama Kampanyaları
INSERT INTO campaigns (name, platform, spend, conversions, status) VALUES
('Global Lansman', 'Meta', 12400.00, 4200, 'active'),
('Google Search Ads', 'Google', 5100.00, 1250, 'active');

-- Örnek Rozetler
INSERT INTO badges (title, icon, condition_type, condition_value) VALUES
('İlk Adım', 'footprint', 'session_count', 1),
('Haftalık Seri', 'local_fire_department', 'streak', 7),
('Kelime Ustası', 'school', 'xp', 1000);

-- Faturalar
INSERT INTO invoices (user_id, amount, service_name, status) 
SELECT id, 1600.00, 'Pro Klinik Paketi (Aylık)', 'Paid' FROM users WHERE role = 'client' LIMIT 1;

-- Akademik Makaleler
INSERT INTO academic_papers (title, source, year, clinical_impact, tags, uri) VALUES
('Efficacy of Telepractice in Speech Sound Disorders', 'PubMed', 2023, 'Uzaktan terapinin yüz yüze terapi kadar etkili olduğunu kanıtlayan meta-analiz.', ARRAY['Telehealth', 'SSD', 'Pediatric'], 'https://pubmed.gov/example1'),
('AI-Driven Biofeedback Systems', 'IEEE', 2024, 'Yapay zeka destekli görsel geri bildirimin artikülasyon hızına etkisi.', ARRAY['AI', 'Biofeedback', 'Tech'], 'https://ieee.org/example2');

