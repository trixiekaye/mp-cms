import { createClient } from '@/lib/supabase/server'
import GalleryClient from './GalleryClient'
import type { MediaItem } from '@/lib/types'

export default async function ImageGallerySection() {
  const supabase = await createClient()
  const { data: images } = await supabase
    .from('media_items')
    .select('*')
    .eq('file_type', 'image')
    .order('created_at', { ascending: false })
    .limit(9)

  if (!images?.length) return null

  return (
    <section id="gallery" className="py-20 px-6 bg-[#fff8fb]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#7a1445] mb-12" style={{ fontFamily: 'var(--font-playfair)' }}>
          Gallery
        </h2>
        <GalleryClient images={images as MediaItem[]} />
      </div>
    </section>
  )
}
