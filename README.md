# Attrangi - Mental Health & Wellness Platform

A comprehensive mental health support platform connecting patients, caregivers, and therapists with features for appointment booking, payments, video sessions, resource library, and daily wellness tasks.

## 🏗️ Architecture

### Tech Stack

- **Frontend & Framework**: Next.js 16 (App Router) with React 19
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Razorpay (India-focused payment gateway)
- **Video/Chat**: Twilio (configurable to Agora or Vonage)
- **Transcripts**: OpenAI Whisper API
- **Styling**: Tailwind CSS with soft, muted color palette

### Key Features

✅ **Multi-User System**
- Patient + Caregiver login
- Doctor onboarding with optional DigiLocker verification
- Admin login with Google OTP

✅ **Appointment Management**
- Doctor availability control
- Time slot booking
- Automatic meeting link generation

✅ **Payment System**
- Razorpay integration
- Automatic platform fee split (20%)
- Settlement to doctor's UPI

✅ **Communication**
- Chat + Video sessions
- Session recording
- Transcript generation

✅ **Resource Library**
- Free and premium resources
- Categorized content

✅ **Wellness Tracking**
- Daily tasks/activities (Duolingo-style)
- Progress tracking

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- MongoDB database (cloud or local)
- Google OAuth credentials
- Razorpay account (for payments)
- Twilio account (for video/chat - optional)

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/hey-attrangi?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# Twilio (Optional - for SMS/OTP)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Video/Chat (Twilio)
TWILIO_API_KEY=""
TWILIO_API_SECRET=""

# OpenAI (for transcripts)
OPENAI_API_KEY=""
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for MongoDB)
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
hey-attrangi-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   ├── onboarding/              # User onboarding APIs
│   │   ├── appointments/            # Appointment booking APIs
│   │   ├── payments/                # Payment processing APIs
│   │   ├── resources/               # Resource library APIs
│   │   └── tasks/                   # Daily tasks APIs
│   ├── auth/                        # Authentication pages
│   ├── onboarding/                  # Onboarding flows
│   ├── patient/                     # Patient dashboard
│   ├── doctor/                      # Doctor dashboard
│   ├── admin/                       # Admin panel
│   └── layout.tsx                   # Root layout
├── components/
│   ├── onboarding/                  # Onboarding components
│   └── providers/                   # Context providers
├── lib/
│   ├── prisma.ts                    # Prisma client instance
│   ├── auth.ts                      # Auth utilities
│   └── payments.ts                  # Payment utilities
├── prisma/
│   └── schema.prisma                # Database schema
└── types/
    └── next-auth.d.ts               # NextAuth type definitions
```

## 🔐 Authentication Flow

1. **Patient/Caregiver**: Google OAuth → Role selection → Profile setup → Dashboard
2. **Doctor**: Google OAuth → Role selection → Professional details → License verification (optional DigiLocker) → Admin approval → Dashboard
3. **Admin**: Google OAuth → Role selection → Phone OTP → Dashboard

## 💳 Payment Flow

1. Patient books appointment
2. Razorpay order created
3. Patient pays via UPI/Card/Wallet
4. Payment verified via webhook
5. Platform fee (20%) deducted automatically
6. Remaining amount settled to doctor's UPI

## 📅 Appointment Booking

1. Patient browses doctors
2. Selects available time slot
3. Pays consultation fee
4. Meeting link and chat channel auto-generated
5. Doctor and patient can join video session

## 🎨 Color Theme

The platform uses a soft, muted color palette designed for mental health applications:

- **Background**: Light grays and off-whites
- **Primary Accent**: Soft teal/blue-green (#7dd3c0)
- **Secondary Accent**: Muted purple (#d6bcfa)
- **Tertiary**: Gentle green (#9ae6b4)
- **Text**: Charcoal-gray for readability

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out

### Onboarding
- `POST /api/onboarding/patient` - Complete patient profile
- `POST /api/onboarding/doctor` - Complete doctor profile
- `POST /api/onboarding/caregiver` - Complete caregiver profile
- `POST /api/onboarding/admin` - Complete admin profile

### Appointments
- `POST /api/appointments/book` - Book an appointment
- `GET /api/appointments` - Get user's appointments

### Payments
- `POST /api/payments/verify` - Verify Razorpay payment

### Resources
- `GET /api/resources` - Get resources (filtered by premium status)

### Tasks
- `GET /api/tasks` - Get patient's tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks` - Update task (complete/uncomplete)

## 🚧 TODO / Future Enhancements

- [ ] Implement DigiLocker API integration for license verification
- [ ] Set up Twilio video/chat rooms
- [ ] Integrate OpenAI Whisper for transcript generation
- [ ] Implement Razorpay Routes for automatic settlement
- [ ] Add video session recording functionality
- [ ] Create admin dashboard for doctor approval
- [ ] Build resource library management system
- [ ] Add daily task recommendation engine

## 📝 Database Schema

The platform uses MongoDB with Prisma ORM. Key models:

- `User` - Base authentication model (NextAuth)
- `Patient` - Patient profiles
- `Caregiver` - Caregiver profiles
- `Doctor` - Doctor profiles with license verification
- `Admin` - Admin profiles
- `Appointment` - Appointment bookings
- `Payment` - Payment transactions
- `SessionRecording` - Video session recordings
- `Resource` - Resource library items
- `DailyTask` - Patient wellness tasks
- `DoctorAvailability` - Doctor availability settings
- `TimeSlot` - Available appointment slots

## 🤝 Contributing

This is a production-ready architecture template. To customize:

1. Update color scheme in `app/globals.css`
2. Modify database schema in `prisma/schema.prisma`
3. Add new API routes in `app/api/`
4. Customize onboarding flows in `components/onboarding/`

## 📄 License

Private - All rights reserved

---

Built with ❤️ for mental health support
