"use client"

import React, { useRef, useEffect, useState } from 'react'

interface ScalableTextProps {
  children: React.ReactNode
  className?: string
  minFontSize?: number
  maxFontSize?: number
  highlight?: boolean
}

export function ScalableText({ 
  children, 
  className = '', 
  minFontSize = 16, 
  maxFontSize = 128,
  highlight = false
}: ScalableTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(maxFontSize)

  useEffect(() => {
    const resizeText = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        let low = minFontSize
        let high = maxFontSize
        let mid
        
        while (low <= high) {
          mid = Math.floor((low + high) / 2)
          textRef.current.style.fontSize = `${mid}px`
          
          if (textRef.current.scrollWidth <= containerWidth) {
            low = mid + 1
          } else {
            high = mid - 1
          }
        }
        
        setFontSize(high)
      }
    }

    resizeText()
    window.addEventListener('resize', resizeText)
    return () => window.removeEventListener('resize', resizeText)
  }, [children, minFontSize, maxFontSize])

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%) translateY(-50%);
          }
          100% {
            transform: translateX(0) translateY(-50%);
          }
        }
      `}</style>
      <div
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          position: 'relative',
          display: 'inline-block',
          zIndex: 1,
        }}
      >
        {children}
        {highlight && (
          <span 
            className="absolute overflow-hidden"
            style={{
              height: '35%',
              top: '45%',
              width: '116%',
              left: '-8%',
              zIndex: -1,
              pointerEvents: 'none',
            }}
          >
            <svg
              className="absolute"
              style={{
                width: '80vw',
                height: '80vw',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                animation: 'slideInFromLeft 1s ease-out forwards',
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polygon
                points="50,0 100,50 50,100 0,50"
                className="fill-accent"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  )
}

