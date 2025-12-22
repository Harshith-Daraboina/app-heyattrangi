import Sidebar from "@/components/patient/Sidebar"
import WellnessScreeningForm from "@/components/ai-bot/WellnessScreeningForm"
import { auth } from "@/auth.config"
import { redirect } from "next/navigation"

export default async function AIBotPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/signin")
    }

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900">
            <div className="grid min-h-screen lg:grid-cols-[82px_1fr]">
                <Sidebar />

                <div className="flex flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
                        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 gap-4">
                            <div>
                                <h1 className="text-xl font-semibold text-slate-900">Attrangi Bot</h1>
                                <p className="text-sm text-slate-500">Wellness Screening & Support</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                                AI
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                                <div className="mb-8 p-4 bg-teal-50 rounded-xl border border-teal-100 text-teal-800 text-sm">
                                    <p className="font-semibold mb-1">Disclaimer</p>
                                    <p>This tool is for mental wellness screening and self-reflection only. It does not provide medical or psychological diagnoses. If you are in crisis, please seek professional help immediately.</p>
                                </div>

                                <WellnessScreeningForm />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
