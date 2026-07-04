import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { MediaUpload } from '../components/media-upload'
import { RoleGate } from '../components/role-gate'
import { useAuth } from '../components/auth-provider'
import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/member')({ component: MemberDashboard })

function MemberDashboard() {
  const { profile, refreshProfile } = useAuth()
  const [title, setTitle] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')

  async function publishSlot() {
    try {
      await api.availabilitySlots.create({
        title,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt || startsAt).toISOString(),
        location,
        capacity: 1,
      })
      setMessage('Availability slot published.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not publish availability.')
    }
  }

  return (
    <RoleGate allowed={['member']}>
      <main className="workspace">
        <aside className="sidebar">
          <span className="eyebrow">Member</span>
          <p className="muted">Publish teaching availability and manage member profile.</p>
        </aside>
        <section className="main-panel">
          <h2>Member dashboard</h2>
          <div className="panel-grid">
            <section className="panel">
              <h3>Profile media</h3>
              {profile?.avatar_url ? (
                <img className="media-preview" src={profile.avatar_url} alt="Current profile avatar" />
              ) : null}
              <MediaUpload
                label="Avatar image"
                purpose="profile-avatar"
                onUploaded={async ({ key, publicUrl }) => {
                  await api.profile.updateMedia({ avatarKey: key, avatarUrl: publicUrl })
                  await refreshProfile()
                }}
              />
              <MediaUpload
                label="Profile cover image"
                purpose="profile-cover"
                onUploaded={async ({ key, publicUrl }) => {
                  await api.profile.updateMedia({ coverImageKey: key, coverImageUrl: publicUrl })
                  await refreshProfile()
                }}
              />
            </section>
            <section className="panel">
              <h3>Create availability</h3>
              <form className="form">
              <div className="field">
                <label htmlFor="title">Course or lesson title</label>
                <input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                  placeholder="Piano interpretation session"
                />
              </div>
              <div className="field">
                <label htmlFor="startsAt">Starts</label>
                <input
                  id="startsAt"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(event) => setStartsAt(event.currentTarget.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="endsAt">Ends</label>
                <input
                  id="endsAt"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(event) => setEndsAt(event.currentTarget.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  value={location}
                  onChange={(event) => setLocation(event.currentTarget.value)}
                  placeholder="Adelaide CBD studio"
                />
              </div>
              <Button type="button" onClick={publishSlot}>
                Publish slot
              </Button>
              {message ? <p className="muted">{message}</p> : null}
              </form>
            </section>
            <section className="panel">
              <h3>Bookings received</h3>
              <p>Review visitor bookings for your course slots after Supabase is connected.</p>
            </section>
          </div>
        </section>
      </main>
    </RoleGate>
  )
}
