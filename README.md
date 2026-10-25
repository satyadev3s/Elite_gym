# IronFit Elite — Full-Stack Fitness Platform

A high-performance fitness web application featuring 3D interactive anatomical muscle mapping, periodized workout programming, 30-Day Kabaddi Conditioning Blueprint, biometric circumference logging, fitness calculators, and online class booking.

---

## 🏗️ Project Architecture

```
gym/
├── frontend/                        # React 19 + Vite Frontend Application
│   ├── public/                      # Static web assets (favicon.svg, icons, workout videos)
│   ├── src/                         # React source tree
│   │   ├── assets/                  # Images and static media
│   │   ├── components/              # Modular UI components (Navbar, Hero, MuscleMap, etc.)
│   │   │   └── styles/              # Component-scoped CSS stylesheets
│   │   ├── data/                    # Static exercise schedules, 30-day Kabaddi plan, anatomy data
│   │   ├── pages/                   # Standalone views (LoginPage.jsx, PaymentPage.jsx)
│   │   ├── services/                # API Client (api.js) with seamless offline fallback
│   │   ├── App.css                  # Global layout styles
│   │   ├── App.jsx                  # Root application & routing coordinator
│   │   ├── index.css                # Global CSS tokens & variables
│   │   └── main.jsx                 # Vite React entrypoint
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite bundler configuration
│   └── package.json                 # Frontend dependencies (React, Vite, Oxlint)
│
├── backend/                         # Express & Mongoose Backend API (Port 5000)
│   ├── config/
│   │   └── db.js                    # Database connection (MongoDB + local JSON fallback)
│   ├── database/
│   │   ├── localDb.js               # Embedded zero-dependency JSON persistence engine
│   │   ├── seed.js                  # Database seeder
│   │   └── data/                    # JSON data storage (used when MongoDB is offline)
│   ├── models/                      # Mongoose Schemas (Member, ClassBooking, ContactMessage, etc.)
│   ├── controllers/                 # Route Business Logic (auth, bookings, contact, progress)
│   ├── routes/                      # REST API Endpoint Routers (/api/auth, /api/bookings, etc.)
│   ├── server.js                    # Express Application Server entrypoint (Port 5000)
│   ├── package.json                 # Backend dependencies (express, cors, mongoose, dotenv)
│   ├── .env                         # Environment variables
│   └── .env.example                 # Example environment template
│
├── archive/                         # Archived secondary projects
├── package.json                     # Root workspace runner (runs frontend & backend from root)
└── .oxlintrc.json                   # Linter configuration
```

---

## 🚀 Available Scripts

### Run Frontend Development Server
```bash
npm run dev
# Starts Vite React dev server at http://localhost:5173/
```

### Run Backend API Server
```bash
npm run server
# Starts Express API server at http://localhost:5000/
# Live API health check: http://localhost:5000/api/health
```

### Seed Database
```bash
npm run server:seed
# Populates default member (Alex Morgan), sample class bookings, and progress logs
```

### Production Build
```bash
npm run build
# Compiles React frontend into dist/ for deployment
```

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check and database status |
| `POST` | `/api/auth/register` | Register new member |
| `POST` | `/api/auth/login` | Member authentication |
| `GET` | `/api/auth/profile` | Retrieve member profile by email |
| `PUT` | `/api/auth/profile` | Update active fitness objective / tier |
| `GET` | `/api/bookings` | Retrieve class reservations |
| `POST` | `/api/bookings` | Book a fitness class (Yoga, HIIT, Zumba) |
| `DELETE`| `/api/bookings/:id` | Cancel class reservation |
| `POST` | `/api/contact` | Submit contact inquiry |
| `GET` | `/api/contact` | Retrieve all inquiries (admin) |
| `GET` | `/api/progress` | Fetch biometric measurement history |
| `POST` | `/api/progress` | Log weight and circumference entry |
| `GET` | `/api/routines` | Get workout programs |
| `POST` | `/api/routines` | Save custom workout routine |
