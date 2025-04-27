"use client"

import { useState, useRef } from "react"
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X } from "lucide-react"
import Button from "@/components/ui/Button"
import { Progress } from "@/components/ui/progress"
import parseCSV from "@/lib/csv"
import { useParams } from "next/navigation"

interface FileUploadProps {
  onUploadSuccess?: () => void
  onUploadFailure?: () => void
  classId?: string
}

export default function FileUpload({ onUploadSuccess, onUploadFailure, classId }: FileUploadProps) {
  const params = useParams()
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  
  const effectiveClassId = classId || (params?.id as string)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter((file) => file.name.endsWith(".csv"))
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles])
      uploadFiles(newFiles)
    }
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    if (!effectiveClassId) {
      setUploadStatus("error")
      setErrorMessage("Class ID not found")
      if (onUploadFailure) onUploadFailure()
      return
    }

    setUploadStatus("uploading")
    setUploadProgress(0)
    
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        setUploadProgress(Math.round((i / filesToUpload.length) * 90))
        
        const success = await parseCSV(file, effectiveClassId)
        
        if (!success) {
          throw new Error(`Failed to upload file: ${file.name}`)
        }
      }
      
      setUploadProgress(100)
      setUploadStatus("success")
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
      if (onUploadFailure) onUploadFailure()
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (files.length === 1) {
      setUploadStatus("idle")
      setUploadProgress(0)
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <form className="flex flex-col gap-4" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 
          transition-all duration-300 flex flex-col items-center justify-center gap-4
          ${dragActive ? "border-mint bg-mint/10" : "border-gray-200 hover:border-[var(--sunny)] hover:bg-[var(--sunny)]/5"}
          ${uploadStatus === "success" ? "border-mint bg-mint-light" : ""}
          ${uploadStatus === "error" ? "border-red-400 bg-red-50" : ""}
          min-h-[200px]
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple
          onChange={handleChange}
          className="hidden"
        />

        {uploadStatus === "idle" && (
          <>
            <div className="h-16 w-16 rounded-full bg-[var(--sunny)]/20 flex items-center justify-center mb-2">
              <Upload className="h-8 w-8 text-[var(--sunny)]" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Drag & Drop CSV Files Here</h3>
            <p className="text-gray-500 text-center max-w-md">
              Upload your student data in CSV format. Each file should include student names, academic
              strengths, and personality traits.
            </p>
            <Button onClick={onButtonClick} className="mt-2 bg-[var(--sunny)] text-gray-800 hover:bg-[var(--sunny)]/90">
              Select Files
            </Button>
          </>
        )}

        {uploadStatus === "uploading" && (
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center">
                <FileSpreadsheet className="h-8 w-8 text-mint animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-800 text-center mb-2">Uploading...</h3>
            <Progress value={uploadProgress} className="h-2 mb-2" />
            <p className="text-gray-500 text-center text-sm">{uploadProgress}% complete</p>
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-mint" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Upload Complete!</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Your student data has been successfully uploaded. You can now create learning pairs.
            </p>
            <Button
              onClick={() => {
                setUploadStatus("idle")
                setFiles([])
              }}
              className="bg-mint text-white hover:bg-mint/90"
            >
              Upload More Files
            </Button>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Upload Failed</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {errorMessage || "There was an error uploading your files. Please try again."}
            </p>
            <Button
              onClick={() => setUploadStatus("idle")}
              className="bg-[var(--sunny)] text-gray-800 hover:bg-[var(--sunny)]/90"
            >
              Try Again
            </Button>
          </div>
        )}

        {dragActive && (
          <div
            className="absolute inset-0 bg-mint/10 rounded-xl flex items-center justify-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <FileSpreadsheet className="h-12 w-12 text-mint mx-auto mb-2" />
              <p className="text-mint font-medium">Drop your CSV files here</p>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && uploadStatus !== "success" && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Files ({files.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-mint" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(index)} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">Remove file</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  )
}
