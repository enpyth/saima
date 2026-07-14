import { useState } from 'react'

import { api } from '../lib/orpc'
import { membershipContent } from '../content/membership'
import { useAuth } from './auth-provider'
import { useLanguage } from './language-provider'
import { Button } from './ui/button'

export function MembershipApplicationForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { user } = useAuth()
  const { language } = useLanguage()
  const content = membershipContent[language].applicationForm
  const [fullName, setFullName] = useState('')
  const [instruments, setInstruments] = useState('')
  const [motivation, setMotivation] = useState('')
  const [experience, setExperience] = useState('')
  const [message, setMessage] = useState('')

  async function submitApplication() {
    if (!user?.email) {
      setMessage(content.signInRequired)
      return
    }

    const parsedInstruments = instruments
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (!fullName.trim() || parsedInstruments.length === 0 || !experience.trim() || !motivation.trim()) {
      setMessage(content.completeRequired)
      return
    }

    try {
      await api.membershipApplications.create({
        fullName: fullName.trim(),
        email: user.email,
        instruments: parsedInstruments,
        experience: experience.trim(),
        motivation: motivation.trim(),
      })
      setMessage(content.submitted)
      onSubmitted?.()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : content.failed)
    }
  }

  return (
    <form className="form">
      <div className="field">
        <label htmlFor="membershipFullName">{content.fullName}</label>
        <input
          id="membershipFullName"
          value={fullName}
          onChange={(event) => setFullName(event.currentTarget.value)}
          placeholder={content.fullNamePlaceholder}
        />
      </div>
      <div className="field">
        <label htmlFor="membershipInstruments">{content.instruments}</label>
        <input
          id="membershipInstruments"
          value={instruments}
          onChange={(event) => setInstruments(event.currentTarget.value)}
          placeholder={content.instrumentsPlaceholder}
        />
      </div>
      <div className="field">
        <label htmlFor="membershipExperience">{content.experience}</label>
        <textarea
          id="membershipExperience"
          value={experience}
          onChange={(event) => setExperience(event.currentTarget.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="membershipMotivation">{content.motivation}</label>
        <textarea
          id="membershipMotivation"
          value={motivation}
          onChange={(event) => setMotivation(event.currentTarget.value)}
        />
      </div>
      <Button type="button" onClick={submitApplication}>
        {content.submit}
      </Button>
      {message ? <p className="muted">{message}</p> : null}
    </form>
  )
}
