import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let db: PrismaClient

try {
  db = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
} catch {
  // Se Prisma falhar, criamos um proxy que retorna null/[]
  db = new Proxy({} as PrismaClient, {
    get() {
      return () => Promise.resolve(null)
    },
  })
}

export { db }
