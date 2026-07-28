'use client'

import { useEffect } from 'react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register(`${basePath}/sw.js`, { scope: `${basePath}/` }).catch(() => {})
  }, [])

  return null
}
