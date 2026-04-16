import { useEffect, useState } from 'react'
import './App.css'
import backgroundImage from './assets/poolside grove.jpg'
import icon from './assets/grove-icon.webp'

type TimeSlot = { value: string; label: string }

function getTodayStr(): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getTimeSlots(dateStr: string): TimeSlot[] {
  if (!dateStr) return []

  // Parse in local time to avoid timezone shifting the day
  const [year, month, day] = dateStr.split('-').map(Number)
  const dow = new Date(year, month - 1, day).getDay() // 0=Sun, 6=Sat

  let startHour: number
  let endHour: number // last slot starts at (endHour - 1):45

  if (dow === 0) {
    startHour = 12
    endHour = 15
  } else if (dow === 6) {
    startHour = 10
    endHour = 15
  } else {
    startHour = 8
    endHour = 17
  }

  const slots: TimeSlot[] = []
  const isToday = dateStr === getTodayStr()
  const now = new Date()
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : -1

  for (let h = startHour; h <= endHour; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === endHour && m > 0) break
      if (isToday && h * 60 + m <= currentMinutes) continue
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h < 12 ? 'AM' : 'PM'
      slots.push({ value: `${hh}:${mm}`, label: `${hour12}:${mm} ${ampm}` })
    }
  }
  return slots
}

function App() {
  const [isContestPage, setIsContestPage] = useState(
    window.location.hash === '#contest',
  )
  const [tourDate, setTourDate] = useState('')
  const [tourTime, setTourTime] = useState('')
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    if (countdown <= 0) return
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      setIsContestPage(window.location.hash === '#contest')
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <main
      className="landing-page"
      style={{
        backgroundImage: `linear-gradient(rgba(8, 12, 20, 0.45), rgba(8, 12, 20, 0.7)), url(${backgroundImage})`,
      }}
    >
      {isContestPage ? (
        <section className="content-card form-card">
          <img src={icon} alt="The Grove Icon" className="brand-icon" />
          <h1 className="form-title">Schedule a Tour to Enter</h1>
          <p className="subtitle">Start with your contact details below, and someone from The Grove will reach out to you!</p>

          <form className="contest-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-grid">
              <label className="field">
                <span>First Name <span className="required-star">*</span></span>
                <input type="text" name="firstName" placeholder="First name" required />
              </label>

              <label className="field">
                <span>Last Name <span className="required-star">*</span></span>
                <input type="text" name="lastName" placeholder="Last name" required />
              </label>

              <label className="field full-width">
                <span>Email <span className="required-star">*</span></span>
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>

              <label className="field full-width">
                <span>Phone Number <span className="required-star">*</span></span>
                <input type="tel" name="phone" placeholder="(555) 123-4567" required />
              </label>

              <label className="field">
                <span>Preferred Tour Date <span className="required-star">*</span></span>
                <input
                  type="date"
                  name="tourDate"
                  min={getTodayStr()}
                  value={tourDate}
                  required
                  onChange={(e) => {
                    setTourDate(e.target.value)
                    setTourTime('')
                  }}
                />
              </label>

              <label className="field">
                <span>Preferred Tour Time <span className="required-star">*</span></span>
                <select
                  name="tourTime"
                  value={tourTime}
                  onChange={(e) => setTourTime(e.target.value)}
                  disabled={!tourDate}
                  required
                  className="time-select"
                >
                  <option value="">
                    {tourDate ? 'Select a time' : 'Pick a date first'}
                  </option>
                  {getTimeSlots(tourDate).map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field full-width">
                <span>What amenity is most important to you? <span className="optional-label">(optional)</span></span>
                <textarea
                  name="amenity"
                  placeholder="e.g. pool, gym, parking..."
                  rows={3}
                  className="amenity-textarea"
                />
              </label>
            </div>

            <div className="action-row">
              <a href="#" className="action-button secondary">
                Back
              </a>
              <button type="submit" className="action-button primary">
                Submit
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="content-card">
          <img src={icon} alt="The Grove Icon" className="brand-icon" />
          <p className="subtitle">Win 12 months free rent!</p>

          <div className="video-container">
            <div className="video-wrapper">
              <iframe
                title="Featured video"
                src="https://www.youtube.com/embed/FQ3BwMzjX_M?autoplay=1&mute=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {countdown === 0 && (
              <a href="#contest" className="skip-button">
                Skip &rsaquo;
              </a>
            )}
          </div>

          <div className="action-row">
            {countdown > 0 ? (
              <button type="button" className="action-button secondary" disabled>
                Enter Contest ({countdown})
              </button>
            ) : (
              <a href="#contest" className="action-button secondary">
                Enter Contest
              </a>
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
