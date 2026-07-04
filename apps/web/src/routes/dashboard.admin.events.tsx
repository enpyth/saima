import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { MediaUpload } from '../components/media-upload'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/admin/events')({ component: AdminEvents })

function AdminEvents() {
  const [eventId, setEventId] = useState('')
  const [eventCoverUrl, setEventCoverUrl] = useState('')
  const [message, setMessage] = useState('')

  return (
    <div className="dashboard-section narrow">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Events</span>
          <h2>Event media</h2>
          <p className="muted">Upload cover images for existing public events.</p>
        </div>
      </header>
      {message ? <p className="muted">{message}</p> : null}
      <form className="form">
        <div className="field">
          <label htmlFor="eventId">Event ID for cover upload</label>
          <input
            id="eventId"
            value={eventId}
            onChange={(event) => setEventId(event.currentTarget.value)}
            placeholder="Existing event UUID"
          />
        </div>
        <MediaUpload
          label="Event cover image"
          purpose="event-cover"
          onUploaded={async ({ key, publicUrl }) => {
            if (!eventId) {
              setMessage('Enter an event ID before uploading a cover.')
              return
            }
            await api.events.setCover({
              id: eventId,
              coverImageKey: key,
              coverImageUrl: publicUrl,
            })
            setEventCoverUrl(publicUrl)
            setMessage('Event cover updated.')
          }}
        />
      </form>
      {eventCoverUrl ? (
        <img className="media-preview" src={eventCoverUrl} alt="Uploaded event cover" />
      ) : null}
    </div>
  )
}
