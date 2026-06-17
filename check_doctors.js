const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const docs = await prisma.doctor.findMany()
  console.log("Doctors:", docs.map(d => ({ email: d.emailAddress, duration: d.appointmentDuration })))
}
main().finally(() => prisma.$disconnect())
