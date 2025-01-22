"use client"

import { useState } from "react"

interface CategoryFilterProps {
  tags: string[]
  onSelectTag: (tag: string | null) => void
}

export function CategoryFilter({ tags, onSelectTag }: CategoryFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const allTags = ["all", ...tags]

  const handleSelectTag = (tag: string) => {
    const newTag = tag === "all" ? null : tag
    setSelectedTag(newTag)
    onSelectTag(newTag)
  }

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleSelectTag(tag)}
          className={`
            relative whitespace-nowrap px-3 py-1 rounded-full text-base transition-colors font-mono
            group
          `}
        >
          <span className="relative z-10">{tag}</span>
          <span
            className={`
              absolute left-[5%] bottom-0 w-[90%] top-[47%] h-[16%] bg-accent
              transform origin-left scale-x-0 transition-transform duration-300 ease-out
              ${selectedTag === (tag === "all" ? null : tag) ? "scale-x-100" : "group-hover:scale-x-100"}
            `}
          />
        </button>
      ))}
    </div>
  )
}

