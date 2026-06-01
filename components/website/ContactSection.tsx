import { createClient } from '@/lib/supabase/server'

export default async function ContactSection() {
  const supabase = await createClient()
  const { data: config } = await supabase.from('site_config').select('contact_email').eq('id', 1).single()
  const contactEmail = config?.contact_email ?? 'hello@example.com'

  return (
    <section id="contact" className="py-20 px-6 bg-gradient-to-br from-[#e84080] to-[#c93070]">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Get in Touch
        </h2>
        <p className="text-white/80 mb-10">Have a question, collaboration idea, or just want to say hello? I&apos;d love to hear from you.</p>
        <ContactForm contactEmail={contactEmail} />
      </div>
    </section>
  )
}

function ContactForm({ contactEmail }: { contactEmail: string }) {
  return (
    <form
      action={`mailto:${contactEmail}`}
      method="get"
      encType="text/plain"
      className="space-y-4 text-left"
    >
      <input
        name="subject"
        type="text"
        placeholder="Your Name"
        required
        className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
      />
      <textarea
        name="body"
        rows={4}
        placeholder="Your message…"
        required
        className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
      />
      <button
        type="submit"
        className="w-full py-3 bg-white text-[#e84080] font-semibold rounded-xl hover:bg-[#fff0f5] transition-colors"
      >
        Send Message
      </button>
    </form>
  )
}
