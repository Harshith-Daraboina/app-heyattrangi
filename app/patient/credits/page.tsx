import { Suspense } from "react"
import CareCreditsClient from "@/components/patient/credits/CareCreditsClient"
import CreditsSkeleton from "@/components/patient/credits/CreditsSkeleton"

export default function CareCreditsPage() {
    return (
        <Suspense fallback={<CreditsSkeleton />}>
            <CareCreditsClient />
        </Suspense>
    )
}
