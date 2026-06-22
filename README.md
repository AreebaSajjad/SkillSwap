# ⚡ SkillSwap — Peer-to-Peer Skill Exchange Platform

> **"Trade your skills, not your money"**
> CSC-337 Advanced Web Technology | Group 14
> Areeba Sajjad (FA23-BCS-033) · Hifza Ikram (FA23-BCS-053)
> Instructor: Dr. Waseem Akram

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas
- Git

### Step 1 — Clone & Install
```bash
git clone <your-repo-url>
cd skillswap
npm run install-all
```

### Step 2 — Configure .env
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials (already filled with your keys)
```

### Step 3 — Start MongoDB
```bash
# Option A: Local
mongod

# Option B: Atlas (paste connection string in .env MONGO_URI)
```

### Step 4 — Run
```bash
# From root folder:
npm run dev
```

- 🖥️ Backend: http://localhost:5001
- 🌐 Frontend: http://localhost:3000

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                      │
│         React.js 18 + Custom CSS (Dark Purple)       │
│    React Router v6 · Context API · Socket.io-client  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼──────────────────────────────┐
│              BUSINESS LOGIC LAYER                    │
│           Node.js 20 + Express.js 4                  │
│    REST API · JWT Auth · Socket.io · AI Matching     │
└──────────────────────┬──────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────┐
│                  DATA LAYER                          │
│              MongoDB Atlas + Mongoose                 │
│    Users · Sessions · Messages · Courses · Reviews   │
└─────────────────────────────────────────────────────┘
         │          │          │          │
    Cloudinary  Nodemailer  OpenAI    Agora.io
    (Images)    (Email)     (AI Match) (Video)
```

---

## ✅ Features (10 Modules)

| # | Module | Tech | Status |
|---|--------|------|--------|
| 1 | **User Auth** | JWT + bcryptjs | ✅ |
| 2 | **Skill Profile** | MongoDB CRUD | ✅ |
| 3 | **AI Matching** | Cosine Similarity | ✅ |
| 4 | **Session Booking** | Email alerts | ✅ |
| 5 | **Real-time Chat** | Socket.io | ✅ |
| 6 | **Video Sessions** | WebRTC/Agora | ✅ |
| 7 | **Micro-Courses** | Upload + Quiz | ✅ |
| 8 | **Rating & Review** | 1-5 stars | ✅ |
| 9 | **Gamification** | Points + Badges | ✅ |
| 10 | **Admin Dashboard** | Analytics + Moderation | ✅ |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Current user |
| GET | /api/matches/suggestions | ✅ | AI suggestions |
| POST | /api/matches/request/:id | ✅ | Send request |
| PUT | /api/matches/:id/respond | ✅ | Accept/decline |
| POST | /api/sessions | ✅ | Book session |
| PUT | /api/sessions/:id/complete | ✅ | Complete (+points) |
| GET | /api/messages/rooms | ✅ | Chat rooms |
| GET | /api/messages/rooms/:id | ✅ | Messages |
| GET | /api/users/leaderboard/top | ❌ | Leaderboard |
| GET | /api/admin/stats | 🛡️ | Admin stats |

---

## ⚡ Socket Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `register_user` | → Server | Register socket |
| `join_room` | → Server | Join chat room |
| `send_message` | → Server | Send message |
| `receive_message` | ← Server | Receive message |
| `user_typing` | ↔ | Typing indicator |
| `call_user` | → Server | Start video call |
| `incoming_call` | ← Server | Incoming call alert |
| `call_accepted` | ↔ | Call accepted |
| `call_ended` | ↔ | End call |
| `online_users` | ← Server | Online users list |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Custom CSS, React Router v6 |
| Backend | Node.js 20, Express.js 4 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io 4.x |
| Video | Agora.io WebRTC |
| AI Matching | Cosine Similarity Algorithm |
| Images | Cloudinary |
| Email | Nodemailer (Gmail) |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 🧪 Testing Flow

1. Register 2 users in different browser tabs
2. Add teaching & learning skills to each profile  
3. Go to **AI Matches** — see compatibility scores
4. Send match request from User A, accept from User B
5. Open **Chat** — message in real-time
6. **Book a Session** — receive email confirmation
7. **Complete Session** — earn points + badges
8. Check **Leaderboard** — see your rank

---

## 👑 Make Yourself Admin

1. Register normally
2. Open MongoDB Compass → `skillswap` db → `users` collection
3. Find your user → edit `role` field from `"user"` to `"admin"`
4. Reload app → Admin Panel appears in sidebar

---

*Built with ❤️ — Advanced Web Technology, Final Semester*
