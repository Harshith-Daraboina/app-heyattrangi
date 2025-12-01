import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"

export default async function PatientDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Attrangi</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/patient/profile"
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
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
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">
            Manage your appointments, tasks, and wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upcoming Appointments
            </h3>
            <p className="text-3xl font-bold text-teal-600">0</p>
            <p className="text-sm text-gray-600 mt-1">No appointments yet</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tasks Completed
            </h3>
            <p className="text-3xl font-bold text-emerald-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Keep going! 💪</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Resources Accessed
            </h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Explore resources</p>
          </div>
        </div>

        {/* Main Actions */}
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-2xl text-white">
                {session.user.name?.charAt(0).toUpperCase() || "👤"}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {session.user.name || "User"}
                </h3>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>
            <Link
              href="/patient/profile"
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all"
            >
              View Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Find Therapist */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">👩‍⚕️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Find a Therapist
            </h3>
            <p className="text-gray-600 mb-6">
              Browse qualified therapists and book an appointment
            </p>
            <Link
              href="/patient/therapists"
              className="inline-block bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all"
            >
              Browse Therapists
            </Link>
          </div>

          {/* Daily Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Daily Tasks
            </h3>
            <p className="text-gray-600 mb-6">
              Complete daily wellness activities to track your progress
            </p>
            <Link
              href="/patient/tasks"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              View Tasks
            </Link>
          </div>

          {/* Resource Library */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Resource Library
            </h3>
            <p className="text-gray-600 mb-6">
              Access free and premium mental health resources
            </p>
            <Link
              href="/patient/resources"
              className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Browse Resources
            </Link>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              My Appointments
            </h3>
            <p className="text-gray-600 mb-6">
              View and manage your upcoming and past appointments
            </p>
            <Link
              href="/patient/appointments"
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              View Appointments
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

