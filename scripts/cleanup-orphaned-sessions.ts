// Script to clean up orphaned sessions
import { prisma } from "@/lib/prisma"

async function cleanupOrphanedSessions() {
  try {
    console.log("Cleaning up orphaned sessions...")
    
    // Get all sessions
    const allSessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        sessionToken: true,
      },
    })

    console.log(`Found ${allSessions.length} sessions`)

    // Check which sessions have valid users
    const orphanedSessions: string[] = []
    
    for (const session of allSessions) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true },
      })

      if (!user) {
        orphanedSessions.push(session.id)
        console.log(`Found orphaned session: ${session.sessionToken}`)
      }
    }

    // Delete orphaned sessions
    if (orphanedSessions.length > 0) {
      await prisma.session.deleteMany({
        where: {
          id: { in: orphanedSessions },
        },
      })
      console.log(`Deleted ${orphanedSessions.length} orphaned sessions`)
    } else {
      console.log("No orphaned sessions found")
    }

    console.log("Cleanup complete!")
  } catch (error) {
    console.error("Error cleaning up sessions:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanupOrphanedSessions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

