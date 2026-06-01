'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Link2, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'


const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS' },
  { label: 'Impact', value: 'Impact' },
]

const FONT_SIZES = ['10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '64']

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  minHeight?: string
}

export default function RichTextEditor({ value, onChange, minHeight = 'min-h-[300px]' }: RichTextEditorProps) {
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your blog content here…' }),
      TextStyle,
      FontFamily,
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: `prose max-w-none ${minHeight} focus:outline-none px-4 py-3`,
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  async function insertImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('content-images').upload(path, file)
      if (error) { alert('Upload failed: ' + error.message); return }
      const { data } = supabase.storage.from('content-images').getPublicUrl(path)
      editor?.chain().focus().setImage({ src: data.publicUrl }).run()
    }
    input.click()
  }

  function setLink() {
    const url = window.prompt('Enter URL')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  if (!editor) return null

  const btnClass = (active: boolean) =>
    `p-1.5 rounded hover:bg-[#ffd6e7] transition-colors ${active ? 'bg-[#ffd6e7] text-[#e84080]' : 'text-gray-600'}`

  // Get current font family
  const currentFont = editor.getAttributes('textStyle').fontFamily ?? ''
  const currentSize = editor.getAttributes('textStyle').fontSize ?? ''

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
        {/* Font Family */}
        <select
          value={currentFont}
          onChange={e => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run()
            } else {
              editor.chain().focus().unsetFontFamily().run()
            }
          }}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#e84080] bg-white text-gray-700 max-w-[130px]"
          style={{ fontFamily: currentFont || 'inherit' }}
        >
          {FONT_FAMILIES.map(f => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value || 'inherit' }}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <select
          value={currentSize}
          onChange={e => {
            const chain = editor.chain().focus() as ReturnType<typeof editor.chain> & {
              setFontSize: (s: string) => ReturnType<typeof editor.chain>
              unsetFontSize: () => ReturnType<typeof editor.chain>
            }
            if (e.target.value) {
              chain.setFontSize(e.target.value + 'px').run()
            } else {
              chain.unsetFontSize().run()
            }
          }}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#e84080] bg-white text-gray-700 w-16"
        >
          <option value="">Size</option>
          {FONT_SIZES.map(s => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
          <Bold size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
          <Italic size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>
          <Heading1 size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
          <Heading2 size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
          <List size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
          <ListOrdered size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>
          <Quote size={15} />
        </button>
        <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))}>
          <Link2 size={15} />
        </button>
        <button type="button" onClick={insertImage} className={btnClass(false)}>
          <ImageIcon size={15} />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
