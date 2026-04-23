import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let db: PrismaClient

try {
  db = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
} catch (error) {
  console.error('[PRISMA INIT ERROR]', error)
  throw new Error(
    'Failed to initialize Prisma Client. Check your DATABASE_URL and database connectivity.'
  )
}

export { db }
