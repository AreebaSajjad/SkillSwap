# ⚡ SkillSwap — Complete Setup & Run Guide
### CSC-337 AWT | Group 14 | Areeba Sajjad & Hifza Ikram

---

## 📋 Prerequisites (Pehle yeh install karo)

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | https://nodejs.org |
| **MongoDB** | Latest | https://www.mongodb.com/try/download/community |
| **Git** | Any | https://git-scm.com |
| **MongoDB Compass** | Any (Optional GUI) | https://www.mongodb.com/products/compass |

---

## 🚀 Step-by-Step Setup

### STEP 1 — Project Extract karo

```
skillswap_group14.zip ko extract karo
cd skillswap
```

---

### STEP 2 — Dependencies Install karo

```bash
# Root folder se (sab kuch ek baar mein install hoga)
npm run install-all
```

Yeh teen jagah install karega:
- `skillswap/` (root concurrently)
- `skillswap/backend/` (Express, MongoDB, Socket.io...)
- `skillswap/frontend/` (React, Vite, Socket.io-client...)

⏳ 2-3 minute lagenge. Internet slow ho to zyada.

---

### STEP 3 — MongoDB Start karo

**Option A — Local MongoDB:**
```bash
# Windows mein (Command Prompt as Administrator):
mongod

# Ya MongoDB service automatically chal rahi hogi
# Check: services.msc → MongoDB Server → Running
```

**Option B — MongoDB Atlas (Cloud, Recommended):**
1. https://cloud.mongodb.com par account banao (free)
2. New Cluster banao (M0 Free Tier)
3. Database Access → User banao (username + password)
4. Network Access → 0.0.0.0/0 allow karo
5. Connect → Compass/Application → Connection string copy karo
6. `.env` file mein paste karo:
```env
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.abc123.mongodb.net/skillswap
```

---

### STEP 4 — Environment Variables Check karo

`backend/.env` file already filled hai with your credentials:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/skillswap

JWT_SECRET=Areebasajjadpassword
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=dhzrlyngx
CLOUDINARY_API_KEY=296918893162351
CLOUDINARY_API_SECRET=AvmBDdu6b6_LFP7rv4FLTX_E8rw

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=developer.genius.cs@gmail.com
EMAIL_PASS=ivailucjjlaopbtq

AGORA_APP_ID=f81f1bf7e0354d7a842d61c11937488c
AGORA_APP_CERTIFICATE=3e1b3884bd8247338d750dbb5c78b1da

CLIENT_URL=http://localhost:3000
```

> ℹ️ `OPENAI_API_KEY` nahi hai to AI matching cosine similarity use karega — perfectly fine!

---

### STEP 5 — Seed Data Add karo (Demo data)

```bash
cd backend
npm run seed
```

Yeh create karega:
- ✅ 10 users (different skills)
- ✅ 8 courses
- ✅ 8 matches
- ✅ 10 sessions
- ✅ Chat messages
- ✅ Reviews & notifications

**Reset karna ho to:**
```bash
npm run seed:destroy
```

---

### STEP 6 — Application Run karo

```bash
# Root folder mein jao (skillswap/)
cd ..
npm run dev
```

Yeh dono ek saath start honge:

```
[backend]  ✅ MongoDB Connected
[backend]  🚀 Server running on port 5001 in development mode
[frontend] VITE v5.x ready in 800ms
[frontend] ➜  Local:   http://localhost:3000
```

---

## 🌐 Access karo

| URL | Kya hai |
|-----|---------|
| `http://localhost:3000` | React Frontend (main app) |
| `http://localhost:5001/api/health` | Backend health check |
| `http://localhost:5001/api/auth/login` | API endpoint |

---

## 🔑 Test Accounts (seed ke baad)

All passwords: **`password123`**

| Email | Role | Specialty |
|-------|------|-----------|
| `areeba@skillswap.pk` | 🛡️ **ADMIN** | React, JS, Node.js |
| `hifza@skillswap.pk` | User | UI/UX, Figma |
| `ali@skillswap.pk` | User | Python, ML |
| `fatima@skillswap.pk` | User | Android, Content |
| `usman@skillswap.pk` | User | Cybersecurity |
| `zara@skillswap.pk` | User | Digital Marketing |
| `ahmed@skillswap.pk` | User | DevOps, Docker |
| `sara@skillswap.pk` | User | Math, DSA |
| `omar@skillswap.pk` | User | Flutter, Quran |
| `nadia@skillswap.pk` | User | Photography |

