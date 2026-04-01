"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";

export function Step2PhotoUpload({ onNext }: { onNext: (photoUrls: string[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const supabase = createClient();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);

    // Create previews
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 5,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      onNext([]);
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const filePath = `repair-photos/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("repair-photos")
          .upload(filePath, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("repair-photos").getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      onNext(uploadedUrls);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition ${
          isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">Drag photos here or click to select</p>
        <p className="text-sm text-gray-500">Max 5 images, PNG/JPG/GIF</p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, i) => (
            <div key={i} className="relative">
              <img src={preview} alt="preview" className="h-32 w-full rounded-lg object-cover" />
              <button
                onClick={() => removeFile(i)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Next: Location"}
        </button>
      </div>
    </div>
  );
}
