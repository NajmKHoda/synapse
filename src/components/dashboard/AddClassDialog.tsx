"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface AddClassDialogProps {
  onClose: () => void
  onSubmit: (className: string) => void
}

export default function AddClassDialog({ onClose, onSubmit }: AddClassDialogProps) {
  const [className, setClassName] = useState("")
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input when dialog opens
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Close dialog when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (className.trim()) {
      onSubmit(className)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Add New Class</h2>
          <p className="text-gray-600 text-sm mt-1">Enter the name of the new class you want to create.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              ref={inputRef}
              id="className"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Physics 101"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!className.trim()}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
