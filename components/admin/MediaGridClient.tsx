'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import ConfirmModal from './ConfirmModal'
import { Upload, Copy, Trash2, FileIcon } from 'lucide-react'
import type { MediaItem } from '@/lib/types'
import { format } from 'date-fns'

type FilterType = 'all' | 'image' | 'document'

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaGridClient({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initialItems)
  const [filter, setFilter] = useState<FilterType>('all')
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const filtered = filter === 'all' ? items : items.filter(i => i.file_type === filter)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('media').upload(path, file)
      if (error) { alert('Upload failed: ' + error.message); continue }
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      const fileType = file.type.startsWith('image/') ? 'image' : 'document'
      const { data: inserted } = await supabase.from('media_items').insert({
        file_name: file.name,
        file_url: data.publicUrl,
        file_type: fileType,
        file_size: file.size,
        storage_path: path,
      }).select().single()
      if (inserted) setItems(prev => [inserted as MediaItem, ...prev])
    }
    setUploading(false)
    if (fileInput.current) fileInput.current.value = ''
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    if (deleteTarget.storage_path) {
      await supabase.storage.from('media').remove([deleteTarget.storage_path])
    }
    await supabase.from('media_items').delete().eq('id', deleteTarget.id)
    setItems(items.filter(i => i.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          title="Delete Media?"
          message={`"${deleteTarget.file_name}" will be permanently deleted.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['all', 'image', 'document'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? 'bg-[#e84080] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#e84080]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div>
          <input type="file" ref={fileInput} multiple accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e84080] hover:bg-[#c93070] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            <Upload size={16} />
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No media items yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#ffd6e7] overflow-hidden group">
              <div className="relative h-36 bg-[#fff0f5]">
                {item.file_type === 'image' ? (
                  <Image src={item.file_url} alt={item.file_name} fill className="object-cover" loading="lazy" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileIcon size={40} className="text-[#ffadd2]" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-700 truncate">{item.file_name}</p>
                <p className="text-xs text-gray-400">{formatBytes(item.file_size)} · {format(new Date(item.created_at), 'MMM d, yyyy')}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(item.file_url); alert('URL copied!') }}
                    className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-[#fff0f5] text-[#e84080] text-xs hover:bg-[#ffd6e7] transition-colors"
                  >
                    <Copy size={12} /> Copy URL
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
