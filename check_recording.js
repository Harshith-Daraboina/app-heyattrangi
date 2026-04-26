const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const latest = await prisma.sessionRecording.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  console.log(JSON.stringify(latest, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
