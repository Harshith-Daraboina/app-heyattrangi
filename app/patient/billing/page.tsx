import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import BillingSection from "@/components/profile/BillingSection"

async function BillingContent() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/auth/signin")
    }

    return (
        <div className="flex-1 min-w-0 h-full overflow-y-auto w-full p-8 xl:p-12 bg-[#fafdfc]">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Billing & Credits</h1>
                    <p className="text-gray-500 font-medium tracking-wide">Manage your account credits, subscriptions, and payment history.</p>
                </div>

                <BillingSection user={user} isTestMode={false} />
            </div>
        </div>
    )
}

export default function PatientBillingPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 h-full flex items-center justify-center bg-[#fafdfc] animate-pulse">
                <div className="text-gray-400 font-medium">Loading billing details...</div>
            </div>
        }>
            <BillingContent />
        </Suspense>
    )
}
