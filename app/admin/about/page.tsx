export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/admin/TopBar'
import AboutForm from '@/components/admin/AboutForm'
import type { SiteConfig } from '@/lib/types'

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .eq('id', 1)
    .single()

  return (
    <>
      <TopBar title="About Me" />
      <main className="flex-1 p-8 min-w-0">
        <AboutForm config={config as SiteConfig} />
      </main>
    </>
  )
}
