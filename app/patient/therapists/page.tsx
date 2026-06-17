import TherapistList from "@/components/therapists/TherapistList"

export default async function TherapistsPage() {
  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto w-full bg-[#FAF8F5]">
      <main className="w-full">
        <TherapistList />
      </main>
    </div>
  )
}
