"use client"

import type React from "react"
import { useState, useEffect, useCallback, memo, useRef } from "react"

interface ScrambledTextProps {
  words: string[]
  interval?: number
}

const ScrambledText: React.FC<ScrambledTextProps> = memo(({ words, interval = 5000 }) => {
  const [displayedText, setDisplayedText] = useState(words[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFirstCycle, setIsFirstCycle] = useState(true)
  const containerRef = useRef<HTMLSpanElement>(null)

  // Force layer creation on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateZ(0)'
    }
  }, [])

  // Reduce character set to improve performance
  const scrambleText = useCallback((start: string, end: string, progress: number) => {
    const maxLength = Math.max(start.length, end.length)
    const result = start.split("")
    const endArray = end.split("")
    const totalSteps = Math.floor(maxLength * progress)
    
    // Use a smaller set of characters for scrambling
    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let step = 0; step < totalSteps; step++) {
      const index = Math.floor(Math.random() * maxLength)
      if (index < result.length && index < endArray.length) {
        result[index] = Math.random() < 0.7 
          ? endArray[index] 
          : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      } else if (index >= result.length) {
        result.push(
          endArray[index] || 
          scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        )
      } else {
        result.splice(index, 1)
      }
    }

    return result.join("")
  }, [])

  useEffect(() => {
    let animationFrameId: number
    let startTime: number
    let frameCount = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      frameCount++

      // Increase frame skip rate
      if (frameCount % 4 === 0) {
        const elapsed = timestamp - startTime
        const duration = 1200 // Slower transition
        const progress = Math.min(elapsed / duration, 1)
        
        // Simpler easing function
        const easedProgress = progress

        if (progress < 1) {
          const currentWord = words[currentIndex]
          const nextWord = words[(currentIndex + 1) % words.length]
          const scrambled = scrambleText(currentWord, nextWord, easedProgress)
          setDisplayedText(scrambled)
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setDisplayedText(words[(currentIndex + 1) % words.length])
          setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
          setIsFirstCycle(false)
        }
      } else {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    const startNextWord = () => {
      startTime = 0
      animationFrameId = requestAnimationFrame(animate)
    }

    // Start the animation immediately for the first word change
    if (isFirstCycle) {
      startNextWord()
    }

    const intervalId = setInterval(startNextWord, interval)

    return () => {
      clearInterval(intervalId)
      cancelAnimationFrame(animationFrameId)
    }
  }, [words, interval, currentIndex, scrambleText, isFirstCycle])

  return (
    <span 
      ref={containerRef}
      className="scrambled-text font-mono"
      aria-label={displayedText}
    >
      {displayedText}
    </span>
  )
})

ScrambledText.displayName = "ScrambledText"

export default ScrambledText

