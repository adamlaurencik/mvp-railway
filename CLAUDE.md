# Barber Reservation System - MVP Requirements

## Overview
A multi-tenant barber reservation system MVP where each barber has their own booking page and calendar. Customers book through a barber's unique URL, and barbers manage their own availability through individual dashboards.

---

## Core Functional Requirements

### Customer Features

**Slot Selection & Booking**
- Access barber's booking page via unique URL (e.g., `/book/john-doe` or `/barber/john-doe`)
- View that specific barber's available time slots
- Select a single time slot to book
- Provide basic contact information (name, phone/email)
- Receive booking confirmation
- View their upcoming booking(s) with that barber
- Cancel their own booking

### Barber Features

**Availability Management**
- Login to personal barber dashboard
- Create available time slots for their own calendar (date, start time, duration)
- View only their own slots (available, booked, past)
- See which of their slots are booked vs. available
- Cancel/remove their own slots if needed
- View customer details for their booked appointments (name, contact info)
- See their unique booking URL to share with customers

### Admin Features

**Barber Account Management**
- Create new barber accounts
- Set up unique booking URLs for each barber (e.g., `/book/barber-name`)
- View list of all barbers in the system
- Disable/enable barber accounts
- Reset barber passwords if needed

---

## System Requirements

**Authentication & Access Control**
- Admin login for system management
- Individual barber login/authentication
- Barbers can only access their own data and calendar
- Customers don't need accounts (public booking pages)
- Route-based access: `/book/{barber-identifier}` for customers, `/dashboard` for barbers, `/admin` for admin

**Data Management**
- Store time slots with barber association and status (available/booked)
- Store customer booking information linked to specific barber
- Prevent double-booking (slot becomes unavailable once booked)
- Data isolation: barbers can only see/modify their own slots and bookings
- Unique URL routing per barber

**User Interface**
- Customer-facing booking pages (public, unique per barber at `/book/{identifier}`)
- Individual barber dashboards (authenticated at `/dashboard`)
- Admin panel for barber management (authenticated at `/admin`)
- Mobile-responsive design across all views

---

## Out of Scope (Post-MVP)

- Multiple service types/products per barber
- Payment processing
- Custom domains/subdomains per barber
- Email/SMS notifications
- Customer accounts/login
- Reviews/ratings
- Waitlist functionality
- Detailed barber profiles/bios/photos
- Analytics dashboard for admin
- Bulk slot creation tools

---

## Technical Considerations

**Tech Stack**
- **Frontend**: React (served via Node.js)
- **Backend**: Python with FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Job Queue**: Celery + Redis (for future async tasks like SMS)
- **Deployment**: Railway
- **Authentication**: JWT tokens or session-based auth

**Railway Services Setup**
- Service 1: React frontend (Node.js serving build)
- Service 2: FastAPI backend
- Service 3: PostgreSQL (Railway managed database)
- Service 4: Redis (Railway managed, add when implementing async jobs)
- Service 5: Celery worker (add when implementing async jobs)

**Migration Strategy**
- Use Alembic for database migrations
- Store migration files in git
- Railway release command: `alembic upgrade head`
- Migrations run automatically before each deployment

**Project Structure**
```
frontend/
├── src/
├── public/
└── package.json

backend/
├── alembic/
│   ├── versions/          # migration files
│   └── env.py
├── app/
│   ├── models/            # SQLAlchemy models
│   ├── api/
│   │   ├── barber.py      # barber endpoints
│   │   ├── booking.py     # booking endpoints
│   │   └── admin.py       # admin endpoints
│   ├── schemas/           # Pydantic schemas
│   ├── tasks/             # Celery tasks (future)
│   └── core/
│       ├── config.py
│       ├── database.py
│       └── auth.py
├── alembic.ini
├── requirements.txt
└── main.py
```

**Async Jobs Architecture (Future)**
- Celery worker connects to Redis message broker
- Tasks defined in `app/tasks/` (e.g., `send_sms.py`, `send_email.py`)
- FastAPI endpoints enqueue jobs: `send_sms.delay(phone, message)`
- Celery worker processes jobs asynchronously
- Railway deploys Celery worker as separate service

**MVP Simplification**
- Start without Celery/Redis - add only when needed
- Use synchronous operations for initial launch
- Architecture supports adding async jobs without major refactoring

**Key Data Models**
1. **Barber**: id, username, password_hash, display_name, url_identifier (unique slug), email, status (active/inactive)
2. **TimeSlot**: id, barber_id, date, start_time, duration, status (available/booked), customer_id
3. **Customer**: id, name, phone, email (captured at booking)
4. **Admin**: id, username, password_hash (for system administration)

---

## Success Metrics for MVP
- Admin can create a new barber account in under 2 minutes
- Barber can create slots in under 1 minute
- Customer can book a slot in under 2 minutes
- Zero double-bookings per barber
- Complete data isolation between barbers
- System handles 10+ barbers with 50+ slots each without performance issues