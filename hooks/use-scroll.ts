"use client"

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export function useScroll() {
  const pathname = usePathname()

  // Scroll to top when route changes
  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }, [])

  // Scroll to element by ID
  const scrollToElement = useCallback((elementId: string, offset = 0) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(elementId)
      if (element) {
        const elementPosition = element.offsetTop - offset
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    }
  }, [])

  // Check if element is in viewport
  const isElementInViewport = useCallback((element: HTMLElement) => {
    if (typeof window !== 'undefined') {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }
    return false
  }, [])

  // Auto-scroll to top on route change
  useEffect(() => {
    scrollToTop()
  }, [pathname, scrollToTop])

  return {
    scrollToTop,
    scrollToElement,
    isElementInViewport
  }
}
