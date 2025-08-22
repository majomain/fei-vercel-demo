"use client"

import { FC } from "react"

interface ArkimLogoProps {
  className?: string
  size?: number
}

export const ArkimLogo: FC<ArkimLogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top horizontal bar with center notch */}
      <rect x="2" y="2" width="20" height="3" fill="currentColor" />
      <rect x="10" y="5" width="4" height="2" fill="currentColor" />
      
      {/* First descending segment - angles right then left */}
      <path
        d="M2 5 L8 5 L10 8 L12 5 L18 5 L20 8 L22 5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Second descending segment - angles right then left */}
      <path
        d="M2 8 L6 8 L8 11 L10 8 L14 8 L16 11 L18 8 L22 8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Third descending segment - angles right then left, tapering to point */}
      <path
        d="M2 11 L4 11 L6 14 L8 11 L10 11 L12 14 L14 11 L16 11 L18 14 L20 11 L22 11"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Bottom tapering point */}
      <path
        d="M8 14 L12 14 L14 17 L16 14 L20 14"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArkimLogo
