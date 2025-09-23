"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectedFile {
  file: File
  importance: number
}

interface FileUploadZoneProps {
  onFilesSelected: (files: SelectedFile[]) => void
}

export function FileUploadZone({ onFilesSelected }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const files = Array.from(e.dataTransfer.files).map(file => ({ file, importance: 3 }))
        setSelectedFiles(files)
        onFilesSelected(files)
      }
    },
    [onFilesSelected],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const files = Array.from(e.target.files).map(file => ({ file, importance: 3 }))
        setSelectedFiles(files)
        onFilesSelected(files)
      }
    },
    [onFilesSelected],
  )

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const handleImportanceChange = (index: number, value: string) => {
    const newFiles = [...selectedFiles]
    newFiles[index].importance = parseInt(value, 10)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Upload className={`h-12 w-12 mb-4 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
            <h3 className="text-lg font-semibold mb-2">{dragActive ? "Drop files here" : "Upload Medical Files"}</h3>
            <p className="text-sm text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</p>
          </div>
        </CardContent>
      </Card>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          {selectedFiles.map(({ file, importance }, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 flex-grow">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">({file.size >= 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`})</span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={importance.toString()} onValueChange={value => handleImportanceChange(index, value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Set Importance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 (Critical)</SelectItem>
                    <SelectItem value="4">4 (High)</SelectItem>
                    <SelectItem value="3">3 (Medium)</SelectItem>
                    <SelectItem value="2">2 (Low)</SelectItem>
                    <SelectItem value="1">1 (Informational)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
