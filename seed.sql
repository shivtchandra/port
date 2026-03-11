-- Clear existing data to avoid primary key conflicts
TRUNCATE projects, experience, skills, blogs, leadership, certifications, freelance_missions, site_settings CASCADE;

-- Projects
INSERT INTO projects (title, category, description, stack, github_link, demo_link, display_order) VALUES
('Resumit', 'AI Resume Intelligence', 'AI-powered resume platform featuring feedback, scoring, improvement suggestions using LLMs, and a smart template recommendation engine.', ARRAY['React.js', 'Python', 'OpenAI API', 'Vercel'], '#', 'https://resumit-kappa.vercel.app', 1),
('Instant Tab Screenshot', 'Chrome Extension', 'Multi-mode screenshot capture tool (visible, selection, full-page) with 5.0 rating on Chrome Web Store.', ARRAY['JavaScript', 'Chrome API', 'Manifest V3'], '#', 'https://chromewebstore.google.com/detail/nfjacblekofgmkigcfonfdgabjedkdao', 2),
('CivicWatch', 'Civic Reporting', 'Incident tracking and reporting platform with geolocation and optimized PostgreSQL schemas for efficiency.', ARRAY['TypeScript', 'Express.js', 'Prisma', 'PostgreSQL', 'Docker'], '#', '#', 3),
('Medical Impact Predictor', 'Clinical AI', 'ML system predicting hospital stays/costs using MIMIC-IV dataset (430K+ records) with XGBoost quantile regression.', ARRAY['Python', 'XGBoost', 'Flask', 'React'], '#', '#', 4);

-- Experience (Using Upsert logic for custom IDs)
INSERT INTO experience (id, role, company, period, description, tech, display_order) VALUES
('EXP-001', 'Multicloud Engineer Associate', 'Cognizant', 'Feb 2026 – Present', 'Undergoing structured training across AWS, Azure, and GCP as part of the Multicloud Engineer track.', ARRAY['AWS', 'Azure', 'GCP', 'Cloud Infrastructure'], 1),
('EXP-002', 'Freelance Full-Stack Developer', 'Self-Employed', 'Dec 2025 - Feb 2026', 'Designed and delivered two production platforms: a cybersecurity LMS (CyberSecurityTrain) and a B2B services portal (TheCyberSeal).', ARRAY['React 18', 'Next.js 15', 'Firebase', 'Supabase', 'Razorpay'], 2),
('EXP-003', 'AI / Full-Stack Automation Intern', 'Callus', 'Oct 2025 - Dec 2025', 'Built an AI-powered SEO research platform. Automated workflows using n8n and re-implemented as a FastAPI/React application.', ARRAY['FastAPI', 'Python', 'React', 'n8n', 'Pinecone', 'OpenAI'], 3),
('EXP-004', 'Technical Intern', 'Getto', 'July 2025 - Oct 2025', 'Enhanced the Getto Vendor Panel. Built UI components, streamlined product management, and optimized database interactions.', ARRAY['React.js', 'Express.js', 'Node.js', 'PostgreSQL', 'Docker'], 4),
('EXP-005', 'Machine Learning Intern', 'Tuzen Tech Solutions', 'May 2024 - July 2024', 'Developed ML-based counterfeit currency detection with audio feedback for visually impaired users. Achieved 95%+ accuracy.', ARRAY['Python', 'TensorFlow', 'Computer Vision', 'Scikit-learn'], 5),
('EXP-006', 'Academic Support Volunteer', 'Make A Difference (MAD)', 'March 2025 - Present', 'Mentoring underprivileged students in foundational subjects and fostering consistent learning habits.', ARRAY['Mentorship', 'Education', 'Social Impact'], 6)
ON CONFLICT (id) DO UPDATE SET 
  role = EXCLUDED.role,
  company = EXCLUDED.company,
  period = EXCLUDED.period,
  description = EXCLUDED.description,
  tech = EXCLUDED.tech,
  display_order = EXCLUDED.display_order;

-- Skills
INSERT INTO skills (category_title, skills_list, display_order) VALUES
('PROGRAMMING', ARRAY['Core Java', 'Python', 'JavaScript', 'TypeScript'], 1),
('AI / ML CORE', ARRAY['Neural Networks', 'Deep Learning', 'NLP', 'LLMs', 'LangChain', 'RAG', 'TensorFlow', 'PyTorch'], 2),
('FRONTEND', ARRAY['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind', 'Framer Motion'], 3),
('BACKEND', ARRAY['Node.js', 'Express.js', 'Prisma ORM', 'FastAPI'], 4),
('INFRASTRUCTURE', ARRAY['AWS', 'Azure', 'GCP', 'PostgreSQL', 'Firebase', 'Supabase', 'Docker', 'Git'], 5),
('TOOLS & ANALYTICS', ARRAY['Tableau', 'Power BI', 'n8n', 'Chrome Extension API'], 6);

-- Blogs
INSERT INTO blogs (title, date, preview, link, display_order) VALUES
('AI-Powered Resume Ecosystem', '2025-01-10', 'Exploring how LLMs and RAG systems can revolutionize the hiring process through intelligent feedback...', '#', 1),
('Building for the Chrome Web Store', '2024-11-20', 'Lessons learned from publishing extensions with zero-data collection policies and public user traction...', '#', 2);

-- Leadership
INSERT INTO leadership (role, event, description, display_order) VALUES
('External Affairs Manager', 'Shore Fest', 'Managed external communications and partnerships, coordinating with vendors and promoting event visibility.', 1),
('Food Department In-Charge', 'Gusto Sports Event', 'Oversaw food operations for a three-day inter-university sports event, ensuring health standards and quality.', 2);

-- Certifications
INSERT INTO certifications (title, issuer, cert_id, display_order) VALUES
('Core Java', 'Coursera', 'CJ-CERT-2024', 1),
('Google Analytics', 'Google', 'GA-CERT-2024', 2),
('Data Structures and Algorithms', 'Coursera', 'DSA-ADV-2024', 3);

-- Freelance Missions
INSERT INTO freelance_missions (client_name, mission_title, description, services, result_metric, link, display_order) VALUES
('CyberSecurityTrain', 'EdTech LMS Platform', 'Built a full cybersecurity LMS with course delivery, Razorpay payments, custom exam engine, and certificate verification.', ARRAY['React 18', 'Next.js 15', 'Firebase', 'Razorpay', 'jsPDF'], 'Handled end-to-end production deployment', 'https://cybersecuritytrain.com', 1),
('TheCyberSeal', 'B2B Services Portal', 'Developed a portal with gated resources, lead capture pipeline, and real-time threat alerts dashboard.', ARRAY['Vite', 'Supabase', 'Tailwind CSS', 'Framer Motion'], 'Integrated real-time threat detection UI', 'https://thecyberseal.com', 2);

-- Site Settings (About)
INSERT INTO site_settings (id, content) VALUES
('about', '{
  "bio": "Full-Stack & AI Engineer with hands-on experience building production-grade systems including a full LMS/EdTech platform, cybersecurity services portal, AI-powered tools, and published Chrome extensions. Specialized in LLM integrations, RAG systems, and multi-role admin systems.",
  "location": "Hyderabad, India",
  "mission": "Currently working as a Multicloud Engineer Associate at Cognizant. Ready for deployment in mission-critical AI and Full-Stack roles.",
  "specializations": ["Full-Stack Engineering", "AI/ML & RAG Systems", "Cloud Infrastructure (AWS/Azure/GCP)", "Product Automation"],
  "education_title": "B.E. in CSE (2021–2025)",
  "education_school": "GITAM University"
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;
