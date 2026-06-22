/**
 * SkillSwap — Database Seeder (50 Users + Full Data)
 * Run: node seed.js            → seed database
 * Run: node seed.js --destroy  → wipe + re-seed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User    = require('./models/User');
const Match   = require('./models/Match');
const Session = require('./models/Session');
const Message = require('./models/Message');
const { Course, Review, Notification } = require('./models/Review');

// ─── 50 USERS ────────────────────────────────────────────────────────────────
const USERS = [
  // ── Admins / Main accounts ─────────────────────────────────────────────
  {
    name:'Areeba Sajjad', email:'areeba@skillswap.pk', role:'admin',
    bio:'CS student & React expert. Teaching web dev, learning Full Stack. FA23-BCS-033.',
    points:950, level:5, sessionsCompleted:14, rating:4.9, totalRatings:10,
    skillsTeaching:[
      {skill:'React',      level:'Expert',       description:'Hooks, Context API, Redux, performance'},
      {skill:'JavaScript', level:'Expert',       description:'ES6+, async/await, closures, DOM'},
      {skill:'Node.js',    level:'Intermediate', description:'Express APIs, middleware, REST design'},
    ],
    skillsLearning:[
      {skill:'Machine Learning', priority:'High'},
      {skill:'Python',           priority:'Medium'},
      {skill:'Figma',            priority:'Low'},
    ],
    badges:[
      {name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'},
      {name:'Skill Master', icon:'🏆'},{name:'Rising Star',   icon:'⭐'},
      {name:'Knowledge Hub',icon:'🧠'},
    ],
  },
  {
    name:'Eeba Sajjad', email:'Eeba@skillswap.pk', role:'admin',
    bio:'UI/UX designer. Creating beautiful interfaces is my passion. FA23-BCS-033.',
    points:720, level:4, sessionsCompleted:10, rating:4.8, totalRatings:8,
    skillsTeaching:[
      {skill:'UI/UX Design',    level:'Expert',       description:'Figma, wireframing, prototyping, UX research'},
      {skill:'Figma',           level:'Expert',       description:'Components, auto-layout, design systems'},
      {skill:'Graphic Design',  level:'Intermediate', description:'Photoshop, Illustrator, brand identity'},
    ],
    skillsLearning:[
      {skill:'Flutter', priority:'High'},
      {skill:'React',   priority:'Medium'},
    ],
    badges:[
      {name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'},
      {name:'Rising Star',  icon:'⭐'},{name:'Skill Master',  icon:'🏆'},
    ],
  },

  // ── Programming / Backend ──────────────────────────────────────────────
  {
    name:'Ali Hassan', email:'ali@skillswap.pk',
    bio:'ML engineer at a startup. Python & Data Science teacher. Learning web dev.',
    points:820, level:4, sessionsCompleted:12, rating:4.8, totalRatings:9,
    skillsTeaching:[
      {skill:'Python',           level:'Expert',       description:'Data analysis, automation, OOP'},
      {skill:'Machine Learning', level:'Expert',       description:'Scikit-learn, TensorFlow, model evaluation'},
      {skill:'Data Science',     level:'Intermediate', description:'Pandas, NumPy, Matplotlib, EDA'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'Node.js',priority:'High'},{skill:'MongoDB',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'},{name:'Skill Master',icon:'🏆'},{name:'Rising Star',icon:'⭐'}],
  },
  {
    name:'Ahmed Raza', email:'ahmed@skillswap.pk',
    bio:'DevOps engineer. Docker, Kubernetes, AWS. Making deployments effortless.',
    points:580, level:3, sessionsCompleted:8, rating:4.7, totalRatings:6,
    skillsTeaching:[
      {skill:'DevOps', level:'Expert',       description:'CI/CD, Jenkins, GitHub Actions, pipelines'},
      {skill:'Docker', level:'Expert',       description:'Containers, Compose, Docker Hub'},
      {skill:'AWS',    level:'Intermediate', description:'EC2, S3, Lambda, RDS, CloudFront'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'UI/UX Design',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'},{name:'Rising Star',icon:'⭐'}],
  },
  {
    name:'Bilal Chaudhry', email:'bilal@skillswap.pk',
    bio:'Full-stack Django developer. Backend is my home. Teaching Python & Django.',
    points:440, level:3, sessionsCompleted:6, rating:4.5, totalRatings:5,
    skillsTeaching:[
      {skill:'Python', level:'Expert',       description:'Django, Flask, REST APIs, ORM'},
      {skill:'SQL',    level:'Intermediate', description:'PostgreSQL, MySQL, complex queries, indexing'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'JavaScript',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'}],
  },
  {
    name:'Hamza Sheikh', email:'hamza@skillswap.pk',
    bio:'Competitive programmer, ACM ICPC regional. C++ and algorithms specialist.',
    points:390, level:2, sessionsCompleted:5, rating:4.9, totalRatings:4,
    skillsTeaching:[
      {skill:'C++',              level:'Expert', description:'STL, templates, competitive programming tricks'},
      {skill:'Data Structures',  level:'Expert', description:'Trees, graphs, DP, segment trees'},
      {skill:'Algorithms',       level:'Expert', description:'Sorting, searching, greedy, divide & conquer'},
    ],
    skillsLearning:[{skill:'Machine Learning',priority:'High'},{skill:'Python',priority:'High'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Zaid Mirza', email:'zaid@skillswap.pk',
    bio:'Backend Node.js developer. APIs and microservices. Coffee and code ☕',
    points:330, level:2, sessionsCompleted:4, rating:4.6, totalRatings:3,
    skillsTeaching:[
      {skill:'Node.js',  level:'Expert',       description:'Express, Fastify, REST, WebSockets'},
      {skill:'MongoDB',  level:'Expert',       description:'Mongoose, aggregation, indexing, Atlas'},
      {skill:'GraphQL',  level:'Intermediate', description:'Apollo Server, resolvers, subscriptions'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'TypeScript',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Saqib Javed', email:'saqib@skillswap.pk',
    bio:'PHP & Laravel dev. 4 years experience. Building e-commerce platforms.',
    points:260, level:2, sessionsCompleted:3, rating:4.3, totalRatings:2,
    skillsTeaching:[
      {skill:'PHP',    level:'Expert',       description:'Laravel, Blade, Eloquent ORM, Livewire'},
      {skill:'MySQL',  level:'Intermediate', description:'Queries, stored procedures, optimization'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'Node.js',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Omer Iftikhar', email:'omer@skillswap.pk',
    bio:'TypeScript and Next.js enthusiast. JAMstack is the future!',
    points:210, level:2, sessionsCompleted:3, rating:4.4, totalRatings:2,
    skillsTeaching:[
      {skill:'TypeScript', level:'Expert',       description:'Generics, decorators, strict mode, utility types'},
      {skill:'Next.js',    level:'Intermediate', description:'SSR, SSG, ISR, App Router, API routes'},
    ],
    skillsLearning:[{skill:'Python',priority:'Medium'},{skill:'Machine Learning',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Talha Nawaz', email:'talha@skillswap.pk',
    bio:'Spring Boot Java developer. Enterprise applications. Clean code advocate.',
    points:180, level:1, sessionsCompleted:2, rating:4.2, totalRatings:2,
    skillsTeaching:[
      {skill:'Java',        level:'Expert',       description:'OOP, collections, multithreading, Spring Boot'},
      {skill:'Spring Boot', level:'Intermediate', description:'REST APIs, JPA, security, microservices'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'JavaScript',priority:'High'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },

  // ── Mobile Development ────────────────────────────────────────────────
  {
    name:'Fatima Malik', email:'fatima@skillswap.pk',
    bio:'Android developer & content creator. Making tech tutorials in Urdu.',
    points:480, level:3, sessionsCompleted:6, rating:4.6, totalRatings:5,
    skillsTeaching:[
      {skill:'Android Development', level:'Expert',       description:'Kotlin, Jetpack Compose, MVVM, Firebase'},
      {skill:'Content Writing',     level:'Intermediate', description:'Tech blogs, SEO content, technical docs'},
      {skill:'Video Editing',       level:'Intermediate', description:'Premiere Pro, After Effects basics'},
    ],
    skillsLearning:[{skill:'iOS Development',priority:'High'},{skill:'Flutter',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'}],
  },
  {
    name:'Omar Farooq', email:'omar@skillswap.pk',
    bio:'Flutter developer. Building apps for local businesses. Teaching Quran online too.',
    points:200, level:2, sessionsCompleted:3, rating:5.0, totalRatings:2,
    skillsTeaching:[
      {skill:'Flutter', level:'Expert', description:'Dart, widgets, BLoC, Provider, Firebase'},
      {skill:'Quran',   level:'Expert', description:'Tajweed rules, memorization techniques'},
    ],
    skillsLearning:[{skill:'Node.js',priority:'High'},{skill:'MongoDB',priority:'Medium'},{skill:'React',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Iqra Zahid', email:'iqra@skillswap.pk',
    bio:'iOS developer. Swift & SwiftUI enthusiast. App Store has 2 of my apps!',
    points:310, level:2, sessionsCompleted:4, rating:4.7, totalRatings:3,
    skillsTeaching:[
      {skill:'iOS Development', level:'Expert',       description:'Swift, SwiftUI, UIKit, CoreData, App Store'},
      {skill:'Swift',           level:'Expert',       description:'Optionals, generics, protocols, async/await'},
    ],
    skillsLearning:[{skill:'React Native',priority:'High'},{skill:'Flutter',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Rizwan Baig', email:'rizwan@skillswap.pk',
    bio:'React Native cross-platform developer. One codebase, both platforms!',
    points:240, level:2, sessionsCompleted:3, rating:4.4, totalRatings:2,
    skillsTeaching:[
      {skill:'React Native', level:'Expert',       description:'Expo, bare workflow, navigation, animations'},
      {skill:'JavaScript',   level:'Intermediate', description:'ES6+, async programming, closures'},
    ],
    skillsLearning:[{skill:'Flutter',priority:'High'},{skill:'TypeScript',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },

  // ── Design & Creative ─────────────────────────────────────────────────
  {
    name:'Nadia Siddiqui', email:'nadia@skillswap.pk',
    bio:'Photography enthusiast and Graphic Designer. Teaching visual arts, learning programming.',
    points:150, level:1, sessionsCompleted:2, rating:4.0, totalRatings:1,
    skillsTeaching:[
      {skill:'Photography',  level:'Expert', description:'DSLR, composition, lighting, post-processing'},
      {skill:'Graphic Design',level:'Expert', description:'Illustrator, Photoshop, brand identity design'},
    ],
    skillsLearning:[{skill:'JavaScript',priority:'High'},{skill:'Python',priority:'Medium'}],
    badges:[],
  },
  {
    name:'Sana Qureshi', email:'sana@skillswap.pk',
    bio:'Motion graphics designer. Adobe After Effects is my canvas. 3D is next!',
    points:280, level:2, sessionsCompleted:4, rating:4.5, totalRatings:3,
    skillsTeaching:[
      {skill:'Video Editing',    level:'Expert',       description:'Premiere Pro, color grading, multicam'},
      {skill:'Adobe Photoshop',  level:'Expert',       description:'Photo manipulation, compositing, retouching'},
      {skill:'Graphic Design',   level:'Intermediate', description:'Logos, social media, brand kits'},
    ],
    skillsLearning:[{skill:'UI/UX Design',priority:'High'},{skill:'Figma',priority:'High'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Maham Tariq', email:'maham@skillswap.pk',
    bio:'3D artist and illustrator. Blender 3D, character design, and digital art.',
    points:120, level:1, sessionsCompleted:1, rating:4.3, totalRatings:1,
    skillsTeaching:[
      {skill:'Graphic Design', level:'Expert',       description:'Digital illustration, character design, concept art'},
      {skill:'Photography',    level:'Intermediate', description:'Product photography, portrait basics'},
    ],
    skillsLearning:[{skill:'UI/UX Design',priority:'High'},{skill:'JavaScript',priority:'Low'}],
    badges:[],
  },

  // ── Cybersecurity ─────────────────────────────────────────────────────
  {
    name:'Usman Tariq', email:'usman@skillswap.pk',
    bio:'Cybersecurity enthusiast and ethical hacker. CTF player. Arabic speaker.',
    points:420, level:3, sessionsCompleted:5, rating:4.5, totalRatings:4,
    skillsTeaching:[
      {skill:'Ethical Hacking', level:'Expert', description:'Pen testing, CTF, Kali Linux, Burp Suite'},
      {skill:'Cybersecurity',   level:'Expert', description:'Network security, OWASP, vulnerability assessment'},
      {skill:'Arabic',          level:'Expert', description:'Modern Standard Arabic + Egyptian dialect'},
    ],
    skillsLearning:[{skill:'Python',priority:'High'},{skill:'Machine Learning',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'}],
  },
  {
    name:'Kashif Mehmood', email:'kashif@skillswap.pk',
    bio:'Network engineer. Cisco certified (CCNA). Teaching networking fundamentals.',
    points:190, level:1, sessionsCompleted:2, rating:4.2, totalRatings:2,
    skillsTeaching:[
      {skill:'Cybersecurity', level:'Intermediate', description:'Network security, firewalls, IDS/IPS'},
      {skill:'Linux',         level:'Expert',       description:'Ubuntu, CentOS, bash scripting, server admin'},
    ],
    skillsLearning:[{skill:'Python',priority:'High'},{skill:'Docker',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },

  // ── Data & AI ─────────────────────────────────────────────────────────
  {
    name:'Sara Baig', email:'sara@skillswap.pk',
    bio:'Math tutor & competitive programmer. ACM ICPC regional finalist.',
    points:370, level:2, sessionsCompleted:5, rating:4.9, totalRatings:4,
    skillsTeaching:[
      {skill:'Mathematics',     level:'Expert', description:'Calculus, Linear Algebra, Probability, Discrete Math'},
      {skill:'Data Structures', level:'Expert', description:'Arrays, trees, graphs, DP'},
      {skill:'C++',             level:'Expert', description:'STL, competitive programming, optimizations'},
    ],
    skillsLearning:[{skill:'Machine Learning',priority:'High'},{skill:'Python',priority:'High'},{skill:'Data Science',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Arslan Qureshi', email:'arslan@skillswap.pk',
    bio:'Data analyst at a logistics company. Power BI dashboards are my specialty.',
    points:230, level:2, sessionsCompleted:3, rating:4.3, totalRatings:2,
    skillsTeaching:[
      {skill:'Data Science',   level:'Intermediate', description:'EDA, data cleaning, feature engineering'},
      {skill:'SQL',            level:'Expert',       description:'Complex queries, window functions, stored procs'},
      {skill:'Python',         level:'Intermediate', description:'Pandas, NumPy, data manipulation'},
    ],
    skillsLearning:[{skill:'Machine Learning',priority:'High'},{skill:'React',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Amna Riaz', email:'amna@skillswap.pk',
    bio:'NLP researcher. Transformers, BERT, and language models are my thing.',
    points:310, level:2, sessionsCompleted:4, rating:4.7, totalRatings:3,
    skillsTeaching:[
      {skill:'Machine Learning', level:'Expert',       description:'Deep learning, PyTorch, NLP, transformers'},
      {skill:'Python',           level:'Expert',       description:'ML pipelines, HuggingFace, model deployment'},
    ],
    skillsLearning:[{skill:'React',priority:'Medium'},{skill:'JavaScript',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },

  // ── Digital Marketing ────────────────────────────────────────────────
  {
    name:'Zara Khan', email:'zara@skillswap.pk',
    bio:'Digital marketing expert. Running online campaigns for 3 years. Want to learn coding!',
    points:300, level:2, sessionsCompleted:4, rating:4.4, totalRatings:3,
    skillsTeaching:[
      {skill:'Digital Marketing', level:'Expert',       description:'Google Ads, Facebook campaigns, analytics'},
      {skill:'SEO',               level:'Expert',       description:'On-page, off-page, keyword research, GSC'},
      {skill:'Content Writing',   level:'Intermediate', description:'Copywriting, email marketing, funnels'},
    ],
    skillsLearning:[{skill:'JavaScript',priority:'High'},{skill:'React',priority:'Medium'},{skill:'Python',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Maryam Aslam', email:'maryam@skillswap.pk',
    bio:'Social media manager for 5 brands. Instagram reels queen 👑',
    points:170, level:1, sessionsCompleted:2, rating:4.1, totalRatings:2,
    skillsTeaching:[
      {skill:'Digital Marketing', level:'Intermediate', description:'Instagram, TikTok, Facebook, content calendars'},
      {skill:'Content Writing',   level:'Expert',       description:'Captions, scripts, blog posts, SEO writing'},
      {skill:'Video Editing',     level:'Intermediate', description:'Reels, TikTok edits, CapCut, Canva videos'},
    ],
    skillsLearning:[{skill:'Figma',priority:'High'},{skill:'Graphic Design',priority:'High'}],
    badges:[],
  },
  {
    name:'Hassan Ali', email:'hassan@skillswap.pk',
    bio:'E-commerce and Amazon FBA consultant. Dropshipping success story 📦',
    points:140, level:1, sessionsCompleted:1, rating:4.0, totalRatings:1,
    skillsTeaching:[
      {skill:'Digital Marketing', level:'Expert',       description:'Amazon PPC, product research, listing optimization'},
      {skill:'SEO',               level:'Intermediate', description:'Product SEO, Amazon A9, keyword tools'},
    ],
    skillsLearning:[{skill:'Python',priority:'Medium'},{skill:'Data Science',priority:'Low'}],
    badges:[],
  },

  // ── Languages ─────────────────────────────────────────────────────────
  {
    name:'Rabea Noor', email:'rabea@skillswap.pk',
    bio:'English language coach. IELTS 8.5 scorer. Helping students ace exams.',
    points:360, level:2, sessionsCompleted:5, rating:4.8, totalRatings:4,
    skillsTeaching:[
      {skill:'English Speaking', level:'Expert', description:'IELTS, TOEFL, corporate communication, presentations'},
      {skill:'Public Speaking',  level:'Expert', description:'Debates, TED-style talks, interview prep'},
      {skill:'Content Writing',  level:'Expert', description:'Academic writing, essays, research papers'},
    ],
    skillsLearning:[{skill:'Python',priority:'Medium'},{skill:'Digital Marketing',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'}],
  },
  {
    name:'Kamran Ahmed', email:'kamran@skillswap.pk',
    bio:'Arabic & Urdu teacher. Quran instructor for 5 years. Spreading knowledge.',
    points:290, level:2, sessionsCompleted:4, rating:4.9, totalRatings:3,
    skillsTeaching:[
      {skill:'Arabic',      level:'Expert', description:'Quranic Arabic, grammar (Nahw/Sarf), conversational'},
      {skill:'Quran',       level:'Expert', description:'Tajweed, memorization coaching, tafseer basics'},
      {skill:'Urdu',        level:'Expert', description:'Advanced writing, poetry, formal correspondence'},
    ],
    skillsLearning:[{skill:'Computer Science',priority:'Medium'},{skill:'Python',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Aisha Farhan', email:'aisha@skillswap.pk',
    bio:'Chinese language learner turned teacher. HSK 4 certified. China studies graduate.',
    points:130, level:1, sessionsCompleted:2, rating:4.2, totalRatings:1,
    skillsTeaching:[
      {skill:'Urdu',    level:'Expert',       description:'Writing, grammar, literature'},
      {skill:'English Speaking', level:'Intermediate', description:'Conversational English, pronunciation'},
    ],
    skillsLearning:[{skill:'Digital Marketing',priority:'High'},{skill:'Graphic Design',priority:'Medium'}],
    badges:[],
  },

  // ── Academic / Science ────────────────────────────────────────────────
  {
    name:'Dr. Nauman Sajid', email:'nauman@skillswap.pk',
    bio:'Physics PhD candidate. Quantum computing researcher. Teaching science.',
    points:410, level:3, sessionsCompleted:6, rating:4.9, totalRatings:5,
    skillsTeaching:[
      {skill:'Mathematics', level:'Expert', description:'University math, calculus, linear algebra, stats'},
      {skill:'Physics',     level:'Expert', description:'Classical, quantum, electromagnetism, optics'},
      {skill:'Python',      level:'Intermediate', description:'Scientific computing, NumPy, SciPy, Matplotlib'},
    ],
    skillsLearning:[{skill:'Machine Learning',priority:'High'},{skill:'Data Science',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'}],
  },
  {
    name:'Hina Qasim', email:'hina@skillswap.pk',
    bio:'Chemistry teacher. O/A level specialist. Making science fun for students!',
    points:160, level:1, sessionsCompleted:2, rating:4.5, totalRatings:2,
    skillsTeaching:[
      {skill:'Chemistry',    level:'Expert',       description:'O/A level, FSc, organic, inorganic, physical'},
      {skill:'Mathematics',  level:'Intermediate', description:'O level Math, FSc pre-engineering'},
    ],
    skillsLearning:[{skill:'Python',priority:'High'},{skill:'Data Science',priority:'Medium'}],
    badges:[],
  },
  {
    name:'Mohsin Rauf', email:'mohsin@skillswap.pk',
    bio:'Medical student moonlighting as biology tutor. MDCAT specialist.',
    points:110, level:1, sessionsCompleted:1, rating:4.6, totalRatings:1,
    skillsTeaching:[
      {skill:'Biology',     level:'Expert',       description:'MDCAT prep, A-level biology, anatomy basics'},
      {skill:'Chemistry',   level:'Intermediate', description:'Organic chemistry, MDCAT chemistry prep'},
    ],
    skillsLearning:[{skill:'Python',priority:'Medium'},{skill:'Machine Learning',priority:'Low'}],
    badges:[],
  },

  // ── Life Skills & Misc ────────────────────────────────────────────────
  {
    name:'Faisal Rehman', email:'faisal@skillswap.pk',
    bio:'Guitarist and music producer. Ableton Live is my studio. Teach guitar & music theory.',
    points:200, level:2, sessionsCompleted:3, rating:4.6, totalRatings:2,
    skillsTeaching:[
      {skill:'Music Production', level:'Expert',       description:'Ableton Live, mixing, mastering, sound design'},
      {skill:'Public Speaking',  level:'Intermediate', description:'Stage presence, storytelling, audience engagement'},
    ],
    skillsLearning:[{skill:'JavaScript',priority:'Low'},{skill:'Digital Marketing',priority:'Medium'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Lubna Zia', email:'lubna@skillswap.pk',
    bio:'Yoga instructor and nutritionist. Holistic health is my calling.',
    points:90, level:1, sessionsCompleted:1, rating:4.3, totalRatings:1,
    skillsTeaching:[
      {skill:'Public Speaking', level:'Expert',       description:'Confidence building, body language, mindfulness talks'},
      {skill:'English Speaking',level:'Intermediate', description:'Conversational English, everyday vocabulary'},
    ],
    skillsLearning:[{skill:'Digital Marketing',priority:'High'},{skill:'Content Writing',priority:'High'}],
    badges:[],
  },
  {
    name:'Waqas Hussain', email:'waqas@skillswap.pk',
    bio:'Freelance photographer. Commercial shoots for brands and events.',
    points:150, level:1, sessionsCompleted:2, rating:4.4, totalRatings:2,
    skillsTeaching:[
      {skill:'Photography',   level:'Expert',       description:'Studio, outdoor, events, product photography'},
      {skill:'Video Editing', level:'Intermediate', description:'DaVinci Resolve, color grading, YouTube content'},
    ],
    skillsLearning:[{skill:'Digital Marketing',priority:'High'},{skill:'SEO',priority:'Medium'}],
    badges:[],
  },

  // ── Cloud & Infrastructure ────────────────────────────────────────────
  {
    name:'Saad Ullah', email:'saad@skillswap.pk',
    bio:'Cloud architect. GCP and Azure certified. Infrastructure as code enthusiast.',
    points:350, level:2, sessionsCompleted:5, rating:4.6, totalRatings:4,
    skillsTeaching:[
      {skill:'AWS',    level:'Expert',       description:'EC2, Lambda, S3, VPC, IAM, CloudFormation'},
      {skill:'DevOps', level:'Intermediate', description:'Terraform, Ansible, Kubernetes, Helm'},
      {skill:'Linux',  level:'Expert',       description:'Shell scripting, cron jobs, process management'},
    ],
    skillsLearning:[{skill:'Python',priority:'Medium'},{skill:'Machine Learning',priority:'Low'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'}],
  },
  {
    name:'Jawad Iqbal', email:'jawad@skillswap.pk',
    bio:'Blockchain developer. Solidity, smart contracts, Web3. Decentralize everything!',
    points:220, level:2, sessionsCompleted:3, rating:4.3, totalRatings:2,
    skillsTeaching:[
      {skill:'JavaScript',   level:'Expert',       description:'ES6+, async patterns, Node.js, Web3.js'},
      {skill:'Cybersecurity',level:'Intermediate', description:'Smart contract auditing, Web3 security basics'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'TypeScript',priority:'High'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },

  // ── More Students ─────────────────────────────────────────────────────
  {
    name:'Misbah Tariq', email:'misbah@skillswap.pk',
    bio:'Junior web developer. Learning every day. HTML/CSS/JS is my foundation.',
    points:80, level:1, sessionsCompleted:1, rating:4.0, totalRatings:1,
    skillsTeaching:[
      {skill:'HTML/CSS', level:'Intermediate', description:'Responsive design, Flexbox, Grid, Bootstrap 5'},
    ],
    skillsLearning:[{skill:'JavaScript',priority:'High'},{skill:'React',priority:'High'},{skill:'Node.js',priority:'Medium'}],
    badges:[],
  },
  {
    name:'Asad Mehmood', email:'asad@skillswap.pk',
    bio:'Electronics engineering student interested in embedded systems and IoT.',
    points:60, level:1, sessionsCompleted:0, rating:0, totalRatings:0,
    skillsTeaching:[
      {skill:'Mathematics', level:'Intermediate', description:'Engineering math, signals & systems'},
    ],
    skillsLearning:[{skill:'Python',priority:'High'},{skill:'Machine Learning',priority:'Medium'},{skill:'JavaScript',priority:'Low'}],
    badges:[],
  },
  {
    name:'Komal Naz', email:'komal@skillswap.pk',
    bio:'Business student exploring tech. Currently learning Python for data analysis.',
    points:50, level:1, sessionsCompleted:0, rating:0, totalRatings:0,
    skillsTeaching:[
      {skill:'English Speaking', level:'Intermediate', description:'Conversational, presentations, business English'},
      {skill:'Content Writing',  level:'Intermediate', description:'Business writing, reports, proposals'},
    ],
    skillsLearning:[{skill:'Python',priority:'High'},{skill:'Data Science',priority:'High'},{skill:'SQL',priority:'Medium'}],
    badges:[],
  },
  {
    name:'Raza Abbas', email:'raza@skillswap.pk',
    bio:'Game developer using Unity. Game design and C# are my forte.',
    points:170, level:1, sessionsCompleted:2, rating:4.4, totalRatings:2,
    skillsTeaching:[
      {skill:'C++', level:'Expert',       description:'OOP, pointers, memory management, game math'},
      {skill:'Java',level:'Intermediate', description:'OOP concepts, data structures in Java'},
    ],
    skillsLearning:[{skill:'Python',priority:'Medium'},{skill:'Machine Learning',priority:'Low'},{skill:'React',priority:'High'}],
    badges:[],
  },
  {
    name:'Sundus Malik', email:'sundus@skillswap.pk',
    bio:'HR professional learning tech skills. Excel & data analysis is my toolkit.',
    points:100, level:1, sessionsCompleted:1, rating:4.5, totalRatings:1,
    skillsTeaching:[
      {skill:'English Speaking', level:'Expert',       description:'Professional communication, HR interviews, soft skills'},
      {skill:'Public Speaking',  level:'Intermediate', description:'Presentations, team communication'},
    ],
    skillsLearning:[{skill:'Python',priority:'High'},{skill:'SQL',priority:'High'},{skill:'Data Science',priority:'Medium'}],
    badges:[],
  },
  {
    name:'Imran Khalid', email:'imran@skillswap.pk',
    bio:'Urdu poet and calligraphy artist. Also teaching Arabic script and Islamic art.',
    points:130, level:1, sessionsCompleted:2, rating:4.7, totalRatings:1,
    skillsTeaching:[
      {skill:'Arabic', level:'Expert', description:'Arabic calligraphy, Naskh, Thuluth scripts'},
      {skill:'Urdu',   level:'Expert', description:'Nastaliq poetry, literature, creative writing'},
      {skill:'Quran',  level:'Expert', description:'Tajweed, hifz coaching, makharij'},
    ],
    skillsLearning:[{skill:'Digital Marketing',priority:'Medium'},{skill:'Content Writing',priority:'High'}],
    badges:[],
  },
  {
    name:'Alina Chaudhry', email:'alina@skillswap.pk',
    bio:'Fashion designer turned Figma designer. Aesthetic first, functionality second.',
    points:100, level:1, sessionsCompleted:1, rating:4.0, totalRatings:1,
    skillsTeaching:[
      {skill:'Figma',        level:'Intermediate', description:'UI design, color theory, typography, mockups'},
      {skill:'Graphic Design',level:'Expert',       description:'Fashion branding, lookbooks, packaging design'},
    ],
    skillsLearning:[{skill:'React',priority:'High'},{skill:'JavaScript',priority:'High'},{skill:'UI/UX Design',priority:'Medium'}],
    badges:[],
  },
  {
    name:'Babar Aziz', email:'babar@skillswap.pk',
    bio:'SQL DBA. Database optimization is an art. Teaching SQL and database design.',
    points:240, level:2, sessionsCompleted:3, rating:4.5, totalRatings:2,
    skillsTeaching:[
      {skill:'SQL',    level:'Expert',       description:'PostgreSQL, MySQL, Oracle. Query optimization, indexes'},
      {skill:'Python', level:'Intermediate', description:'SQLAlchemy, data pipelines, ETL scripts'},
    ],
    skillsLearning:[{skill:'Machine Learning',priority:'High'},{skill:'Data Science',priority:'High'}],
    badges:[{name:'First Session',icon:'🎯'}],
  },
  {
    name:'Naila Shahid', email:'naila@skillswap.pk',
    bio:'Teacher by profession. Online tutoring platform founder. Passionate educator.',
    points:320, level:2, sessionsCompleted:5, rating:4.9, totalRatings:4,
    skillsTeaching:[
      {skill:'Mathematics',     level:'Expert',       description:'O/A level, BSc math, calculus, stats'},
      {skill:'English Speaking',level:'Expert',       description:'IELTS prep, academic writing, grammar'},
      {skill:'Public Speaking', level:'Intermediate', description:'Confidence building, classroom communication'},
    ],
    skillsLearning:[{skill:'Python',priority:'Medium'},{skill:'Digital Marketing',priority:'High'}],
    badges:[{name:'First Session',icon:'🎯'},{name:'Active Learner',icon:'📚'}],
  },
  {
    name:'Zohaib Akhtar', email:'zohaib@skillswap.pk',
    bio:'Linux sysadmin and bash scripting wizard. Open source is life.',
    points:190, level:1, sessionsCompleted:2, rating:4.3, totalRatings:2,
    skillsTeaching:[
      {skill:'Linux',  level:'Expert',       description:'Arch, Ubuntu, Fedora. Shell scripting, cron, systemd'},
      {skill:'DevOps', level:'Intermediate', description:'Docker basics, Nginx, SSL, server hardening'},
    ],
    skillsLearning:[{skill:'Python',priority:'High'},{skill:'Cybersecurity',priority:'High'}],
    badges:[],
  },
];

// ─── COURSES ──────────────────────────────────────────────────────────────────
const buildCourses = (ids) => [
  {
    title:'React.js Zero to Hero', instructor:ids[0], skill:'React', level:'Beginner',
    description:'Complete React course. Hooks, Context API, React Router, 3 real projects.',
    content:[
      {title:'What is React?',         body:'Component-based architecture, JSX syntax, virtual DOM.', order:1},
      {title:'useState & useEffect',   body:'State management aur side effects. Practical examples.', order:2},
      {title:'React Router v6',        body:'SPA routing, protected routes, nested routes, params.', order:3},
      {title:'Context API',            body:'Global state bina Redux ke. useContext hook.', order:4},
      {title:'Final Project',          body:'Full CRUD app — React + REST API + deployment to Vercel.', order:5},
    ],
    quiz:[
      {question:'React mein state update karne ke liye?', options:['setState()','useState()','changeState()','updateState()'], correctAnswer:1},
      {question:'useEffect default behaviour?', options:['Sirf mount','Sirf unmount','Har render','Never'], correctAnswer:2},
    ],
    enrolledUsers:[ids[2],ids[3],ids[5],ids[10],ids[22],ids[37],ids[40]],
    rating:4.8,
  },
  {
    title:'UI/UX Design with Figma', instructor:ids[1], skill:'UI/UX Design', level:'Beginner',
    description:'Professional UI/UX design. Wireframing, prototyping, design systems, client delivery.',
    content:[
      {title:'Design Thinking',   body:'Empathize → Define → Ideate → Prototype → Test.', order:1},
      {title:'Figma Basics',      body:'Frames, components, auto-layout. Shortcuts jo time bachate hain.', order:2},
      {title:'Color & Typography',body:'Color theory, font pairing, visual hierarchy.', order:3},
      {title:'Design Systems',    body:'Reusable components, tokens, style guides.', order:4},
    ],
    quiz:[
      {question:'Design thinking ka pehla step?', options:['Prototype','Define','Empathize','Test'], correctAnswer:2},
    ],
    enrolledUsers:[ids[0],ids[3],ids[14],ids[15],ids[43]],
    rating:4.9,
  },
  {
    title:'Python for Data Science & ML', instructor:ids[2], skill:'Python', level:'Intermediate',
    description:'Python se start, ML tak. Real datasets, real projects. Kaggle mein participate karo.',
    content:[
      {title:'Python Refresher',   body:'Lists, dicts, OOP. ML ke liye zaruri Python.', order:1},
      {title:'NumPy & Pandas',     body:'Array operations, dataframes, data cleaning, groupby.', order:2},
      {title:'Data Visualization', body:'Matplotlib, Seaborn. Charts jo data ki kahani sunate hain.', order:3},
      {title:'Scikit-learn',       body:'Linear Regression, KNN, SVM, Random Forest. Full pipeline.', order:4},
      {title:'Capstone Project',   body:'End-to-end ML project — data → model → deployment.', order:5},
    ],
    quiz:[
      {question:'Pandas mein rows filter?', options:['df.filter()','df[condition]','df.where()','df.select()'], correctAnswer:1},
      {question:'KNN mein K kya hai?',      options:['Kernel','Neighbors count','K-fold','Kilo iterations'], correctAnswer:1},
    ],
    enrolledUsers:[ids[1],ids[4],ids[18],ids[19],ids[30],ids[36],ids[41],ids[44]],
    rating:4.7,
  },
  {
    title:'Android Development with Kotlin', instructor:ids[10], skill:'Android Development', level:'Intermediate',
    description:'Real Android apps from scratch. Kotlin, Jetpack Compose, Firebase, Play Store deploy.',
    content:[
      {title:'Kotlin Fundamentals', body:'Data classes, coroutines, extension functions. Java se better.', order:1},
      {title:'Jetpack Compose',     body:'Declarative UI. State management, theming, navigation.', order:2},
      {title:'Firebase',            body:'Authentication, Firestore, Storage. Backend without backend.', order:3},
    ],
    enrolledUsers:[ids[11],ids[12],ids[2],ids[37]],
    rating:4.6,
  },
  {
    title:'Ethical Hacking & Cybersecurity', instructor:ids[17], skill:'Ethical Hacking', level:'Beginner',
    description:'Learn how hackers think. Network security, web vulnerabilities, ethical hacking tools.',
    content:[
      {title:'Hacker Mindset',       body:'Recon, scanning, exploitation, post-exploitation.', order:1},
      {title:'Web Vulnerabilities',  body:'SQL Injection, XSS, CSRF, IDOR. OWASP Top 10.', order:2},
      {title:'Tools',                body:'Nmap, Burp Suite, Metasploit. Legal use only!', order:3},
    ],
    enrolledUsers:[ids[18],ids[35],ids[6],ids[45]],
    rating:4.5,
  },
  {
    title:'Digital Marketing & SEO Masterclass', instructor:ids[22], skill:'Digital Marketing', level:'Beginner',
    description:'Complete online presence guide. Google Ads, Facebook, SEO, email marketing.',
    content:[
      {title:'SEO Fundamentals',   body:'Keyword research, on-page, off-page, backlinks. Rank on Google.', order:1},
      {title:'Google Ads',         body:'Search campaigns, bidding, Quality Score, ROI.', order:2},
      {title:'Social Media Ads',   body:'Facebook, Instagram, LinkedIn. Content calendar.', order:3},
    ],
    enrolledUsers:[ids[23],ids[24],ids[32],ids[34],ids[40]],
    rating:4.8,
  },
  {
    title:'Docker & DevOps for Developers', instructor:ids[3], skill:'Docker', level:'Intermediate',
    description:'Containerize apps. CI/CD pipelines. Deploy to AWS like a pro.',
    content:[
      {title:'Docker Basics',         body:'Images, containers, Dockerfile, Compose. Your app everywhere.', order:1},
      {title:'GitHub Actions CI/CD',  body:'Automated test & deploy. Push → auto deploy.', order:2},
      {title:'AWS Deployment',        body:'EC2, S3, RDS. Production deploy properly.', order:3},
    ],
    enrolledUsers:[ids[18],ids[35],ids[6],ids[45]],
    rating:4.7,
  },
  {
    title:'Mathematics for CS Students', instructor:ids[19], skill:'Mathematics', level:'Beginner',
    description:'Discrete math, linear algebra, probability — everything CS students need. Simple examples.',
    content:[
      {title:'Discrete Mathematics', body:'Sets, logic, relations, graphs. TOA ka foundation.', order:1},
      {title:'Linear Algebra for ML', body:'Vectors, matrices, eigenvalues. ML algorithms ka core math.', order:2},
      {title:'Probability & Stats',  body:'Bayes theorem, distributions, hypothesis testing.', order:3},
    ],
    enrolledUsers:[ids[2],ids[29],ids[20],ids[36],ids[40]],
    rating:4.9,
  },
  {
    title:'Flutter App Development', instructor:ids[11], skill:'Flutter', level:'Intermediate',
    description:'Cross-platform apps with Flutter & Dart. One codebase, Android + iOS.',
    content:[
      {title:'Dart Language',       body:'Variables, functions, classes, async/await in Dart.', order:1},
      {title:'Flutter Widgets',     body:'Stateless vs Stateful. Built-in + custom widgets.', order:2},
      {title:'State Management',    body:'Provider, Riverpod, BLoC. Choose the right one.', order:3},
      {title:'Firebase + Flutter',  body:'Auth, Firestore, push notifications.', order:4},
    ],
    enrolledUsers:[ids[10],ids[12],ids[13],ids[1]],
    rating:4.6,
  },
  {
    title:'English Communication & IELTS Prep', instructor:ids[25], skill:'English Speaking', level:'Beginner',
    description:'Confident English. IELTS 7+ strategies. Corporate communication. Interview prep.',
    content:[
      {title:'Pronunciation Basics',   body:'Phonetics, stress patterns, linking words.', order:1},
      {title:'Speaking Fluency',       body:'Filler words hatao. Fluency drills. Everyday conversations.', order:2},
      {title:'IELTS Speaking Module',  body:'Part 1/2/3 strategies. Band descriptors. Practice tests.', order:3},
      {title:'Professional English',   body:'Emails, meetings, presentations. Corporate register.', order:4},
    ],
    enrolledUsers:[ids[27],ids[34],ids[39],ids[42],ids[44]],
    rating:4.8,
  },
  {
    title:'Quranic Arabic for Beginners', instructor:ids[26], skill:'Arabic', level:'Beginner',
    description:'Understand the Quran directly. Grammar rules, vocabulary, sentence construction.',
    content:[
      {title:'Arabic Alphabet',    body:'Letters, harakat, joining rules. Foundation.', order:1},
      {title:'Basic Vocabulary',   body:'100 most common Quranic words. Root word system.', order:2},
      {title:'Grammar (Nahw)',      body:'Ism, fil, harf. Subject-verb-object in Arabic.', order:3},
    ],
    enrolledUsers:[ids[38],ids[17],ids[43],ids[28]],
    rating:4.9,
  },
  {
    title:'Advanced SQL & Database Design', instructor:ids[45], skill:'SQL', level:'Intermediate',
    description:'From basic SELECT to advanced window functions, optimization, and database architecture.',
    content:[
      {title:'SQL Refresher',        body:'SELECT, JOIN, WHERE, GROUP BY. Quick review.', order:1},
      {title:'Window Functions',     body:'ROW_NUMBER, RANK, LAG/LEAD, PARTITION BY. Game changers.', order:2},
      {title:'Query Optimization',   body:'EXPLAIN ANALYZE, indexes, query plans. Make it fast.', order:3},
      {title:'Database Design',      body:'Normalization, ERD, relationships, constraints.', order:4},
    ],
    enrolledUsers:[ids[4],ids[20],ids[39],ids[44]],
    rating:4.7,
  },
];

// ─── SEEDER ───────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const destroy = process.argv.includes('--destroy');
    if (destroy) {
      await Promise.all([
        User.deleteMany(), Match.deleteMany(), Session.deleteMany(),
        Message.deleteMany(), Course.deleteMany(), Review.deleteMany(),
        Notification.deleteMany(),
      ]);
      // Drop all indexes so stale unique indexes don't cause conflicts
      try { await Match.collection.dropIndexes(); } catch(e) {}
      try { await User.collection.dropIndexes(); } catch(e) {}
      try { await Message.collection.dropIndexes(); } catch(e) {}
      console.log('🗑️  All data wiped');
    } else {
      const count = await User.countDocuments();
      if (count > 0) {
        console.log(`ℹ️  Already has ${count} users. Use --destroy to re-seed.`);
        process.exit(0);
      }
    }

    // ── Users ────────────────────────────────────────────────────────────
    console.log('👥 Creating 50 users...');
    const femaleNames = ['areeba','hifza','fatima','nadia','sana','maham','zara','maryam','iqra','rabea','aisha','hina','amna','lubna','sundus','komal','alina','naila','sara'];
    const rawUsers = USERS.map(u => {
      const firstName = u.name.toLowerCase().split(' ')[0];
      const isFemale = femaleNames.some(n => firstName.includes(n));
      const style = isFemale ? 'adventurer' : 'avataaars';
      const seed = encodeURIComponent(u.name);
      const avatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
      return { ...u, password:'password123', avatar };
    });
    const created = await User.create(rawUsers);
    const ids = created.map(u => u._id);
    console.log(`✅ ${created.length} users created`);

    // ── Courses ──────────────────────────────────────────────────────────
    console.log('📚 Creating courses...');
    const courseList = buildCourses(ids).map(c => ({
      ...c,
      enrolledUsers: (c.enrolledUsers || []).filter(id => id !== undefined),
    }));
    await Course.create(courseList);
    console.log(`✅ ${courseList.length} courses created`);

    // ── Matches (many pairs) ─────────────────────────────────────────────
    console.log('🤝 Creating matches...');
    const matchDefs = [
      // accepted
      {r:0,rc:2,sc:85,ts:'React',ls:'Python',        st:'accepted'},
      {r:0,rc:1,sc:72,ts:'JavaScript',ls:'Figma',    st:'accepted'},
      {r:2,rc:10,sc:68,ts:'Python',ls:'Android Development', st:'accepted'},
      {r:1,rc:3,sc:60,ts:'UI/UX Design',ls:'DevOps', st:'accepted'},
      {r:17,rc:2,sc:55,ts:'Ethical Hacking',ls:'Machine Learning',st:'accepted'},
      {r:4,rc:0,sc:70,ts:'Python',ls:'React',        st:'accepted'},
      {r:6,rc:0,sc:65,ts:'Node.js',ls:'React',       st:'accepted'},
      {r:11,rc:1,sc:58,ts:'Flutter',ls:'UI/UX Design',st:'accepted'},
      {r:3,rc:2,sc:62,ts:'DevOps',ls:'Python',       st:'accepted'},
      {r:19,rc:2,sc:75,ts:'Mathematics',ls:'Machine Learning',st:'accepted'},
      {r:25,rc:22,sc:50,ts:'English Speaking',ls:'Digital Marketing',st:'accepted'},
      {r:26,rc:17,sc:80,ts:'Arabic',ls:'Cybersecurity',st:'accepted'},
      {r:29,rc:19,sc:66,ts:'AWS',ls:'Mathematics',  st:'accepted'},
      {r:35,rc:3,sc:59,ts:'Linux',ls:'DevOps',      st:'accepted'},
      {r:45,rc:2,sc:71,ts:'SQL',ls:'Python',        st:'accepted'},
      // pending (incoming to user 0 — areeba)
      {r:22,rc:0,sc:50,ts:'Digital Marketing',ls:'React',st:'pending',msg:'Hi! I love your React knowledge. Can we swap?'},
      {r:8,rc:0,sc:45,ts:'TypeScript',ls:'Node.js',  st:'pending',msg:'Would love to learn Node from you!'},
      {r:12,rc:1,sc:55,ts:'iOS Development',ls:'Figma',st:'pending',msg:'Your Figma skills are amazing!'},
      {r:14,rc:2,sc:40,ts:'Photography',ls:'Python',  st:'pending',msg:'Python ke badle photography seekhni hai?'},
      {r:30,rc:0,sc:48,ts:'Blockchain',ls:'React',   st:'pending',msg:'Want to learn React. Can teach Web3!'},
      // declined
      {r:11,rc:2,sc:35,ts:'Flutter',ls:'Python',st:'declined'},
      {r:23,rc:1,sc:30,ts:'Social Media',ls:'Figma',st:'declined'},
    ];

    const matchDocs = matchDefs
      .filter(m => ids[m.r] && ids[m.rc])
      .map(m => ({
        requester:  ids[m.r],
        recipient:  ids[m.rc],
        matchScore: m.sc,
        teachSkill: m.ts,
        learnSkill: m.ls,
        status:     m.st,
        message:    m.msg,
      }));
    const createdMatches = await Match.create(matchDocs);
    console.log(`✅ ${createdMatches.length} matches created`);

    // ── Sessions ─────────────────────────────────────────────────────────
    console.log('📅 Creating sessions...');
    const now = new Date();
    const d = (days) => { const dt=new Date(now); dt.setDate(dt.getDate()+days); return dt; };
    const sessionDefs = [
      // upcoming
      {te:2,le:0,sk:'Python',          at:d(2),  du:60, st:'scheduled', notes:'Bring your Python setup'},
      {te:0,le:2,sk:'React',           at:d(4),  du:60, st:'scheduled', notes:'We will cover hooks today'},
      {te:10,le:2,sk:'Android',        at:d(7),  du:90, st:'scheduled', notes:'Kotlin basics session'},
      {te:3,le:1,sk:'DevOps',          at:d(5),  du:60, st:'scheduled', notes:'Docker Compose hands-on'},
      {te:11,le:1,sk:'Flutter',        at:d(10), du:60, st:'scheduled'},
      {te:19,le:2,sk:'Mathematics',    at:d(3),  du:45, st:'scheduled'},
      {te:25,le:22,sk:'English Speaking',at:d(6),du:60, st:'scheduled'},
      {te:26,le:17,sk:'Arabic',        at:d(8),  du:60, st:'scheduled'},
      {te:6,le:0,sk:'Node.js',         at:d(12), du:60, st:'scheduled'},
      {te:4,le:0,sk:'Python',          at:d(9),  du:90, st:'scheduled'},
      // completed
      {te:1,le:0,sk:'Figma',          at:d(-7),  du:60, st:'completed', done:true},
      {te:0,le:1,sk:'JavaScript',     at:d(-14), du:60, st:'completed', done:true},
      {te:2,le:10,sk:'Machine Learning',at:d(-3),du:90, st:'completed', done:true},
      {te:3,le:2,sk:'Docker',         at:d(-10), du:60, st:'completed', done:true},
      {te:17,le:2,sk:'Cybersecurity', at:d(-20), du:60, st:'completed', done:true},
      {te:25,le:0,sk:'English Speaking',at:d(-5),du:60, st:'completed', done:true},
      {te:19,le:0,sk:'Mathematics',   at:d(-15), du:45, st:'completed', done:true},
      {te:11,le:10,sk:'Flutter',      at:d(-8),  du:60, st:'completed', done:true},
      {te:45,le:2,sk:'SQL',           at:d(-12), du:90, st:'completed', done:true},
      {te:29,le:3,sk:'AWS',           at:d(-25), du:60, st:'completed', done:true},
      {te:0,le:22,sk:'React',         at:d(-30), du:60, st:'completed', done:true},
      {te:2,le:35,sk:'Python',        at:d(-4),  du:60, st:'completed', done:true},
      // cancelled
      {te:22,le:0,sk:'SEO',           at:d(-5),  du:60, st:'cancelled'},
      {te:14,le:1,sk:'Photography',   at:d(-2),  du:45, st:'cancelled'},
    ];
    const sessionDocs = sessionDefs
      .filter(s => ids[s.te] && ids[s.le])
      .map((s,i) => ({
        teacher:      ids[s.te],
        learner:      ids[s.le],
        skill:        s.sk,
        scheduledAt:  s.at,
        duration:     s.du,
        status:       s.st,
        notes:        s.notes,
        agoraChannel: `skillswap-${Date.now()}-${i}`,
        completedAt:  s.done ? s.at : undefined,
        pointsAwarded:!!s.done,
      }));
    await Session.create(sessionDocs);
    console.log(`✅ ${sessionDocs.length} sessions created`);

    // ── Messages ─────────────────────────────────────────────────────────
    console.log('💬 Creating messages...');
    const convos = [
      {
        a:0, b:2,
        msgs:[
          {f:0, t:'Hey Ali! Ready for our React-Python swap? 🚀'},
          {f:2, t:'Haan yaar! When do you want to start?'},
          {f:0, t:'Saturday morning? I\'ll cover useState and useEffect'},
          {f:2, t:'Perfect! I\'ll prepare Python exercises for you 📊'},
          {f:0, t:'Amazing! Bring your Jupyter notebook. Starting from data types'},
          {f:2, t:'Will do! Also sharing a Kaggle dataset for practice'},
          {f:0, t:'This is going to be so productive 💪'},
        ],
      },
      {
        a:0, b:1,
        msgs:[
          {f:1, t:'Areeba! Aapki JS explanations bohot clear hain mashallah 😊'},
          {f:0, t:'Shukria Hifza! Teri Figma designs stunning hain ✨'},
          {f:1, t:'Next week aur session rakhein?'},
          {f:0, t:'Zaroor! Tuesday evening meri pasand hai 🗓️'},
          {f:1, t:'Done! I\'ll create a design challenge for you'},
          {f:0, t:'Aur main custom hooks exercise prepare karungi 💻'},
          {f:1, t:'Sounds amazing! Kal confirm karti hoon'},
        ],
      },
      {
        a:2, b:10,
        msgs:[
          {f:2, t:'Fatima, ready for Python session tomorrow?'},
          {f:10,t:'Yes! I\'ve been practicing Pandas since last time 📈'},
          {f:2, t:'Great! Today we\'ll do data visualization with Seaborn'},
          {f:10,t:'Perfect! And I\'ll show you my Kotlin app progress'},
          {f:2, t:'Deal! Session starts at 6pm sharp ⏰'},
        ],
      },
      {
        a:1, b:3,
        msgs:[
          {f:1, t:'Ahmed bhai! Docker session was mind-blowing yesterday 🔥'},
          {f:3, t:'Glad you liked it! Did Compose click for you?'},
          {f:1, t:'Haan! Containers ki concept ab clear ho gayi'},
          {f:3, t:'Next session mein Kubernetes cover karein?'},
          {f:1, t:'Please! Aur main tumhein Figma sikhaungi as promised'},
          {f:3, t:'Deal! Saturday ko schedule karte hain 📅'},
        ],
      },
      {
        a:25, b:22,
        msgs:[
          {f:25,t:'Zara! Ready to improve your business English?'},
          {f:22,t:'Yes please! I need it for client meetings 🙏'},
          {f:25,t:'Great. Today: email writing and professional tone'},
          {f:22,t:'Perfect! And I\'ll show you our Google Ads campaign'},
          {f:25,t:'Looking forward to it! See you at 5pm'},
        ],
      },
      {
        a:26, b:17,
        msgs:[
          {f:17,t:'Ustaz Kamran! Your Quranic Arabic session was 🌟'},
          {f:26,t:'JazakAllah khair! How is practice going?'},
          {f:17,t:'I\'m revising the root words daily now'},
          {f:26,t:'Masha Allah! Next: Verb conjugation (fi\'l madhi, mudhari)'},
          {f:17,t:'Can\'t wait! In return I\'ll cover ethical hacking basics for you'},
        ],
      },
    ];

    for (const c of convos) {
      if (!ids[c.a] || !ids[c.b]) continue;
      const room = [ids[c.a], ids[c.b]].sort().join('-');
      const docs = c.msgs.map((m, i) => ({
        room,
        sender: m.f === c.a ? ids[c.a] : ids[c.b],
        content: m.t,
        type: 'text',
        readBy: [ids[c.a], ids[c.b]],
        createdAt: new Date(Date.now() - (c.msgs.length - i) * 1800000),
      }));
      await Message.create(docs);
    }
    console.log('✅ Messages created');

    // ── Reviews ──────────────────────────────────────────────────────────
    console.log('⭐ Creating reviews...');
    const reviews = [
      {rev:2,  ree:0,  r:5, c:'Areeba explained React hooks so clearly! Best teacher on SkillSwap 🔥'},
      {rev:0,  ree:2,  r:5, c:'Ali ke Python sessions are amazing. Very patient and knowledgeable!'},
      {rev:0,  ree:1,  r:5, c:'Hifza\'s design eye is incredible. Learned UX in one session!'},
      {rev:1,  ree:0,  r:4, c:'Great JS teacher. Pacing could be slightly slower but excellent overall.'},
      {rev:10, ree:2,  r:5, c:'Ali ne ML bilkul simple kar ke explain kiya. Highly recommend!'},
      {rev:2,  ree:10, r:4, c:'Fatima is a great Android teacher. Very practical approach.'},
      {rev:1,  ree:3,  r:5, c:'Ahmed ke Docker sessions were eye-opening! Containers sab samajh aa gaye.'},
      {rev:2,  ree:17, r:4, c:'Usman ne cybersecurity concepts very well explain kiye. Fascinating!'},
      {rev:22, ree:25, r:5, c:'Rabea\'s English coaching is transformational. IELTS mein band 7 aaya!'},
      {rev:17, ree:26, r:5, c:'Ustaz Kamran is the best Arabic teacher. So patient and thorough!'},
      {rev:0,  ree:25, r:5, c:'My English confidence increased 10x after Rabea\'s sessions!'},
      {rev:3,  ree:29, r:4, c:'Saad ke AWS sessions are very hands-on. Learned a lot!'},
      {rev:2,  ree:45, r:4, c:'Babar ne SQL window functions ek dum clear kar diye!'},
      {rev:35, ree:2,  r:5, c:'Ali is the most patient Python teacher. Highly recommended!'},
    ];
    await Review.create(
      reviews.filter(r => ids[r.rev] && ids[r.ree]).map(r => ({
        reviewer: ids[r.rev], reviewee: ids[r.ree], rating: r.r, comment: r.c,
      }))
    );
    console.log(`✅ ${reviews.length} reviews created`);

    // ── Notifications ─────────────────────────────────────────────────────
    console.log('🔔 Creating notifications...');
    await Notification.create([
      {user:ids[0], type:'match_accepted',  title:'Match Accepted! 🎉',        message:'Ali Hassan accepted your match. Start chatting!',          isRead:false},
      {user:ids[0], type:'session_booked',  title:'Session Booked! 📅',        message:'Hifza Ikram booked a Figma session with you',              isRead:true},
      {user:ids[0], type:'badge_earned',    title:'Badge Unlocked! 🏆',        message:'You earned the "Skill Master" badge!',                     isRead:false},
      {user:ids[0], type:'review_received', title:'New Review! ⭐',            message:'Ali Hassan gave you 5 stars!',                             isRead:false},
      {user:ids[0], type:'match_request',   title:'New Match Request 🤝',      message:'Zara Khan wants to skill swap with you',                   isRead:false},
      {user:ids[0], type:'session_booked',  title:'Upcoming Session Tomorrow! ⏰', message:'Python session with Ali Hassan tomorrow at 10am',      isRead:false},
      {user:ids[1], type:'match_accepted',  title:'Match Accepted! 🎉',        message:'Areeba accepted your match. Go chat!',                     isRead:false},
      {user:ids[1], type:'review_received', title:'New Review! ⭐',            message:'Areeba gave you 5 stars for Figma teaching!',              isRead:true},
      {user:ids[2], type:'session_booked',  title:'New Session! 📅',           message:'Areeba Sajjad booked a Python session with you',           isRead:true},
      {user:ids[2], type:'match_request',   title:'Match Request 🤝',          message:'Sara Baig wants to swap Math ↔ Machine Learning',         isRead:false},
      {user:ids[2], type:'badge_earned',    title:'Badge: Skill Master! 🏆',   message:'You completed 10 sessions. Amazing!',                      isRead:false},
      {user:ids[3], type:'match_accepted',  title:'Match Accepted! 🎉',        message:'Hifza accepted. She\'ll teach you Figma!',                 isRead:false},
      {user:ids[17],type:'session_booked',  title:'Session Booked! 📅',        message:'Arabic session booked for next week',                      isRead:false},
      {user:ids[22],type:'match_request',   title:'Match Request! 🤝',         message:'Rabea Noor wants to swap English ↔ Digital Marketing',    isRead:false},
      {user:ids[25],type:'review_received', title:'Review Received! ⭐',       message:'Zara gave you 5 stars for English coaching!',              isRead:false},
    ]);
    console.log('✅ Notifications created');

    // ── Summary ───────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🌱  DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📋 All 50 accounts — password: password123\n');
    console.log('   👑 ADMIN ACCOUNTS:');
    console.log('   areeba@skillswap.pk   (Admin + React Expert)');
    console.log('   hifza@skillswap.pk    (Admin + UI/UX Designer)');
    console.log('\n   🔑 FEATURED TEST ACCOUNTS:');
    console.log('   ali@skillswap.pk      (Python + ML)');
    console.log('   ahmed@skillswap.pk    (DevOps + Docker)');
    console.log('   fatima@skillswap.pk   (Android Dev)');
    console.log('   usman@skillswap.pk    (Cybersecurity)');
    console.log('   zara@skillswap.pk     (Digital Marketing)');
    console.log('   omar@skillswap.pk     (Flutter)');
    console.log('   sara@skillswap.pk     (Mathematics)');
    console.log('   rabea@skillswap.pk    (English Speaking)');
    console.log('\n═══════════════════════════════════════════════════════\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

seed();