---

## 👑 Admin Panel Access karna

**Areeba ka account already admin hai!** Login karo:
- Email: `areeba@skillswap.pk`
- Password: `password123`

Sidebar mein "Admin Panel" 🛡️ button dikhega.

---

## 🧪 Testing Flow (Demo ke liye)

### Real-time Chat Test:
1. Chrome mein login: `areeba@skillswap.pk`
2. Firefox (Incognito) mein login: `ali@skillswap.pk`
3. Dono ke beech accepted match already hai
4. Chat → dono sides se messages dekho real-time!

### AI Matching Test:
1. Login karo `zara@skillswap.pk` (Digital Marketing)
2. AI Matches page pe jao
3. React/JS teachers ke suggestions dikhenge with % score

### Video Call Test:
1. Chat mein kisi bhi conversation open karo
2. Top right "📹 Video Call" button dabao
3. Camera permission allow karo
4. Call screen opens!

### Session + Points Test:
1. Sessions → Book Session
2. Koi bhi match choose karo
3. Complete Session dabao → 100 points instantly!

---

## ❌ Common Errors & Fixes

### Error: `EADDRINUSE: address already in use :::5001`
```bash
# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:5001 | xargs kill
```

### Error: `MongoServerSelectionError`
MongoDB chal nahi raha. Check:
```bash
# Local MongoDB start karo:
mongod --dbpath C:\data\db    # Windows
mongod                         # Mac/Linux
```
Ya Atlas connection string `.env` mein sahi paste karo.

### Error: `npm: command not found`
Node.js install nahi hai. https://nodejs.org se install karo.

### Error: `Cannot find module 'react'` ya koi npm package
```bash
cd frontend
npm install
cd ../backend
npm install
```

### Frontend opens but API calls fail (CORS error)
`backend/.env` mein check karo:
```
CLIENT_URL=http://localhost:3000
```
Port 3000 hona chahiye (same as Vite).

### Email send nahi ho rahi
Gmail "App Password" issue hoga. Gmail account → Security → 2-Step Verification ON → App passwords → Generate karo → `.env` mein `EMAIL_PASS` update karo.

---

## 📁 Project Structure (Quick Reference)

```
skillswap/
│
├── package.json          ← Root (npm run dev runs both)
│
├── backend/
│   ├── server.js         ← ENTRY POINT (Node + Express + Socket.io)
│   ├── seed.js           ← Run this to fill dummy data
│   ├── .env              ← Your credentials (already filled)
│   ├── models/           ← MongoDB schemas
│   ├── controllers/      ← Business logic
│   ├── routes/           ← API endpoints
│   ├── middleware/        ← JWT auth, error handler
│   ├── socket/           ← Real-time events
│   ├── config/           ← Cloudinary setup
│   └── utils/            ← Email helper
│
└── frontend/
    ├── vite.config.js    ← Vite + proxy to backend
    ├── index.html        ← Entry HTML
    └── src/
        ├── App.jsx       ← Routes
        ├── index.css     ← Global dark purple theme
        ├── context/      ← Auth + Socket state
        ├── services/     ← All API calls (axios)
        ├── components/   ← Sidebar, Navbar
        └── pages/        ← 10 page components
```

---

## 🔄 Running Separately (Frontend aur Backend alag alag)

**Backend only:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5001
```

**Frontend only:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
# Automatically proxies /api calls to :5001
```

**Both together (recommended):**
```bash
# From root skillswap/ folder:
npm run dev
```

---

## 🚀 Production Deployment

**Frontend → Vercel:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

**Backend → Render:**
1. GitHub pe push karo
2. Render.com → New Web Service → connect repo
3. Root dir: `backend`, Build: `npm install`, Start: `node server.js`
4. Environment variables add karo from .env

---

*SkillSwap — CSC-337 Advanced Web Technology · Dr. Waseem Akram*
*Areeba Sajjad (FA23-BCS-033) · Hifza Ikram (FA23-BCS-053)*
