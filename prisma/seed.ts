import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seed() {
  console.log(`This is actually a no-op!`)
  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
