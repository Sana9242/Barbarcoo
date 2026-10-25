# Barba & Co. — Luxury Master Barbershop & Booking Atelier

A production-grade full-stack web application for an upscale barbershop, built with **Next.js (App Router)**, **Node.js (Express)**, **SQLite**, and **Prisma ORM**.

---

## What It Does

- **For Clients:** Browse luxury grooming services and master barber profiles, check live available time slots, book appointments with instant confirmation codes (`BRB-XXXXX`), download `.ics` calendar events, and look up booking status anytime.
- **For Barbershop Managers / Staff:** Access a secure Admin Portal (`/admin`) with real-time KPI metrics, search and filter appointments by date and status, and update appointment states (Confirm, Complete, Cancel) with instant SQLite database synchronization.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Google Fonts (`Plus Jakarta Sans` & `Playfair Display`), Dark Mode |
| **Backend API** | Node.js, Express, TypeScript (in `/server`), RESTful JSON API |
| **Database** | SQLite with Prisma ORM (`prisma/dev.db`), realistic seed data |
| **Validation** | Zod schemas shared across client and server |
| **Security & Auth** | JWT stored in `httpOnly` cookies, bcryptjs password hashing, helmet, CORS, express-rate-limit |

---

## What's Included

### 1. Frontend Pages (Mobile-First & Responsive)
- **Home (`/`)**: Luxury hero banner, value proposition, signature services showcase, master barbers team, verified client reviews, hours & location.
- **Services & Pricing (`/services`)**: Categorized service menu (Haircuts, Beard & Shave Architecture, Treatments & Color, Curated Rituals), pricing, durations, and one-click booking pre-selection.
- **Master Barbers (`/barbers`)**: Detailed barber profiles, specialties, bios, experience years, client ratings, and direct booking buttons.
- **Book Appointment (`/book`)**: Multi-step booking wizard with live slot calculation and conflict detection, client info validation, and confirmation screen.
- **Track Booking (`/book/lookup`)**: Real-time reservation status tracker via booking reference code.
- **About & Contact (`/contact`)**: Studio address, phone, email, operating hours, subway transit directions, FAQ accordion, and interactive inquiry form.
- **Staff Login (`/admin/login`)**: Authenticated portal with one-click demo credentials prefiller.
- **Admin Dashboard (`/admin`)**: Operations portal with KPI statistics, search & date filters, and appointment status dropdown updater.
- **Custom 404 (`/not-found.tsx`)**: Themed 404 page with return-to-home actions.

### 2. Backend REST API Endpoints (`/server`)
- `GET  /api/health` — Health check
- `GET  /api/services` & `GET /api/services/categories` — Categorized service catalog
- `GET  /api/barbers` — Master barber profiles
- `GET  /api/appointments/slots` — Dynamic available slot calculation engine
- `POST /api/appointments` — End-to-end appointment creation with Zod validation
- `GET  /api/appointments/lookup/:code` — Booking lookup by reference code
- `POST /api/auth/login` — Admin authentication with `httpOnly` JWT cookie
- `POST /api/auth/logout` — Secure cookie clearance
- `GET  /api/auth/me` — Current authenticated staff session
- `GET  /api/admin/stats` — Operations KPI statistics
- `GET  /api/admin/appointments` — Filterable appointments feed
- `PATCH /api/admin/appointments/:id/status` — Live status transition (Confirm, Complete, Cancel)
- `GET  /api/reviews` — Client testimonials

---

## Installation & Setup

### Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Sample Data
Pushes the Prisma schema to local SQLite (`prisma/dev.db`) and seeds realistic barbers, services, appointments, and reviews:
```bash
npm run db:setup
```

*(Alternatively, run `npx prisma db push` followed by `npx tsx prisma/seed.ts`)*

---

## How to Run

### Option A: Run Both Together (Recommended)
Runs Next.js frontend (port 3000) and Express API server (port 5000) concurrently:
```bash
npm run dev
```

### Option B: Run Individually
- **Express Backend API (port 5000):**
  ```bash
  npm run dev:server
  ```
- **Next.js Frontend (port 3000):**
  ```bash
  npm run dev:frontend
  ```

---

## Default Staff Login Credentials

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email:** `admin@barba.co`
- **Password:** `admin123`
*(There is also a convenient "Click here to prefill demo credentials" button directly on the login screen)*

---

## Running Automated Verification Tests

To run the end-to-end test suite verifying all pages, API endpoints, slot calculations, booking creation, code lookup, and admin status updates:
```bash
npx tsx test-e2e.ts
```
