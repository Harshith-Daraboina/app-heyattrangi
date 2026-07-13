const fs = require('fs');

function replaceInFile(file, regex, replacement) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content, 'utf8');
  }
}

// 1. app/patient/layout.tsx, app/patient/appointments/[appointmentId]/payment/page.tsx, app/patient/therapists/[id]/page.tsx
const patientFiles = [
  'app/patient/layout.tsx',
  'app/patient/appointments/[appointmentId]/payment/page.tsx',
  'app/patient/therapists/[id]/page.tsx'
];
patientFiles.forEach(file => {
  replaceInFile(file, / && user\.role !== "CAREGIVER"/g, '');
});

// 2. app/page.tsx
replaceInFile('app/page.tsx', /case "CAREGIVER":\s*return redirect\("\/caregiver\/dashboard"\)/g, '');

// 3. app/onboarding/page.tsx
replaceInFile('app/onboarding/page.tsx', /<Button\s+type="button"[\s\S]*?onClick=\{\(\) => setSelectedRole\("CAREGIVER"\)\}[\s\S]*?<\/Button>/g, '');
replaceInFile('app/onboarding/page.tsx', /\{selectedRole === "CAREGIVER" && <CaregiverOnboarding \/>\}/g, '');
replaceInFile('app/onboarding/page.tsx', /import CaregiverOnboarding from "\@\/components\/onboarding\/CaregiverOnboarding"[\n\r]*/g, '');

// 4. app/patient/dashboard/page.tsx
replaceInFile('app/patient/dashboard/page.tsx', /let dailyTasks: any\[\] = \[\]\n\s*try \{\n\s*dailyTasks = await prisma\.dailyTask\.findMany\([\s\S]*?\}\)[\s\S]*?\} catch \(error\) \{[\s\S]*?\}/g, 'let dailyTasks: any[] = []');
replaceInFile('app/patient/dashboard/page.tsx', /const upcomingTasks = dailyTasks[\s\S]*?const completedTasks = dailyTasks[\s\S]*?\.length/g, 'const upcomingTasks = []\n  const completedTasks = 0');
// Just manually removing the prisma.dailyTask part might be easier, let's just make it a try catch that does nothing
replaceInFile('app/patient/dashboard/page.tsx', /dailyTasks = await prisma\.dailyTask\.findMany\(\{[\s\S]*?\}\)/g, 'dailyTasks = []');

// 5. app/api/profile/transactions/route.ts
replaceInFile('app/api/profile/transactions/route.ts', /const walletBalance = patient\?\.creditWallet\?\.totalCredits \|\| 0/g, 'const walletBalance = 0');
replaceInFile('app/api/profile/transactions/route.ts', /creditWallet: true,/g, '');

// 6. app/auth/callback/route.ts
replaceInFile('app/auth/callback/route.ts', /caregiver: true,/g, '');
replaceInFile('app/auth/callback/route.ts', /case "CAREGIVER":\n\s*isOnboardingComplete = !!user\.caregiver\n\s*break/g, '');
replaceInFile('app/auth/callback/route.ts', /case "CAREGIVER":\n\s*redirectUrl = "\/caregiver\/dashboard"\n\s*break/g, '');
replaceInFile('app/auth/callback/route.ts', /if \(\!isSignup && user\.role === "CAREGIVER" && !user\.caregiver\) \{\n\s*return NextResponse\.redirect\(new URL\("\/onboarding", requestUrl\)\)\n\s*\}/g, '');

// 7. app/api/auth/check-onboarding/route.ts
replaceInFile('app/api/auth/check-onboarding/route.ts', /caregiver: true,/g, '');
replaceInFile('app/api/auth/check-onboarding/route.ts', /case "CAREGIVER":\n\s*isOnboardingComplete = !!user\.caregiver\n\s*break/g, '');

console.log('Replacements done.');
