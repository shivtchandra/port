-- Clear existing data to avoid primary key conflicts
TRUNCATE projects, experience, skills, blogs, leadership, certifications, freelance_missions, site_settings CASCADE;

-- Projects
INSERT INTO projects (title, category, description, stack, github_link, demo_link, display_order) VALUES
('Resumit', 'AI Resume Intelligence', 'Full-stack AI platform with intelligent resume analysis (feedback, scoring, suggestions) and template engine. 200+ resumes analyzed.', ARRAY['React.js', 'Python', 'OpenAI API', 'Vercel'], '#', 'https://resumit-kappa.vercel.app', 1),
('Instant Tab Screenshot', 'Chrome Extension', 'Published multi-mode screenshot capture tool (visible, area, full-page, scroll) with 5.0 rating on Chrome Web Store.', ARRAY['JavaScript', 'Chrome Extension API', 'Manifest V3'], '#', 'https://chromewebstore.google.com/detail/nfjacblekofgmkigcfonfdgabjedkdao', 2),
('Cinema Aspect Controller', 'Chrome Extension', 'Streaming video aspect-ratio controller with IMAX and custom presets. Processing data fully client-side.', ARRAY['JavaScript', 'Chrome API', 'Manifest V3'], '#', '#', 3),
('CivicWatch', 'Community Safety', 'Full-stack incident reporting platform for crimes and infrastructure with geolocation and optimized PostgreSQL schemas.', ARRAY['React', 'TypeScript', 'Node.js', 'Express.js', 'Prisma', 'PostgreSQL', 'Docker'], '#', '#', 4),
('Medical Impact Predictor', 'Clinical Decision Support', 'ML system predicting hospital LOS/costs using 430K patient records from MIMIC-IV with XGBoost quantile regression.', ARRAY['Python', 'XGBoost', 'Scikit-learn', 'Flask', 'React'], '#', '#', 5);

-- Experience
INSERT INTO experience (id, role, company, period, description, tech, display_order) VALUES
('EXP-001', 'Multicloud Engineer Associate', 'Cognizant', 'Feb 2026 – Present', 'Undergoing structured multicloud training covering AWS, Azure, and GCP as part of the Multicloud Engineer track.', ARRAY['AWS', 'Azure', 'GCP', 'Cloud Infrastructure'], 1),
('EXP-002', 'Freelance Full-Stack Developer', 'Self-Employed', 'Dec 2025 - Feb 2026', 'Delivered two production-grade platforms: CyberSecurityTrain (LMS with Razorpay) and TheCyberSeal (B2B portal). Managed end-to-end development from requirements to live deployment.', ARRAY['React 18', 'Next.js 15', 'Firebase', 'Supabase', 'Razorpay', 'jsPDF'], 2),
('EXP-003', 'AI / Full-Stack Automation Intern', 'Callus', 'Oct 2025 - Dec 2025', 'Built an AI-powered SEO research and knowledge base platform. Automated workflows using n8n and re-implemented as a FastAPI/React application.', ARRAY['FastAPI', 'Python', 'React.js', 'n8n', 'OpenAI API', 'Pinecone'], 3),
('EXP-004', 'Technical Intern', 'Getto', 'July 2025 - Oct 2025', 'Enhanced the Getto Vendor Panel UI and workflows. Optimized database interactions and implemented scalable UI modules in an Agile environment.', ARRAY['React.js', 'Express.js', 'Node.js', 'PostgreSQL', 'Docker'], 4),
('EXP-005', 'Machine Learning Intern', 'Tuzen Tech Solutions', 'May 2024 - July 2024', 'Developed ML-based counterfeit currency detection for visually impaired users. Achieved 95%+ accuracy using TensorFlow.', ARRAY['Python', 'TensorFlow', 'Computer Vision', 'Scikit-learn'], 5),
('EXP-006', 'Academic Support Volunteer', 'Make A Difference (MAD)', 'March 2025 - Present', 'Providing academic mentoring and personalized support to underprivileged students to bridge foundational learning gaps.', ARRAY['Mentorship', 'Education', 'Social Impact'], 6);

-- Skills
INSERT INTO skills (category_title, skills_list, display_order) VALUES
('PROGRAMMING', ARRAY['Core Java', 'Python', 'JavaScript', 'TypeScript'], 1),
('AI / ML CORE', ARRAY['Neural Networks', 'Deep Learning', 'NLP', 'LLMs', 'LangChain', 'RAG', 'TensorFlow', 'PyTorch'], 2),
('FRONTEND', ARRAY['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind', 'Framer Motion', 'Vite'], 3),
('BACKEND', ARRAY['Node.js', 'Express.js', 'Prisma ORM', 'FastAPI'], 4),
('CLOUD & DEVOPS', ARRAY['AWS', 'Azure', 'GCP', 'Docker', 'Git', 'Firebase', 'Supabase', 'Vercel'], 5),
('TOOLS & ANALYTICS', ARRAY['Tableau', 'Power BI', 'n8n', 'Chrome Extension API', 'PostgreSQL', 'SQL'], 6);

-- Blogs (Generic updates since resume didn't specify blogs but portfolio schema has them)
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
  "bio": "Full-Stack & AI Engineer with hands-on experience building production-grade systems including a full LMS/EdTech platform, cybersecurity services portal, AI-powered tools, and published Chrome extensions used by real users. Skilled in LLM integrations, RAG systems, React frontends, Firebase, and multi-role admin systems.",
  "location": "Hyderabad, India",
  "phone": "+91 9959041832",
  "email": "shivachandra9490@gmail.com",
  "education": [
    { "title": "B.E. in CSE (2021–2025)", "school": "GITAM University", "detail": "CGPA: 7.64 / 10.0" },
    { "title": "Secondary Education (2019 - 2021)", "school": "Narayana Junior College", "detail": "Percentage: 92.4%" },
    { "title": "High School (2018 - 2019)", "school": "FIITJEE", "detail": "CGPA: 9.3 / 10.0" }
  ],
  "mission": "Currently working as a Multicloud Engineer Associate at Cognizant. Ready for deployment in mission-critical AI and Full-Stack roles.",
  "specializations": ["Full-Stack Engineering", "AI/ML & RAG Systems", "Cloud Infrastructure (AWS/Azure/GCP)", "Product Automation"]
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;
