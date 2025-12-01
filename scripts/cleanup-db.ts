// Database cleanup script
import { prisma } from "../lib/prisma"

async function cleanupDatabase() {
  try {
    console.log("🧹 Starting database cleanup...\n")

    // 1. Clean up orphaned sessions (sessions with non-existent users)
    console.log("1. Cleaning up orphaned sessions...")
    const allSessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        sessionToken: true,
      },
    })

    console.log(`   Found ${allSessions.length} sessions`)

    let orphanedCount = 0
    for (const session of allSessions) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true },
      })

      if (!user) {
        await prisma.session.delete({
          where: { id: session.id },
        })
        orphanedCount++
      }
    }

    console.log(`   ✅ Deleted ${orphanedCount} orphaned sessions\n`)

    // 2. Clean up orphaned accounts
    console.log("2. Cleaning up orphaned accounts...")
    const allAccounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
      },
    })

    console.log(`   Found ${allAccounts.length} accounts`)

    let orphanedAccountsCount = 0
    for (const account of allAccounts) {
      const user = await prisma.user.findUnique({
        where: { id: account.userId },
        select: { id: true },
      })

      if (!user) {
        await prisma.account.delete({
          where: { id: account.id },
        })
        orphanedAccountsCount++
      }
    }

    console.log(`   ✅ Deleted ${orphanedAccountsCount} orphaned accounts\n`)

    // 3. Clean up expired sessions
    console.log("3. Cleaning up expired sessions...")
    const now = new Date()
    const expiredResult = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: now,
        },
      },
    })
    console.log(`   ✅ Deleted ${expiredResult.count} expired sessions\n`)

    // 4. Get statistics
    const userCount = await prisma.user.count()
    const sessionCount = await prisma.session.count()
    const accountCount = await prisma.account.count()

    console.log("📊 Database Statistics:")
    console.log(`   Users: ${userCount}`)
    console.log(`   Sessions: ${sessionCount}`)
    console.log(`   Accounts: ${accountCount}\n`)

    console.log("✅ Database cleanup complete!")
  } catch (error) {
    console.error("❌ Error during cleanup:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run cleanup
cleanupDatabase()
  .then(() => {
    console.log("\n✨ Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Cleanup failed:", error)
    process.exit(1)
  })

