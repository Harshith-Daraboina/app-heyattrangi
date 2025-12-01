# Doctor Onboarding Complete Specification

## ✅ Completed
1. Updated Prisma schema with all required fields (6 sections)
2. Started comprehensive DoctorOnboarding component (Step 1 complete)

## 📋 Remaining Work

### Step 2: Professional Verification Section
- Medical License Number / Registration Number
- Issuing Council (MCI/NMC, State Medical Council)
- Upload Medical License Document (PDF/JPEG)
- DigiLocker Auth (optional, placeholder for now)
- Years of Experience
- Primary Specialization
- Secondary Specializations (multi-select)
- Highest Qualification
- Upload Degree Certificates (multiple files)
- Professional Bio (150-500 words)

### Step 3: Practice Details Section
- Languages Spoken (multi-select)
- Preferred Patient Age Groups (multi-select: Kids, Teens, Adults, Seniors)
- Consultation Types (multi-select: Video, Chat, Voice, In-person)
- NOT Accepting Cases For (multi-select)

### Step 4: Availability & Scheduling Section
- Working Days (checkbox list: Mon-Sun)
- Daily Availability Time Range (Start time, End time)
- Breaks (optional: Lunch break, Custom gaps)
- Appointment Duration (30, 45, 60 minutes)
- "Stop Appointments for Today" Toggle (will be in dashboard later)

### Step 5: Payment Details Section
- Consultation Fee per Session (in ₹)
- Payout Mode (UPI or Bank)
- If UPI: UPI ID
- If Bank: Account Holder Name, Account Number, IFSC Code, Bank Name
- UPI ID (recommended for instant payouts)

### Step 6: Compliance & Legal Section
- Telemedicine Consent Acknowledgement (checkbox)
- Privacy Agreement (checkbox)
- Data Sharing Policy (checkbox)
- Platform Terms & Conditions (checkbox)
- Declaration: "Information Provided is True" (checkbox)
- Digital Signature (type full name)

## 🔄 Next Steps
1. Complete remaining 5 steps in DoctorOnboarding.tsx
2. Update API route to handle all new fields and file uploads
3. Create file upload handling for documents
4. Add OTP verification API endpoints
5. Test complete flow

## 📝 Notes
- File uploads need to be handled (profile photo, license document, degree certificates)
- OTP verification needs API endpoints
- DigiLocker integration is placeholder for now
- All compliance checkboxes must be checked to submit

