import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"

export default async function DoctorDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || user.role !== "DOCTOR") {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Attrangi - Doctor Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/doctor/profile"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
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
            Doctor Dashboard 👩‍⚕️
          </h2>
          <p className="text-gray-600">
            Manage your practice, appointments, and patients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Today's Appointments
            </h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Patients
            </h3>
            <p className="text-3xl font-bold text-emerald-600">0</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Earnings This Month
            </h3>
            <p className="text-3xl font-bold text-purple-600">₹0</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-2xl text-white">
                {session.user.name?.charAt(0).toUpperCase() || "👩‍⚕️"}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {session.user.name || "Doctor"}
                </h3>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>
            <Link
              href="/doctor/profile"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              View Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Appointments
            </h3>
            <p className="text-gray-600 mb-6">
              View and manage your upcoming appointments
            </p>
            <Link
              href="/doctor/appointments"
              className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              View Appointments
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Availability Settings
            </h3>
            <p className="text-gray-600 mb-6">
              Set your available days and time slots
            </p>
            <Link
              href="/doctor/availability"
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              Manage Availability
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

