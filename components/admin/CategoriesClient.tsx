'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import ConfirmModal from './ConfirmModal'
import type { BlogCategory } from '@/lib/types'
import slugifyLib from 'slugify'

export default function CategoriesClient({ initialCategories }: { initialCategories: BlogCategory[] }) {
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<BlogCategory | null>(null)
  const supabase = createClient()

  const inputClass = 'px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e84080] focus:border-transparent'

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    const { data, error } = await supabase
      .from('blog_categories')
      .insert({ name: newName.trim(), slug: newSlug || slugifyLib(newName, { lower: true, strict: true }), description: newDesc || null })
      .select()
      .single()
    setSaving(false)
    if (error) { alert(error.message); return }
    setCategories([...categories, data as BlogCategory])
    setNewName(''); setNewDesc(''); setNewSlug(''); setAdding(false)
  }

  function startEdit(cat: BlogCategory) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDesc(cat.description ?? '')
    setEditSlug(cat.slug)
  }

  async function handleEdit(id: string) {
    setSaving(true)
    const { data, error } = await supabase
      .from('blog_categories')
      .update({ name: editName.trim(), slug: editSlug, description: editDesc || null })
      .eq('id', id)
      .select()
      .single()
    setSaving(false)
    if (error) { alert(error.message); return }
    setCategories(categories.map(c => c.id === id ? data as BlogCategory : c))
    setEditingId(null)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('blog_categories').delete().eq('id', deleteTarget.id)
    if (error) { alert(error.message); return }
    setCategories(categories.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          title="Delete Category?"
          message={`"${deleteTarget.name}" will be permanently deleted. Blogs in this category will be uncategorised.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="w-full">
        {/* Add new */}
        <div className="bg-white rounded-2xl border border-[#ffd6e7] p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            {adding ? 'New Category' : 'Categories'}
          </h2>

          {adding ? (
            <div className="w-1/2 mx-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Category name *"
                  value={newName}
                  onChange={e => { setNewName(e.target.value); setNewSlug(slugifyLib(e.target.value, { lower: true, strict: true })) }}
                />
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Slug (auto-generated)"
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value)}
                />
              </div>
              <input
                className={`${inputClass} w-full`}
                placeholder="Description (optional)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={saving || !newName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#e84080] hover:bg-[#c93070] text-white text-sm font-medium rounded-xl disabled:opacity-60 transition-colors"
                >
                  <Check size={14} /> {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setAdding(false); setNewName(''); setNewDesc(''); setNewSlug('') }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#e84080] hover:bg-[#c93070] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus size={15} /> Add Category
            </button>
          )}
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-[#ffd6e7] overflow-hidden">
          {categories.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">No categories yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#fff0f5]">
                <tr className="text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} className="border-t border-gray-100 hover:bg-gray-50">
                    {editingId === cat.id ? (
                      <>
                        <td className="px-5 py-3">
                          <input className={inputClass} value={editName} onChange={e => setEditName(e.target.value)} />
                        </td>
                        <td className="px-5 py-3">
                          <input className={inputClass} value={editSlug} onChange={e => setEditSlug(e.target.value)} />
                        </td>
                        <td className="px-5 py-3">
                          <input className={inputClass} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(cat.id)} disabled={saving} className="p-1.5 rounded-lg bg-[#fff0f5] text-[#e84080] hover:bg-[#ffd6e7] transition-colors">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3 font-medium text-gray-800">{cat.name}</td>
                        <td className="px-5 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                        <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{cat.description ?? '—'}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg hover:bg-[#fff0f5] text-gray-400 hover:text-[#e84080] transition-colors">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleteTarget(cat)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
