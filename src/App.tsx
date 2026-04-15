import { useEffect, useState } from 'react'
import './App.css'
import backgroundImage from './assets/Luxurious poolside at twilight.png'
import icon from './assets/grove-icon.webp'

function App() {
  const [isContestPage, setIsContestPage] = useState(
    window.location.hash === '#contest',
  )

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
          <h1 className="form-title">Enter Contest</h1>
          <p className="subtitle">Start with your contact details below.</p>

          <form className="contest-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-grid">
              <label className="field">
                <span>First Name</span>
                <input type="text" name="firstName" placeholder="First name" />
              </label>

              <label className="field">
                <span>Last Name</span>
                <input type="text" name="lastName" placeholder="Last name" />
              </label>

              <label className="field full-width">
                <span>Email</span>
                <input type="email" name="email" placeholder="you@example.com" />
              </label>

              <label className="field full-width">
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="(555) 123-4567" />
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

          <div className="video-wrapper">
            <iframe
              title="Featured video"
              srcDoc="<style>body{margin:0;display:grid;place-items:center;background:#0f172a;color:#f8fafc;font-family:Arial,sans-serif;}div{border:1px dashed rgba(255,255,255,.45);border-radius:14px;padding:1rem 1.5rem;background:rgba(255,255,255,.06);}</style><div>Embedded video goes here</div>"
              allowFullScreen
            />
          </div>

          <div className="action-row">
            <a
              href="https://bradford-hills.com"
              target="_blank"
              rel="noreferrer"
              className="action-button primary"
            >
              View Website
            </a>
            <a href="#contest" className="action-button secondary">
              Enter Contest
            </a>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
