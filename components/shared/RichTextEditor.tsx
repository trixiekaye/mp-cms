'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import BaseImage from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Link2, ImageIcon, Maximize2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

// Extend Image to support a width attribute for resizing
const Image = BaseImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (el) =>
          el.style.width || el.getAttribute('width') || '100%',
        renderHTML: (attrs) => ({
          style: `width: ${attrs.width || '100%'}; height: auto; display: block; border-radius: 8px;`,
        }),
      },
    }
  },
})

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

const IMAGE_SIZES = [
  { label: 'XS', value: '25%' },
  { label: 'S',  value: '40%' },
  { label: 'M',  value: '60%' },
  { label: 'L',  value: '80%' },
  { label: 'Full', value: '100%' },
]

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

  function setImageWidth(width: string) {
    editor?.chain().focus().updateAttributes('image', { width }).run()
  }

  if (!editor) return null

  const btnClass = (active: boolean) =>
    `p-1.5 rounded hover:bg-[#EDE0CF] transition-colors ${active ? 'bg-[#EDE0CF] text-[#B8916F]' : 'text-gray-600'}`

  const currentFont = editor.getAttributes('textStyle').fontFamily ?? ''
  const currentSize = editor.getAttributes('textStyle').fontSize ?? ''
  const imageSelected = editor.isActive('image')
  const currentImgWidth = imageSelected ? (editor.getAttributes('image').width ?? '100%') : null

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
          className="text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#B8916F] bg-white text-gray-700 max-w-[130px]"
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
          className="text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#B8916F] bg-white text-gray-700 w-16"
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

        {/* Image resize controls — only visible when an image is selected */}
        {imageSelected && (
          <>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <Maximize2 size={13} className="text-[#B8916F]" />
            <span className="text-xs text-gray-400 mr-0.5">Size:</span>
            {IMAGE_SIZES.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setImageWidth(value)}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  currentImgWidth === value
                    ? 'bg-[#B8916F] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#B8916F] hover:text-[#B8916F]'
                }`}
              >
                {label}
              </button>
            ))}
          </>
        )}
      </div>

      <EditorContent editor={editor} />

      {/* Hint shown when image is selected */}
      {imageSelected && (
        <div className="px-4 py-2 bg-[#F5EFE6] border-t border-[#EDE0CF] text-xs text-[#9E7758]">
          Image selected — use the size buttons above to resize: XS (25%) · S (40%) · M (60%) · L (80%) · Full (100%)
        </div>
      )}
    </div>
  )
}
