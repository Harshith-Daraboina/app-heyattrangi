import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/auth/unauthorized")
  }

  // Fetch doctor statistics
  const doctors = await prisma.doctor.findMany({
    select: {
      status: true,
    },
  })

  const pendingCount = doctors.filter(d => d.status === "PENDING").length
  const totalDoctors = doctors.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Attrangi - Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/profile"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Profile
              </Link>
              <span className="text-sm text-gray-600">
                {session.user.name || session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Admin Dashboard ⚙️
          </h2>
          <p className="text-gray-600">
            Manage platform operations and approvals
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-slate-400 flex items-center justify-center text-2xl text-white">
                {session.user.name?.charAt(0).toUpperCase() || "⚙️"}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {session.user.name || "Admin"}
                </h3>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>
            <Link
              href="/admin/profile"
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-lg font-medium hover:from-gray-600 hover:to-slate-600 transition-all"
            >
              View Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/doctors" className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pending Doctor Approvals
            </h3>
            <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
            <p className="text-sm text-gray-500 mt-2">Click to review →</p>
          </Link>

          <Link href="/admin/doctors" className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Doctors
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalDoctors}</p>
            <p className="text-sm text-gray-500 mt-2">Click to view all →</p>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Platform Revenue
            </h3>
            <p className="text-3xl font-bold text-green-600">₹0</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/doctors"
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="text-3xl mb-2">👩‍⚕️</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                Manage Doctors
              </h4>
              <p className="text-sm text-gray-600">
                View all doctors, verify documents, and approve/reject registrations
              </p>
            </Link>
            <div className="p-6 border-2 border-gray-200 rounded-lg opacity-50">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                Platform Analytics
              </h4>
              <p className="text-sm text-gray-600">
                Coming soon: View platform statistics and insights
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

