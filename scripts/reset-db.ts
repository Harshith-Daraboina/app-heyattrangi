// Complete database reset script - USE WITH CAUTION!
// This will DELETE ALL DATA from the database
import { prisma } from "../lib/prisma"

async function resetDatabase() {
  try {
    console.log("⚠️  WARNING: This will DELETE ALL DATA from the database!")
    console.log("Starting database reset...\n")

    // Delete all data in reverse dependency order
    console.log("Deleting all data...")

    // Delete in order to respect foreign key constraints
    await prisma.sessionRecording.deleteMany({})
    console.log("  ✅ Deleted all session recordings")

    await prisma.payment.deleteMany({})
    console.log("  ✅ Deleted all payments")

    await prisma.appointment.deleteMany({})
    console.log("  ✅ Deleted all appointments")

    await prisma.timeSlot.deleteMany({})
    console.log("  ✅ Deleted all time slots")

    await prisma.doctorAvailability.deleteMany({})
    console.log("  ✅ Deleted all doctor availability")



    await prisma.doctor.deleteMany({})
    console.log("  ✅ Deleted all doctors")

    await prisma.patient.deleteMany({})
    console.log("  ✅ Deleted all patients")

    await prisma.admin.deleteMany({})
    console.log("  ✅ Deleted all admins")

    await prisma.session.deleteMany({})
    console.log("  ✅ Deleted all sessions")

    await prisma.account.deleteMany({})
    console.log("  ✅ Deleted all accounts")

    await prisma.verificationToken.deleteMany({})
    console.log("  ✅ Deleted all verification tokens")

    await prisma.user.deleteMany({})
    console.log("  ✅ Deleted all users\n")

    console.log("✨ Database reset complete!")
    console.log("📝 Run 'npx prisma db push' to sync schema")
  } catch (error) {
    console.error("❌ Error during reset:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run reset
resetDatabase()
  .then(() => {
    console.log("\n✅ Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Reset failed:", error)
    process.exit(1)
  })

