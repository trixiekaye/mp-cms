import { createClient } from '@/lib/supabase/server'

export default async function ContactSection() {
  const supabase = await createClient()
  const { data: config } = await supabase.from('site_config').select('contact_email, contact_message').eq('id', 1).single()
  const contactEmail = config?.contact_email ?? 'hello@example.com'
  const contactMessage = config?.contact_message ?? "Have a question, collaboration idea, or just want to say hello? I'd love to hear from you."

  return (
    <section id="contact" className="py-20 px-6 bg-gradient-to-br from-[#B8916F] to-[#9E7758]">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Get in Touch
        </h2>
        <p className="text-white/80 mb-10">{contactMessage}</p>
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
        className="w-full py-3 bg-white text-[#B8916F] font-semibold rounded-xl hover:bg-[#F5EFE6] transition-colors"
      >
        Send Message
      </button>
    </form>
  )
}
