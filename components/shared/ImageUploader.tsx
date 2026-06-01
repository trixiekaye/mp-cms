'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X } from 'lucide-react'

interface ImageUploaderProps {
  bucket: string
  value: string | null
  onChange: (url: string | null, path: string | null) => void
  label?: string
  objectFit?: 'cover' | 'contain'
}

export default function ImageUploader({ bucket, value, onChange, label = 'Upload Image', objectFit = 'cover' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl, path)
    setUploading(false)
  }

  function handleRemove() {
    onChange(null, null)
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded" className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`} />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#ffadd2] rounded-xl cursor-pointer hover:bg-[#fff0f5] transition-colors">
          <Upload size={24} className="text-[#e84080] mb-2" />
          <span className="text-sm text-gray-500">{uploading ? 'Uploading…' : label}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
    </div>
  )
}
