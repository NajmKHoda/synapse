"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

import  Button  from "@/components/ui/Button"
import { Input } from "@/components/dashboard/input"
import { Label } from "@/components/dashboard/label"
import { Textarea } from "@/components/dashboard/textarea"

interface AddClassDialogProps {
  onClose: () => void
  onSubmit: (classData: {
    name: string
    description: string
  }) => void
}

export default function AddClassDialog({ onClose, onSubmit }: AddClassDialogProps) {
  const [className, setClassName] = useState("")
  const [description, setDescription] = useState("")

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
      onSubmit({
        name: className,
        description,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-fun w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Class</h2>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to create a new class</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="className" className="text-gray-700">
                Class Name
              </Label>
              <Input
                ref={inputRef}
                id="className"
                placeholder="e.g., Algebra 101"
                className="border-gray-200 focus:border-secondary rounded-lg"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-700">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the class..."
                className="border-gray-200 focus:border-secondary rounded-lg min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-secondary text-white hover:bg-secondary/90 rounded-lg"
              disabled={!className.trim()}
            >
              <Button className="w-full h-full bg-[var(--primary)]">
                Create Class
              </Button>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
