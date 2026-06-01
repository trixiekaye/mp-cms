'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { MediaItem } from '@/lib/types'

export default function GalleryClient({ images }: { images: MediaItem[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const slides = images.map(img => ({ src: img.file_url }))

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => { setIndex(i); setOpen(true) }}
            className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.file_url} alt={img.file_name} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
      />
    </>
  )
}
