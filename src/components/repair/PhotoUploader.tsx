'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, AlertCircle } from 'lucide-react'

interface PhotoUploaderProps {
  repairId: string
  maxFiles?: number
  onUploaded?: (paths: string[]) => void
}

export function PhotoUploader({ repairId, maxFiles = 5, onUploaded }: PhotoUploaderProps) {
  const supabase = createClient()
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ path: string; name: string }>>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (files: File[]) => {
      if (uploadedFiles.length + files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      setIsUploading(true)
      setError(null)
      const uploadedPaths: string[] = []

      try {
        for (const file of files) {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            setError('Only image files are allowed')
            continue
          }

          // Validate file size (10MB max)
          if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB')
            continue
          }

          const timestamp = Date.now()
          const fileName = `${timestamp}-${file.name}`
          const path = `${repairId}/${fileName}`

          const { data, error: uploadError } = await supabase.storage
            .from('repair-photos')
            .upload(path, file, { upsert: false })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            setError(`Failed to upload ${file.name}`)
            continue
          }

          if (data) {
            uploadedPaths.push(data.path)

            // Save reference in DB
            const { error: dbError } = await supabase.from('repair_photos').insert({
              repair_id: repairId,
              storage_path: data.path,
              file_name: file.name,
              is_before: uploadedFiles.length === 0, // First upload is "before"
            })

            if (dbError) {
              console.error('DB error:', dbError)
              setError('Failed to save photo reference')
            }

            setUploadedFiles((prev) => [...prev, { path: data.path, name: file.name }])
          }
        }

        if (uploadedPaths.length > 0 && onUploaded) {
          onUploaded(uploadedPaths)
        }
      } catch (err) {
        console.error('Upload error:', err)
        setError('An error occurred during upload')
      } finally {
        setIsUploading(false)
      }
    },
    [repairId, supabase, uploadedFiles, maxFiles, onUploaded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: isUploading || uploadedFiles.length >= maxFiles,
  })

  const removeFile = (path: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.path !== path))
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {uploadedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-green bg-green-50'
              : 'border-cream-3 hover:border-green hover:bg-cream-50'
          } ${isUploading ? 'opacity-60' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto size-8 text-ink-40 mb-2" />
          <p className="text-ink font-medium">Drag photos here, or click to select</p>
          <p className="text-xs text-ink-60 mt-1">
            {maxFiles - uploadedFiles.length} of {maxFiles} remaining · JPG, PNG, WEBP
          </p>
          {isUploading && <p className="text-xs text-green mt-2">Uploading...</p>}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">Uploaded photos ({uploadedFiles.length})</p>
          <div className="grid grid-cols-2 gap-3">
            {uploadedFiles.map((file) => (
              <div key={file.path} className="relative group">
                <div className="aspect-square bg-cream-2 rounded-lg overflow-hidden border border-cream-3">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="size-5 text-ink-40 mx-auto mb-1" />
                      <p className="text-xs text-ink-60 truncate px-2">{file.name}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.path)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
