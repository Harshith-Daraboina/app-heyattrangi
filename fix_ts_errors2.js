const fs = require('fs');

function replaceInFile(file, regex, replacement) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content, 'utf8');
  }
}

replaceInFile('app/api/auth/check-onboarding/route.ts', /case "CAREGIVER":[\s\S]*?break/g, '');
replaceInFile('app/auth/callback/route.ts', /case "CAREGIVER":[\s\S]*?break/g, '');
replaceInFile('app/onboarding/page.tsx', /<Button[\s\S]*?"CAREGIVER"[\s\S]*?<\/Button>/g, '');
replaceInFile('app/page.tsx', /case "CAREGIVER":[\s\S]*?redirect\("\/caregiver\/dashboard"\)/g, '');

