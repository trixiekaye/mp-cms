import { createClient } from '@/lib/supabase/server'
export default async function AboutMeSection() {
  const supabase = await createClient()
  const { data: config } = await supabase.from('site_config').select('*').eq('id', 1).single()

  const text = config?.about_me_text ?? 'Hi, I\'m MP — a writer, creator, and storyteller. This is my space to share thoughts, ideas, and inspirations with you.'
  const imageUrl = config?.about_me_image_url

  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-r from-[#F5EFE6] to-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-[#EDE0CF]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="About MP" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl font-bold text-[#D9C4A8]" style={{ fontFamily: 'var(--font-playfair)' }}>MP</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#5C4028] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            About Me
          </h2>
          <div
            className="prose prose-lg max-w-none prose-a:text-[#B8916F] prose-strong:text-[#5C4028] text-gray-600"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    </section>
  )
}
