const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: { name: { contains: 'daraboina', mode: 'insensitive' } }
  })
  if (users.length === 0) {
    const all = await prisma.user.findMany()
    console.log("All users:", all.map(u => ({ email: u.email, plan: u.plan, name: u.name })))
  } else {
    console.log("Matched users:", users.map(u => ({ email: u.email, plan: u.plan, name: u.name })))
  }
}
main().finally(() => prisma.$disconnect())
