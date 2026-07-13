# Project Overview: Hey Attrangi App

## 1. Executive Summary
**Hey Attrangi** is a comprehensive mental health and wellness platform designed to connect patients, caregivers, and therapists. The application facilitates appointment bookings, secure payments, video consultations, and provides a rich resource library and wellness tracking tools.

## 2. Technology Stack

### Core Framework
- **Frontend/Backend**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript

### Data & Storage
- **Database**: MongoDB (v7.0.0)
- **ORM**: Prisma (v5.20.0)
- **Cloud Storage**: Cloudinary (v2.8.0)

### Authentication & Security
- **Auth**: NextAuth.js (v5.0.0-beta.30)
- **Strategies**: Google OAuth, Role-based Access Control (Patient, Caregiver, Doctor, Admin)
- **Encryption**: bcryptjs

### Integration & Services
- **Payments**: Razorpay (India-focused)
- **Communications**: Twilio (Video/Chat/SMS)
- **AI/ML**: OpenAI Whisper (planned for transcripts)

### Styling & UI
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: React Icons (implied usage in components)

## 3. Core Features

### 👥 User Roles
- **Patients**: Access to therapy, resources, and wellness tools.
- **Caregivers**: Manage accounts for dependents/patients.
- **Doctors**: Manage availability, conduct sessions, and receive payments.
- **Admins**: Platform oversight and doctor approval.

### 📅 Appointment System
- Doctor availability management.
- User-friendly slot selection.
- Automated meeting link generation.

### 💳 Financials
- **Gateway**: Razorpay integration.
- **Fee Model**: Platform takes 20% commission; remainder settled to doctors via UPI.
- **Verification**: Webhook-based payment verification.

### 📹 Telehealth
- Integrated video and chat sessions.
- Session recording and transcript capabilities (planned).

### 🧘 Wellness Tools
- **Daily Tasks**: Gamified wellness activities (Duolingo-style).
- **Resource Library**: Curated mental health content (Free & Premium).

## 4. Project Structure (Key Directories)

- **`/app`**: Main application routes (Next.js App Router).
    - `api/`: Backend API endpoints (Auth, Payments, tasks, etc.).
    - `(routes)`: Organized by functionality (patient, doctor, admin).
- **`/components`**: Reusable UI components.
    - `onboarding/`: User registration flows.
    - `providers/`: Context providers (Session, Toast, etc.).
- **`/lib`**: Utility functions and configurations (Prisma, Auth, Payments).
- **`/prisma`**: Database schema definition (`schema.prisma`).
- **`/public`**: Static assets.

## 5. Development Workflow

### Prerequisites
- Node.js 18+
- MongoDB
- API Keys (Google, Razorpay, Twilio, OpenAI)

### Setup
1. **Clone & Install**: `npm install`
2. **Env Setup**: Configure `.env` (Database, NextAuth, API Keys).
3. **Database**: `npx prisma db push`
4. **Run**: `npm run dev`

## 6. Future Roadmap
- DigiLocker integration for verification.
- Enhanced video session features (recording).
- Advanced AI integrations for transcripts and recommendations.
