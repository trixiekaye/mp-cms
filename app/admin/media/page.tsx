export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/admin/TopBar'
import MediaGridClient from '@/components/admin/MediaGridClient'
import type { MediaItem } from '@/lib/types'

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('media_items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <TopBar title="Media Library" />
      <main className="flex-1 p-8">
        <MediaGridClient initialItems={(items as MediaItem[]) ?? []} />
      </main>
    </>
  )
}
