import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"

export default async function OrganizationsAdminPage() {
  const session = await auth()
  const user = await getCurrentUser()

  if (!session?.user || user?.role !== "ADMIN") {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="min-h-screen bg-[#fafcfd] text-gray-800 font-sans relative overflow-hidden flex flex-col">
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-100/40 blur-[100px] rounded-full pointer-events-none" />
      
      <nav className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-20 gap-4">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <h1 className="text-xl font-black tracking-tight text-gray-900">Institutions & B2B</h1>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center relative z-10 p-6">
        <div className="text-center max-w-md bg-white p-10 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Enterprise Management</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            This module is currently under construction. Soon, you will be able to manage school tie-ups, institutional access codes, and B2B subscriptions here.
          </p>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
            Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
