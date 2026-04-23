'use client'

import { useEffect, useRef } from 'react'
import { logGuideAccess } from '@/app/actions/log-guide-access'

interface GuideAccessTrackerProps {
  guideId: string
}

export function GuideAccessTracker({ guideId }: GuideAccessTrackerProps) {
  const hasLogged = useRef(false)

  useEffect(() => {
    if (hasLogged.current) return
    hasLogged.current = true

    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    const userAgentShort = navigator.userAgent.slice(0, 200)

    logGuideAccess({
      guideId,
      deviceType,
      userAgent: userAgentShort,
      referrer: document.referrer || undefined,
    })
  }, [guideId])

  return null
}
