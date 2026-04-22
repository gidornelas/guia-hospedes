'use client'

import { useEffect } from 'react'
import { logGuideAccess } from '@/app/actions/log-guide-access'

interface GuideAccessTrackerProps {
  guideId: string
}

export function GuideAccessTracker({ guideId }: GuideAccessTrackerProps) {
  useEffect(() => {
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'

    logGuideAccess({
      guideId,
      deviceType,
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    })
  }, [guideId])

  return null
}
