'use server'

import { db } from '@/lib/db'

interface LogGuideAccessInput {
  guideId: string
  deviceType?: string
  userAgent?: string
  referrer?: string
}

export async function logGuideAccess(input: LogGuideAccessInput) {
  try {
    await db.guideAccess.create({
      data: {
        guideId: input.guideId,
        deviceType: input.deviceType || null,
        userAgent: input.userAgent || null,
        referrer: input.referrer || null,
      },
    })
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao registrar acesso:', error)
    return { success: false, error: error.message }
  }
}
