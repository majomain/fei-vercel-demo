"use client"

import { useEffect, useState } from "react"

export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export function useClientOnlyValue<T>(clientValue: T, serverValue: T): T {
  const isClient = useClientOnly()
  return isClient ? clientValue : serverValue
}
