'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/shared/ImageUploader'
import RichTextEditor from '@/components/shared/RichTextEditor'
import type { SiteConfig } from '@/lib/types'
import { CheckCircle } from 'lucide-react'

interface AboutFormProps {
  config: SiteConfig | null
}

export default function AboutForm({ config }: AboutFormProps) {
  const supabase = createClient()

  const [aboutText, setAboutText] = useState(config?.about_me_text ?? '')
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(config?.about_me_image_url ?? null)
  const [contactEmail, setContactEmail] = useState(config?.contact_email ?? '')
  const [contactMessage, setContactMessage] = useState(config?.contact_message ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e84080] focus:border-transparent text-sm'

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)

    const { error } = await supabase
      .from('site_config')
      .update({
        about_me_text: aboutText || null,
        about_me_image_url: aboutImageUrl,
        contact_email: contactEmail || null,
        contact_message: contactMessage || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    setSaving(false)
    if (error) { setError(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="w-full space-y-6">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* About Me Section */}
      <div className="bg-white rounded-2xl border border-[#ffd6e7] p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-700 border-b border-[#ffd6e7] pb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          About Me Section
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          <ImageUploader
            bucket="media"
            value={aboutImageUrl}
            onChange={(url) => setAboutImageUrl(url)}
            label="Upload profile image"
            objectFit="contain"
            previewHeight="h-80"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About Me Text</label>
          <RichTextEditor value={aboutText} onChange={setAboutText} minHeight="min-h-[400px]" />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-2xl border border-[#ffd6e7] p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-700 border-b border-[#ffd6e7] pb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          Contact Section
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              className={inputClass}
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              placeholder="hello@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Intro Message</label>
            <input
              className={inputClass}
              value={contactMessage}
              onChange={e => setContactMessage(e.target.value)}
              placeholder="Have a question? I'd love to hear from you."
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#e84080] hover:bg-[#c93070] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle size={15} /> Saved successfully
          </span>
        )}
      </div>
    </div>
  )
}
