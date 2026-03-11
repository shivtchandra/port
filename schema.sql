-- Existing transmissions table
CREATE TABLE IF NOT EXISTS transmissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending'
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    stack TEXT[] NOT NULL,
    github_link TEXT,
    demo_link TEXT,
    display_order INTEGER DEFAULT 0
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id TEXT PRIMARY KEY, -- Using custom string IDs like EXP-001
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    tech TEXT[] NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    category_title TEXT NOT NULL,
    skills_list TEXT[] NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    preview TEXT NOT NULL,
    link TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Leadership Table
CREATE TABLE IF NOT EXISTS leadership (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT NOT NULL,
    event TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    cert_id TEXT,
    display_order INTEGER DEFAULT 0
);

-- Site Settings (for About page)
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY, -- e.g., 'about'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content JSONB NOT NULL
);

-- Freelance Missions Table
CREATE TABLE IF NOT EXISTS freelance_missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_name TEXT NOT NULL,
    mission_title TEXT NOT NULL,
    description TEXT NOT NULL,
    services TEXT[] NOT NULL,
    result_metric TEXT, -- e.g. "30% faster load time"
    link TEXT,
    display_order INTEGER DEFAULT 0
);

-- Enable RLS for all
ALTER TABLE transmissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelance_missions ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON leadership FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON freelance_missions FOR SELECT USING (true);

-- Authenticated (Admin) full access
-- Note: In production, use more granular roles. For now, allowing all for demo purposes or using SERVICE_ROLE in admin pages.
CREATE POLICY "Admin Full Access" ON transmissions FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON projects FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON experience FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON skills FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON blogs FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON leadership FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON certifications FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON site_settings FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON freelance_missions FOR ALL USING (true);
