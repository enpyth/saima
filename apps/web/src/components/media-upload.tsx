import { ImageUp } from 'lucide-react'
import { useState } from 'react'

import { api } from '../lib/orpc'
import { Button } from './ui/button'

const maxImageSize = 5 * 1024 * 1024
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export function MediaUpload({
  label,
  purpose,
  onUploaded,
}: {
  label: string
  purpose: 'profile-avatar' | 'profile-cover' | 'event-cover'
  onUploaded: (result: { key: string; publicUrl: string }) => Promise<void> | void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  async function upload() {
    if (!file) {
      setMessage('Choose an image first.')
      return
    }

    if (!allowedTypes.has(file.type)) {
      setMessage('Use a JPG, PNG, WebP, or GIF image.')
      return
    }

    if (file.size > maxImageSize) {
      setMessage('Image must be 5 MB or smaller.')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const { key, uploadUrl, publicUrl } = await api.media.createUploadUrl({
        purpose,
        fileName: file.name,
        contentType: file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
        size: file.size,
      })

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'content-type': file.type,
        },
        body: file,
      })

      if (!response.ok) {
        throw new Error('Upload to R2 failed.')
      }

      await onUploaded({ key, publicUrl })
      setMessage('Image uploaded.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="form">
      <div className="field">
        <label htmlFor={`${purpose}-file`}>{label}</label>
        <input
          id={`${purpose}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => setFile(event.currentTarget.files?.[0] ?? null)}
        />
      </div>
      <Button type="button" onClick={upload} disabled={uploading}>
        <ImageUp size={18} aria-hidden="true" />
        {uploading ? 'Uploading' : 'Upload image'}
      </Button>
      {message ? <p className="muted">{message}</p> : null}
    </div>
  )
}
