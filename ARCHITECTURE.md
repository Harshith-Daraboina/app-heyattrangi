# Architecture Documentation

## System Overview

Attrangi is a full-stack mental health platform built with Next.js 16, MongoDB, and NextAuth. The system supports multiple user types (Patients, Caregivers, Doctors, Admins) with comprehensive features for appointment booking, payments, video sessions, and wellness tracking.

## Database Schema (Prisma/MongoDB)

### Core Models

1. **User** (NextAuth base model)
   - Authentication via NextAuth
   - Role-based access (PATIENT, CAREGIVER, DOCTOR, ADMIN)
   - Linked to specific role profiles

2. **Patient**
   - Profile information (age, gender, health concerns)
   - Emergency contacts
   - Linked to appointments, tasks, resources

3. **Caregiver**
   - Relationship to patient
   - Can book appointments for linked patients

4. **Doctor**
   - Professional details (specialization, experience)
   - License verification (DigiLocker optional)
   - Availability settings
   - Payment UPI for settlements

5. **Admin**
   - OTP-enabled login
   - Permissions management
   - Doctor approval workflow

6. **Appointment**
   - Links patient/caregiver to doctor
   - Time slot booking
   - Payment tracking
   - Meeting links and chat channels

7. **Payment**
   - Razorpay integration
   - Platform fee calculation (20%)
   - Settlement tracking

8. **Resource**
   - Free and premium content
   - Multiple types (articles, videos, PDFs, etc.)

9. **DailyTask**
   - Wellness activities
   - Progress tracking
   - Duolingo-style gamification

## Authentication Flow

### NextAuth Configuration
- Provider: Google OAuth
- Adapter: Prisma Adapter (database sessions)
- Session strategy: Database (not JWT)

### User Flows

1. **Patient/Caregiver**
   - Sign in with Google → Select role → Complete profile → Dashboard

2. **Doctor**
   - Sign in with Google → Select role → Professional details → License verification (optional) → Await admin approval → Dashboard

3. **Admin**
   - Sign in with Google → Select role → Phone OTP → Dashboard

## Payment Flow

1. **Booking Process**
   ```
   Patient selects doctor → Selects time slot → Creates appointment
   → Razorpay order created → Payment page → Patient pays
   ```

2. **Payment Processing**
   ```
   Payment verified → Update appointment status to CONFIRMED
   → Generate meeting link & chat channel
   → Platform fee (20%) deducted
   → Doctor amount calculated (80%)
   → Settlement to doctor's UPI (via Razorpay Routes/Payouts)
   ```

3. **Platform Fee Split**
   - Total amount: ₹1000
   - Platform fee (20%): ₹200
   - Doctor receives: ₹800

## API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

### Onboarding
- `POST /api/onboarding/patient` - Patient profile setup
- `POST /api/onboarding/doctor` - Doctor profile setup
- `POST /api/onboarding/caregiver` - Caregiver profile setup
- `POST /api/onboarding/admin` - Admin profile setup

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments` - Get user appointments (to be implemented)

### Payments
- `POST /api/payments/verify` - Verify Razorpay payment

### Doctor Management
- `GET/PUT /api/doctors/[id]/availability` - Manage doctor availability

### Resources
- `GET /api/resources` - Fetch resources (filtered by premium status)

### Tasks
- `GET /api/tasks` - Get patient tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks` - Update task (complete/uncomplete)

## Frontend Structure

### Pages
- `/` - Landing page (redirects authenticated users)
- `/auth/signin` - Role selection and Google OAuth
- `/onboarding` - User-specific onboarding flows
- `/patient/dashboard` - Patient dashboard (to be created)
- `/doctor/dashboard` - Doctor dashboard (to be created)
- `/admin/dashboard` - Admin dashboard (to be created)

### Components
- `components/onboarding/` - Onboarding forms for each user type
- `components/providers/` - Context providers (SessionProvider)

### Middleware
- Route protection based on user roles
- Redirects unauthorized access

## Styling

### Color Palette
- **Primary**: Soft teal (#7dd3c0)
- **Secondary**: Muted purple (#d6bcfa)
- **Tertiary**: Gentle green (#9ae6b4)
- **Background**: Light grays and off-whites
- **Text**: Charcoal-gray for readability

### Design Principles
- Soft, muted colors for calming effect
- High contrast for accessibility
- Rounded corners and soft shadows
- Smooth transitions

## Environment Variables

Required environment variables are documented in `.env.example` (to be created) and `SETUP.md`.

## Integration Points

### Third-Party Services

1. **Razorpay**
   - Payment processing
   - Order creation
   - Webhook verification
   - Payouts (for doctor settlement)

2. **Google OAuth**
   - Authentication
   - User profile data

3. **Twilio** (Future)
   - Video calls
   - Chat messaging
   - SMS/OTP

4. **OpenAI Whisper** (Future)
   - Session transcript generation

5. **DigiLocker API** (Future)
   - Doctor license verification

## Security Considerations

1. **Authentication**
   - NextAuth handles session management
   - Role-based access control
   - Middleware protection

2. **Payments**
   - Razorpay signature verification
   - Secure payment handling
   - No card data stored

3. **Data Privacy**
   - User data in MongoDB
   - Encrypted connections
   - Session security

## Deployment Checklist

- [ ] Set up MongoDB Atlas cluster
- [ ] Configure environment variables
- [ ] Set up Google OAuth credentials
- [ ] Configure Razorpay account
- [ ] Set up domain and SSL
- [ ] Configure NextAuth secret
- [ ] Set up production database
- [ ] Deploy to Vercel/Netlify
- [ ] Configure webhooks (Razorpay)
- [ ] Set up monitoring/logging

## Future Enhancements

1. **Video/Chat Integration**
   - Twilio video rooms
   - Real-time chat
   - Screen sharing
   - Recording functionality

2. **Transcript Generation**
   - OpenAI Whisper integration
   - Automatic transcription
   - Storage and retrieval

3. **DigiLocker Integration**
   - API integration
   - Automatic license verification
   - Document verification

4. **Advanced Features**
   - Email notifications
   - SMS reminders
   - Analytics dashboard
   - Reporting system

