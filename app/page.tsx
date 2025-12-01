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

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Attrangi
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted mental health and wellness platform connecting patients,
            caregivers, and therapists for comprehensive support and care.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">🧘</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              For Patients
            </h3>
            <p className="text-gray-600">
              Access therapy, resources, and track your wellness journey with
              expert support.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">👩‍⚕️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              For Doctors
            </h3>
            <p className="text-gray-600">
              Manage your practice, connect with patients, and provide quality
              mental health care.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              For Caregivers
            </h3>
            <p className="text-gray-600">
              Support your loved one's mental health journey with comprehensive
              tools and resources.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">
                Secure Video Sessions
              </h4>
              <p className="text-sm text-gray-600">
                Connect with therapists via encrypted video calls
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">
                Resource Library
              </h4>
              <p className="text-sm text-gray-600">
                Access free and premium mental health resources
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">
                Daily Tasks
              </h4>
              <p className="text-sm text-gray-600">
                Track your wellness with daily activities and goals
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">
                Easy Payments
              </h4>
              <p className="text-sm text-gray-600">
                Secure payment processing with automatic settlement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
