"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

interface ScrambledTextProps {
  words: string[]
  interval?: number
}

const ScrambledText: React.FC<ScrambledTextProps> = ({ words, interval = 5000 }) => {
  const [displayedText, setDisplayedText] = useState(words[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFirstCycle, setIsFirstCycle] = useState(true)

  const scrambleText = useCallback((start: string, end: string, progress: number) => {
    const maxLength = Math.max(start.length, end.length)
    const result = start.split("")
    const endArray = end.split("")
    const totalSteps = Math.floor(maxLength * progress)

    for (let step = 0; step < totalSteps; step++) {
      let index: number

      if (result.length > endArray.length) {
        // Remove a character
        index = Math.floor(Math.random() * result.length)
        result.splice(index, 1)
      } else if (result.length < endArray.length) {
        // Add a character
        index = Math.floor(Math.random() * (result.length + 1))
        const newChar = endArray[index] || endArray[endArray.length - 1]
        result.splice(index, 0, newChar)
      } else {
        // Replace a character
        index = Math.floor(Math.random() * result.length)
        result[index] = endArray[index]
      }

      // Randomly scramble some other characters
      if (Math.random() < 0.3) {
        const scrambleIndex = Math.floor(Math.random() * result.length)
        result[scrambleIndex] = String.fromCharCode(33 + Math.floor(Math.random() * 94))
      }
    }

    return result.join("")
  }, [])

  useEffect(() => {
    let animationFrameId: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const duration = 800 // Scrambling effect duration: 0.8 seconds
      const progress = Math.min(elapsed / duration, 1)

      // Apply easing function for smoother progress
      const easedProgress = 1 - Math.pow(1 - progress, 3)

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
    }

    const startNextWord = () => {
      if (isFirstCycle) {
        setIsFirstCycle(false)
        setCurrentIndex(1)
        setDisplayedText(words[1])
      } else {
        startTime = 0
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    const intervalId = setInterval(startNextWord, interval)

    return () => {
      clearInterval(intervalId)
      cancelAnimationFrame(animationFrameId)
    }
  }, [words, interval, currentIndex, scrambleText, isFirstCycle])

  return <span className="font-mono">{displayedText}</span>
}

export default ScrambledText

