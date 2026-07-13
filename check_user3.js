const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: { name: { startsWith: 'DARABOINA', mode: 'insensitive' } }
  })
  console.log("Matched users:", users.map(u => ({ email: u.email, plan: u.plan, name: u.name, id: u.id })))
}
main().finally(() => prisma.$disconnect())
