import { useState } from 'react'

import { api } from '../lib/orpc'
import { useAuth } from './auth-provider'
import { Button } from './ui/button'

export function MembershipApplicationForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [instruments, setInstruments] = useState('')
  const [motivation, setMotivation] = useState('')
  const [experience, setExperience] = useState('')
  const [message, setMessage] = useState('')

  async function submitApplication() {
    if (!user?.email) {
      setMessage('Sign in before submitting a membership application.')
      return
    }

    const parsedInstruments = instruments
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (!fullName.trim() || parsedInstruments.length === 0 || !experience.trim() || !motivation.trim()) {
      setMessage('Complete all application fields before submitting.')
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
      setMessage('Application submitted for admin review.')
      onSubmitted?.()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Application submission failed.')
    }
  }

  return (
    <form className="form">
      <div className="field">
        <label htmlFor="membershipFullName">Full name</label>
        <input
          id="membershipFullName"
          value={fullName}
          onChange={(event) => setFullName(event.currentTarget.value)}
          placeholder="Your full name"
        />
      </div>
      <div className="field">
        <label htmlFor="membershipInstruments">Instruments</label>
        <input
          id="membershipInstruments"
          value={instruments}
          onChange={(event) => setInstruments(event.currentTarget.value)}
          placeholder="Piano, violin, voice"
        />
      </div>
      <div className="field">
        <label htmlFor="membershipExperience">Experience</label>
        <textarea
          id="membershipExperience"
          value={experience}
          onChange={(event) => setExperience(event.currentTarget.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="membershipMotivation">Why join SAIMA?</label>
        <textarea
          id="membershipMotivation"
          value={motivation}
          onChange={(event) => setMotivation(event.currentTarget.value)}
        />
      </div>
      <Button type="button" onClick={submitApplication}>
        Submit application
      </Button>
      {message ? <p className="muted">{message}</p> : null}
    </form>
  )
}
