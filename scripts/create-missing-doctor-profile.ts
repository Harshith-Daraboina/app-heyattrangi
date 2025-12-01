import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function createMissingDoctorProfiles() {
  console.log('🔍 Finding users with DOCTOR role but no doctor profile...')

  try {
    // Find all users with DOCTOR role
    const doctorUsers = await prisma.user.findMany({
      where: {
        role: 'DOCTOR',
      },
      include: {
        doctor: true,
      },
    })

    console.log(`Found ${doctorUsers.length} users with DOCTOR role`)

    // Find users without doctor profiles
    const usersWithoutProfile = doctorUsers.filter(user => !user.doctor)

    if (usersWithoutProfile.length === 0) {
      console.log('✅ All DOCTOR users have profiles!')
      return
    }

    console.log(`\n📝 Creating doctor profiles for ${usersWithoutProfile.length} user(s)...`)

    for (const user of usersWithoutProfile) {
      try {
        const doctor = await prisma.doctor.create({
          data: {
            userId: user.id,
            fullName: user.name || 'Doctor',
            status: 'PENDING',
            consultationFee: 0,
          },
        })

        console.log(`✅ Created doctor profile for user: ${user.email} (ID: ${doctor.id})`)
      } catch (error: any) {
        console.error(`❌ Error creating doctor profile for ${user.email}:`, error.message)
      }
    }

    console.log('\n✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createMissingDoctorProfiles()

