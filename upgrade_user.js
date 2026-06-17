const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'daraboinaharshith2005@gmail.com' }
  })
  if (user) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { plan: 'PREMIUM' }
    })
    console.log("Upgraded user:", updated.email, "to plan:", updated.plan)
  }
}
main().finally(() => prisma.$disconnect())
