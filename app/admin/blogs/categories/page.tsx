export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/admin/TopBar'
import CategoriesClient from '@/components/admin/CategoriesClient'
import type { BlogCategory } from '@/lib/types'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  return (
    <>
      <TopBar title="Blog Categories" />
      <main className="flex-1 p-8 min-w-0">
        <CategoriesClient initialCategories={(categories as BlogCategory[]) ?? []} />
      </main>
    </>
  )
}
