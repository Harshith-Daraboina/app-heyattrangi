import { prisma } from "@/lib/prisma" // Standard prisma import
import { PrismaClient } from "@prisma/client"
import { format } from "date-fns" // Assuming date-fns is installed, if not I'll use native Date

type AssessmentProps = {
    assessment: {
        riskLevel: string | null
        summaryReport: string | null
        createdAt: Date
        affectedDomains: string[]
    }
}

export default function WellnessSummaryCard({ assessment }: AssessmentProps) {
    if (!assessment) return null

    const riskColor = {
        "Low": "bg-emerald-100 text-emerald-800 border-emerald-200",
        "Mild": "bg-blue-100 text-blue-800 border-blue-200",
        "Moderate": "bg-amber-100 text-amber-800 border-amber-200",
        "High": "bg-red-100 text-red-800 border-red-200",
    }[assessment.riskLevel || "Low"] || "bg-gray-100 text-gray-800"

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Mental Wellness Snapshot</h2>
                    <p className="text-sm text-gray-500">
                        Last checked: {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${riskColor}`}>
                    Risk Level: {assessment.riskLevel}
                </div>
            </div>

            <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {/* Simple markdown rendering or just text display. 
             Since summaryReport has markdown, we ideally use a renderer.
             For now, I'll just render it as whitespace-pre-wrap to preserve basic structure 
             or very simple parsing if needed. 
          */}
                <div className="whitespace-pre-wrap font-sans">
                    {assessment.summaryReport?.replace(/#/g, '').replace(/\*\*/g, '')}
                    {/* Stripping md chars for simple text display if no renderer available */}
                </div>
            </div>

            {assessment.affectedDomains.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Focus Areas:</p>
                    <div className="flex flex-wrap gap-2">
                        {assessment.affectedDomains.map(domain => (
                            <span key={domain} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm">
                                {domain}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
