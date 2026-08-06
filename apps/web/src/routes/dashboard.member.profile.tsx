import { createFileRoute } from '@tanstack/react-router'

import { useAuth } from '../components/auth-provider'
import { MediaUpload } from '../components/media-upload'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/member/profile')({ component: MemberProfile })

function MemberProfile() {
  const { profile, refreshProfile } = useAuth()

  return (
    <div className="dashboard-section narrow">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Profile</span>
          <h2>Profile media</h2>
          <p className="muted">Update the public images used for your member profile.</p>
        </div>
      </header>
      {profile?.avatarUrl ? (
        <img className="media-preview" src={profile.avatarUrl} alt="Current profile avatar" />
      ) : null}
      <div className="dashboard-two-column">
        <section className="panel">
          <h3>Avatar</h3>
          <MediaUpload
            label="Avatar image"
            purpose="profile-avatar"
            onUploaded={async ({ key, publicUrl }) => {
              await api.profile.updateMedia({ avatarKey: key, avatarUrl: publicUrl })
              await refreshProfile()
            }}
          />
        </section>
        <section className="panel">
          <h3>Cover</h3>
          <MediaUpload
            label="Profile cover image"
            purpose="profile-cover"
            onUploaded={async ({ key, publicUrl }) => {
              await api.profile.updateMedia({ coverImageKey: key, coverImageUrl: publicUrl })
              await refreshProfile()
            }}
          />
        </section>
      </div>
    </div>
  )
}
