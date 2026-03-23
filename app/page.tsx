import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  // Redirect authenticated users to their dashboards
  if (session?.user) {
    const role = session.user.role
    switch (role) {
      case "PATIENT":
      case "CAREGIVER":
        redirect("/patient/dashboard")
      case "DOCTOR":
        redirect("/doctor/dashboard")
      case "ADMIN":
        redirect("/admin/dashboard")
      default:
        redirect("/auth/signin")
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* Minimal Top Nav */}
      <nav className="w-full flex justify-between items-center py-6 px-8 max-w-7xl mx-auto">
        <div className="font-extrabold text-2xl tracking-tighter text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] grid place-items-center">
            <span className="text-white text-lg leading-none">A</span>
          </div>
          Attrangi
        </div>
        <div className="flex items-center gap-6 font-bold text-sm">
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Pricing & Billing</Link>
          <div className="flex gap-4">
            <Link href="/auth/signin" className="px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors">Log In</Link>
            <Link href="/auth/signup" className="px-5 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Main Bento Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">

          {/* Card 1: 2-Cols Large Welcome */}
          <div className="lg:col-span-2 bg-[#ece8fc] rounded-[40px] p-10 lg:p-14 relative flex flex-col md:flex-row overflow-hidden min-h-[380px]">
            <div className="relative z-10 w-full md:max-w-[60%] flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Start your journey</p>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.05] font-black text-gray-900 mb-6 tracking-tight">
                Welcome to<br />Attrangi.
              </h1>
              <p className="text-base md:text-lg font-medium text-gray-600 max-w-sm leading-relaxed mb-8">
                Your trusted mental health and wellness platform connecting patients, caregivers, and therapists.
              </p>
              <Link href="/auth/signup" className="w-fit px-8 py-4 rounded-full bg-gray-900 text-white font-bold text-sm shadow-xl hover:-translate-y-1 transition-transform">
                Get Started
              </Link>
            </div>
            {/* Abstract Illustration */}
            <div className="absolute right-0 bottom-0 md:-right-10 md:bottom-0 w-[80%] md:w-[50%] h-[80%] pointer-events-none">
              {/* Desk */}
              <div className="absolute bottom-16 right-10 w-48 h-2 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-0 right-16 w-2 h-16 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-0 right-48 w-2 h-16 bg-gray-400 rounded-full"></div>
              {/* Computer */}
              <div className="absolute bottom-16 right-24 w-16 h-12 bg-gray-300 rounded-md border-4 border-gray-400"></div>
              {/* Doctor Figure left */}
              <div className="absolute bottom-16 right-64 w-16 h-40 bg-[#d1a080] rounded-t-full border-r-[15px] border-[#c08d6d]"></div>
              <div className="absolute bottom-56 right-[266px] w-12 h-12 bg-[#ffe4cc] rounded-full"></div>
              {/* Patient Figure right */}
              <div className="absolute bottom-16 right-40 w-14 h-32 bg-[#9faef0] rounded-t-full z-10 border-l-[10px] border-[#8a98db]"></div>
              <div className="absolute bottom-48 right-[164px] w-10 h-10 bg-[#7c6254] rounded-full z-10"></div>
            </div>
          </div>

          {/* Card 2: 1-Col Tall Companion */}
          <div className="lg:col-span-1 lg:row-span-2 bg-[#fdf8f4] rounded-[40px] p-10 lg:p-12 relative flex flex-col items-center text-center overflow-hidden min-h-[400px]">
            <div className="w-full flex justify-between items-center mb-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Features</span>
              <div className="w-6 h-6 rounded-full bg-[#f4d1b6] grid place-items-center"><span className="text-[8px] font-black">AI</span></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-4">
              24/7 AI<br />Companion
            </h2>
            <p className="text-sm font-medium text-gray-600 mb-10 pb-40">
              Talk things through with our compassionate AI between therapy sessions.
            </p>

            {/* Abstract Couch/Person Illustration */}
            <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none flex justify-center">
              {/* Couch */}
              <div className="absolute bottom-10 w-64 h-24 bg-[#e9a173] rounded-3xl border-b-[15px] border-[#d48c5c]"></div>
              <div className="absolute bottom-8 left-10 w-4 h-6 bg-[#b8764a] rounded-sm"></div>
              <div className="absolute bottom-8 right-10 w-4 h-6 bg-[#b8764a] rounded-sm"></div>
              {/* Pillows */}
              <div className="absolute bottom-10 left-8 w-10 h-20 bg-[#d48c5c] rounded-bl-3xl rounded-tr-xl"></div>
              <div className="absolute bottom-10 right-8 w-10 h-20 bg-[#d48c5c] rounded-br-3xl rounded-tl-xl"></div>
              {/* Person lying down */}
              <div className="absolute bottom-16 left-16 w-32 h-10 bg-[#6374c4] rounded-full z-10"></div>
              <div className="absolute bottom-20 left-44 w-12 h-16 bg-[#ffd8b8] rounded-full z-10"></div>
              <div className="absolute bottom-20 right-20 w-8 h-8 bg-gray-800 rounded-full z-20"></div> {/* Hair */}
            </div>

            {/* Window background */}
            <div className="absolute bottom-32 w-32 h-40 border-4 border-[#e2d5ce] bg-white -z-10 rounded-t-lg">
              <div className="absolute top-1/2 w-full h-1 bg-[#e2d5ce]"></div>
              <div className="absolute left-1/2 w-1 h-full bg-[#e2d5ce]"></div>
            </div>
          </div>

          {/* Card 3: 1-Col Standard Left */}
          <div className="lg:col-span-1 bg-[#fff8e7] rounded-[40px] p-10 relative overflow-hidden flex flex-col justify-center min-h-[320px]">
            <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight mb-6">
              Take our assessments to find out more about you
            </h3>
            <ul className="space-y-4 relative z-10 mt-auto">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#f4b860] mt-1.5 shrink-0"></div>
                <p className="text-[13px] font-bold text-gray-600 leading-snug">Assess your sleep, anxiety, stress & mood.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#f4b860] mt-1.5 shrink-0"></div>
                <p className="text-[13px] font-bold text-gray-600 leading-snug">Get customized resources & care plans.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#f4b860] mt-1.5 shrink-0"></div>
                <p className="text-[13px] font-bold text-gray-600 leading-snug">Track your daily wellness progress securely.</p>
              </li>
            </ul>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#ffeec2] rounded-full blur-2xl opacity-50 pointer-events-none"></div>
          </div>

          {/* Card 4: 1-Col Standard Center */}
          <div className="lg:col-span-1 bg-[#ebd9fb] rounded-[40px] p-10 relative flex flex-col items-center text-center overflow-hidden min-h-[320px]">
            <span className="px-3 py-1 bg-white/40 text-gray-700 text-[9px] font-black uppercase rounded-full tracking-widest mb-4 z-10">Care for you</span>
            <h3 className="text-3xl font-black text-gray-900 mb-2 z-10">Wellbeing</h3>
            <p className="text-sm font-medium text-gray-700 z-10">Feeling stressed or under pressure?</p>

            {/* Abstract shape representing meditation/yoga */}
            <div className="mt-auto pt-16 relative w-full h-[140px] flex justify-center z-10">
              <div className="absolute bottom-0 w-20 h-20 bg-[#d8b4e8] rounded-full"></div>
              <div className="absolute bottom-10 w-8 h-24 bg-[#ff6b8a] rounded-t-full"></div>
              <div className="absolute bottom-28 w-10 h-10 bg-[#ffe1cc] rounded-full z-20"></div>
              {/* Arms raised */}
              <div className="absolute bottom-16 left-[20%] w-20 h-3 bg-[#ff6b8a] rounded-full -rotate-45 origin-right"></div>
              <div className="absolute bottom-16 right-[20%] w-20 h-3 bg-[#ff6b8a] rounded-full rotate-45 origin-left"></div>
              {/* Yoga ball */}
              <div className="absolute bottom-2 -left-4 w-24 h-24 bg-[#f4a261] rounded-full border border-[#e76f51] shadow-inner">
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#e76f51]/40 opacity-50"></div>
              </div>
            </div>
          </div>

          {/* Card 5: 2-Cols Bottom Left */}
          <div className="lg:col-span-2 bg-[#e9ebfb] rounded-[40px] p-10 lg:p-12 relative flex flex-col md:flex-row overflow-hidden min-h-[320px]">
            <div className="relative z-10 w-full md:max-w-[50%] flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Community</span>
              <h2 className="text-3xl md:text-4xl leading-[1.1] font-black text-gray-900 mb-4 tracking-tight">
                For Caregivers &<br />Professionals
              </h2>
              <p className="text-sm font-medium text-gray-600 max-w-sm leading-relaxed mb-6">
                Support your loved ones or manage your medical panel effectively with our integrated tools.
              </p>
            </div>

            {/* Abstract People illustration */}
            <div className="absolute right-0 bottom-0 top-0 w-[50%] pointer-events-none hidden md:block">
              <div className="absolute bottom-0 right-32 w-24 h-48 bg-[#589ac5] rounded-t-[40px] z-10 shadow-lg"></div>
              <div className="absolute bottom-40 right-[152px] w-14 h-14 bg-[#544136] rounded-full z-20"></div>
              <div className="absolute bottom-20 right-20 w-16 h-40 bg-[#c782bd] rounded-t-[30px] shadow-lg"></div>
              <div className="absolute bottom-36 right-[92px] w-12 h-12 bg-[#2d304a] rounded-full z-20"></div>

              {/* Decorative elements */}
              <div className="absolute top-12 right-20 w-32 h-20 bg-white/40 rounded-xl backdrop-blur-sm p-4 rotate-3 border border-white/60">
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2"></div>
                <div className="w-4/5 h-2 bg-gray-200 rounded-full mb-2"></div>
                <div className="w-1/2 h-2 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Card 6: 1-Col Bottom Right */}
          <div className="lg:col-span-1 bg-[#6a805d] rounded-[40px] p-10 relative flex flex-col min-h-[320px] justify-between group overflow-hidden">
            {/* Pattern bg */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "20px 20px" }}></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white leading-[1.05] tracking-tight">
                The right<br />support<br />for you.
              </h2>
            </div>

            <Link href="/auth/signup" className="relative z-10 w-full mt-10 py-5 rounded-full bg-[#d6e3cd] text-[#2c3825] flex justify-center items-center gap-3 group-hover:bg-white transition-colors">
              <span className="font-extrabold text-sm uppercase tracking-widest">Join Now</span>
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Tiny Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-10 mt-10 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-gray-400 gap-4">
        <p>© 2026 Attrangi Health. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}
