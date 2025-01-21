"use client"

import { useState } from "react"

interface CategoryFilterProps {
  tags: string[]
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
}

export function CategoryFilter({ tags, selectedTag, onSelectTag }: CategoryFilterProps) {
  const allTags = ["all", ...tags]

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag === "all" ? null : tag)}
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

