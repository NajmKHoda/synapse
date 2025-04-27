"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, AlertTriangle } from "lucide-react"
import Button from "@/components/ui/Button"

interface DeleteClassDialogProps {
  className: string
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteClassDialog({ className, onClose, onConfirm }: DeleteClassDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-fun w-full max-w-[450px] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Delete Class</h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete <span className="font-semibold">"{className}"</span>?
          </p>
          <p className="text-gray-500 text-sm mb-4">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
          
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 text-gray-700"
            >
              Cancel
            </button>
            <Button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Delete Class
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
