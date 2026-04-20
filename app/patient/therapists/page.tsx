import TherapistList from "@/components/therapists/TherapistList"

export default async function TherapistsPage() {
  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto w-full bg-[var(--color-bg)]">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TherapistList />
      </main>
    </div>
  )
}
