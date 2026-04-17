import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'
import backgroundImage from './assets/poolside grove small.jpg'
import icon from './assets/grove-icon.webp'

const EMAILJS_SERVICE_ID = 'service_zbayxy9'
const EMAILJS_TEMPLATE_ID = 'template_mywtahb'
const EMAILJS_PUBLIC_KEY = 'M9cZbIyZkSE0XgKom'

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
  const [isRulesPage, setIsRulesPage] = useState(
    window.location.hash === '#rules',
  )
  const [tourDate, setTourDate] = useState('')
  const [tourTime, setTourTime] = useState('')
  const [countdown, setCountdown] = useState(30)
  const [countdownStarted, setCountdownStarted] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [locationOptIn, setLocationOptIn] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!countdownStarted || countdown <= 0) return
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
  }, [countdownStarted])

  useEffect(() => {
    if (isContestPage || isRulesPage) return

    const initPlayer = () => {
      new (window as any).YT.Player('yt-player', {
        videoId: 'KrggJfB_B9A',
        playerVars: { rel: 0 },
        events: {
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setCountdownStarted(true)
            }
          },
        },
      })
    }

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer()
    } else {
      ;(window as any).onYouTubeIframeAPIReady = initPlayer
      if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script')
        tag.id = 'yt-api-script'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }
  }, [isContestPage, isRulesPage])

  useEffect(() => {
    const handleHashChange = () => {
      setIsContestPage(window.location.hash === '#contest')
      setIsRulesPage(window.location.hash === '#rules')
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
      {isRulesPage ? (
        <section className="content-card rules-card">
          <img src={icon} alt="The Grove Icon" className="brand-icon" />
          <h1 className="form-title">Official Rules</h1>
          <div className="rules-body">
            <p className="rules-disclaimer">NO PURCHASE OR PAYMENT OF ANY KIND IS NECESSARY TO ENTER OR WIN. A PURCHASE, PAYMENT, OR EXISTING RECURRING PAYMENT WILL NOT INCREASE OR OTHERWISE IMPACT YOUR CHANCES OF WINNING. OPEN TO LEGAL RESIDENTS OF FLORIDA, GEORGIA, AND ALABAMA. VOID WHERE RESTRICTED OR PROHIBITED BY LAW.</p>
            <p className="rules-disclaimer">NO PURCHASE NECESSARY TO ENTER OR TO WIN. A PURCHASE OF ANY KIND WILL NOT INCREASE YOUR ODDS OF WINNING. ALL FEDERAL, STATE, LOCAL AND MUNICIPAL LAWS AND REGULATIONS APPLY.</p>

            <h2>HOW TO ENTER</h2>
            <p>FREE RENT TALLY ("Sweepstakes") shall begin on April 21, 2026, at 12:00 a.m. eastern time and end on August 31, 2026, at 12:00 p.m. eastern time ("Entry Period"). The Sweepstakes will be conducted at 3335 Rhea Rd, Tallahassee, Florida 32312 (the "Sweepstakes Location"). The Sweepstakes winner shall be chosen in a random drawing from all eligible entries on August 31, 2026, at approximately 2:00 p.m. eastern time. Winner does not need to be present to win.</p>
            <p>THERE IS NO PURCHASE OR LEASE NECESSARY TO ENTER OR WIN AND A PURCHASE WILL NOT INCREASE YOUR ODDS OF WINNING.</p>
            <p>To enter the Sweepstakes, you must first visit The Grove at Bradford Hills at 3335 Rhea Rd, Tallahassee, Florida 32312, and take an in-person tour of The Grove at Bradford Hills guided by a The Grove at Bradford Hills employee and complete a digital Entry Form on The Grove at Bradford Hills' clubhouse computer (thereafter, the "Entrant"). In-person tours are only available during normal business hours for The Grove at Bradford Hills. In-person tours may not be immediately available during all business hours due to staffing or other concerns and may be required to be scheduled for a future time. The Entry Form requires your full name; age; complete address [no P.O. Boxes]; mobile phone number, including area code; and e-mail address. Entrant must complete the Entry Form with all required information on the entry submission page for the entry to be eligible. You may opt-in to advertising by checking the appropriate box on the Entry Form. For purposes of this Sweepstakes, an on-line entry is "received" when the Sweepstakes Website's servers record the entry information or at the time an Entrant completes the Entry Form following an in-person tour. The database clock of the Sweepstakes Website will be the official time keeper for the Sweepstakes. By submitting an Entry Form to the Sweepstakes, all Entrants are affirming their agreement to these Official Rules. Those who do not follow all of the instructions, provide the required information in their Entry Form, or abide by these Official Rules or other instructions of Sponsor will be disqualified.</p>
            <p>Limit one entry per person. Duplicate and mechanically reproduced multiple entries will be disregarded. All entries must be completed in their entirety. All entries become the property of the Sponsor and will not be returned. Sponsor is not responsible for illegible, incomplete, altered, mutilated, or lost entries, for any incorrect or inaccurate entry information, whether caused by any of the equipment or programming associated with or utilized in the Sweepstakes, or by any technical or human error which may occur in the processing of the entries in the Sweepstakes, or for failure to receive entries due to technical failures of any kind, and such entries will be void. Sponsor reserves the right to disqualify any entries by persons determined to be tampering with or abusing any aspect of the Sweepstakes.</p>

            <h2>DECISION OF THE SPONSOR</h2>
            <p>By participating in this Sweepstakes, each Entrant unconditionally accepts and agrees to comply with and abide by these Official Rules and all decisions of Sponsor, which shall be final and binding in all respects. Sponsor reserves the right to cancel this Sweepstakes at any time for any reason without notice. Sponsor reserves the right in its sole discretion to suspend, modify or terminate the Sweepstakes. Should the Sweepstakes be terminated prior to the stated expiration date, Sponsor reserves the right to award prizes based on the entries received before the termination date. Sponsor reserves the right to disqualify any entries by persons determined to be tampering with or abusing any aspect of the Sweepstakes. All Entries that are in excess of the stated limits, late, illegible, incomplete, damaged, destroyed, forged or otherwise not in compliance with the Official Rules may be disqualified from the Sweepstakes at Sponsor's sole and absolute discretion. Use of any automated system to submit Entries is prohibited and will result in disqualification. Sponsor reserves the right to void all Entries made through any robotic, automatic, mechanically programmed or similar entry duplication method and to disqualify any individual using such a method.</p>

            <h2>ELIGIBILITY</h2>
            <p>The Sweepstakes is open only to legal United States residents of Florida, Georgia, and Alabama, who are 18 years of age or older at time of entry. Employees of Sponsor and its parent, subsidiaries, affiliates, agents, distributors, franchisees, retailers, sales representatives, advertising and promotion agencies and each of their respective officers, directors and employees (collectively, the "Promotion Entities") and members of their immediate families or persons residing in the same household, are ineligible to enter the Sweepstakes or win a prize. Winners of a prize from Sponsor within the past thirty (30) days from the beginning date of this Sweepstakes are not eligible. Void where prohibited or restricted by law and subject to all Federal, State and local laws. Winner must meet all other background and credit criteria of The Grove at Bradford Hills to be eligible to win.</p>

            <h2>PRIZE</h2>
            <p>One Prize Winner will receive one year of free rent to be applied towards a lease for a one bedroom unit at The Grove at Bradford Hills, up to a total amount of $20,376. No money will be awarded nor may the Prize be exchanged or redeemed for money or its cash value. The Prize is non-transferable. The applicable lease to which the Prize is applied is not assignable and may not be subleased.</p>
            <p>Approximate retail value of the Prize is: $20,376.</p>

            <h2>ODDS</h2>
            <p>Odds of winning will depend on the number of eligible participants who enter the Sweepstakes.</p>

            <h2>WINNER NOTIFICATION AND ACCEPTANCE</h2>
            <p>Winner will be notified by email or phone using the email address or phone number provided on the Entry Form on or about August 31, 2026. If a Winner fails to respond to Sponsor within fourteen (14) days of notification, such Winner shall forfeit Prize and Sponsor may select an alternate Winner in a random drawing from the remaining eligible entries or may cancel and terminate the Sweepstakes without a Winner. Potential winner may waive their right to receive a prize. Prize is non-assignable and non-transferable. No substitutions allowed. Winner is solely responsible for reporting and payment of any taxes on prizes. Where legal, winner may be required to sign, execute, and return a Prize Winner Statement of Eligibility and Release of Liability and Publicity Release and any other documentation that Sponsor requires (collectively "Statement/Release") before a prize will be awarded or such potential winner may be disqualified and an alternate potential winner may be selected. Except where prohibited by law, participation in the Sweepstakes constitutes Entrant's consent to the publication of his or her name and image in any media for any commercial or promotional purpose, without limitation or further compensation.</p>
            <p>The Sponsor reserves the right at any time to cancel this Sweepstakes and/or substitute another prize of equal or greater value for any reason including if the Prize becomes unavailable.</p>
            <p>The Prize must be claimed in person by the winner unless otherwise specified. Proper identification is required to claim the prize (valid drivers license, passport, state ID or military ID) and winner will be required to complete a rental application (which includes, among other things, submitting to a background check and credit check as well as providing a guarantor for the lease) and, if approved, sign a one-year lease for the property at The Grove at Bradford Hills in order to take receipt of the prize. Winner must meet all other background and credit criteria of The Grove at Bradford Hills to be eligible to win. The terms of the Lease are not subject to change or negotiation. Failure to enter the Lease by September 30, 2026, will constitute forfeiture of the Prize.</p>

            <h2>VENUE</h2>
            <p>Any actions brought relating in any way to the Sweepstakes must be brought in a court of competent jurisdiction in Leon County, Florida.</p>

            <h2>FEES</h2>
            <p>All parties shall be responsible for their own legal fees and costs arising out of the Sweepstakes or any disputes relating in any way to the Sweepstakes.</p>

            <h2>WAIVER OF CLASS ACTIONS</h2>
            <p>To fullest extent permitted by applicable law, each Entrant and Sponsor further agrees that they may only bring claims in their individual capacity and not as a plaintiff or class member in any purported class, collective, or representative action. Each Entrant explicitly waives their right to participate in a class action, representative action, or any other collective proceeding.</p>

            <h2>SWEEPSTAKES RULES</h2>
            <p>Printed copies of these Official Rules are available at the Sweepstakes Location or by sending a stamped self-addressed envelope to: 3335 Rhea Rd, Tallahassee, Florida 32312.</p>

            <h2>GENERAL RELEASE</h2>
            <p>Each Entrant agrees that the Sponsor and Promotion Entities (A) shall not be responsible or liable for any losses, damages or injuries of any kind resulting from participation in the Sweepstakes or in any Sweepstakes related activity, or from Entrant's acceptance, receipt, possession and/or use or misuse of any prize, and (B) have not made any warranty, representation or guarantee express or implied, in fact or in law, with respect to any prize, including, without limitation, to such prize's quality or fitness for a particular purpose.</p>
            <p>Where legal, submission of an entry grants Sponsor the right to use, publish, adapt, assign, edit, dispose of, and/or modify such entry in any way, in commerce and in any and all media worldwide, without limitation or compensation to the Entrant. Where legal, submission of an entry further constitutes the Entrant's consent to irrevocably assign and transfer to the Sponsor any and all rights, title and interest in and to the entry. Such rights, title and interest shall include, but are not limited to, all intellectual property and licensing rights. By entering, Entrants agree to and acknowledge compliance with these Official Rules, including all eligibility requirements and agree to release Sponsor, its affiliates, subsidiaries, franchisees, divisions, advertising and promotion agencies, and all of their respective employees, directors, officers, shareholders, agents, successors or assigns (collectively "Releasees"), from any claims, losses, actions, or damages, whether actual, incidental or consequential, arising out of or relating to Entrants' participation in this Sweepstakes, or the acceptance, possession or use/misuse of any prize, or participation in prize-related activities. Releasees are not responsible for: (i) entries that are lost, late, stolen, incomplete, illegible, damaged, garbled, destroyed, misdirected, or not received by the Sponsor or its agents for any reason, (ii) any problems or technical malfunctions, errors, omissions, interruptions, deletions, defects, delays in operation or transmission, communication failures or human error that may occur in the transmission, receipt or processing of entries, or for destruction of or unauthorized access to, or alteration of, entries, (iii) failed or unavailable hardware, network, software or telephone, cable or satellite transmissions, cellular equipment towers, damage to Entrants' or any person's computer, wireless phone/handset and/or its contents, or causes beyond Sponsor's reasonable control that jeopardize the administration, security, fairness, integrity or proper conduct of this Sweepstakes or (iv) any entries submitted in a manner that is not expressly allowed under these rules. All incomplete or non-conforming entries will be disqualified. Sponsor is further not responsible for incorrect or inaccurate entry information whether caused by any of the equipment or programming associated with or utilized in the Sweepstakes or by any technical or human error which may occur in the transmission, receipt or processing of the entries.</p>
            <p>Notwithstanding the foregoing, in the event that the preceding release is determined by a court of competent jurisdiction to be invalid or void for any reason, Sweepstakes Entrant agrees that, by entering the Sweepstakes, (i) any and all disputes, claims, and causes of action arising out of or in connection with the Sweepstakes, or any prizes awarded, shall be resolved individually without resort to any form of class action; (ii) any claims, judgments and awards shall be limited to actual out-of-pocket costs incurred, including costs associated with entering the Sweepstakes, but in no event attorney's fees; and (iii) under no circumstances will any Entrant be permitted to obtain any award for, and Entrant hereby waives all rights to claim, punitive, incidental or consequential damages and any and all rights to have damages multiplied or otherwise increased and any other damages, other than damages for actual out-of-pocket expenses.</p>

            <h2>CONSTRUCTION</h2>
            <p>All issues and questions concerning the construction, validity, interpretation and enforceability of these Official Rules, or the rights and obligations of any Entrant and Sponsors, shall be governed by, and construed in accordance with the laws of the State of Florida. The invalidity or unenforceability of any provision of these Official Rules shall not affect the validity or enforceability of any other provision. In the event that any such provision is determined to be invalid or otherwise unenforceable, these rules shall be construed in accordance with their terms as if the invalid or unenforceable provision was not contained therein.</p>

            <h2>SPONSOR</h2>
            <p>FREE RENT TALLY is sponsored by Bradford Hills, LLC, 12921 US Highway 19 S, Thomasville, GA 31792 whose decisions regarding the selection of the Winner and all other aspects of the Sweepstakes shall be final and binding in all respects. Sponsor will not be responsible for typographical, printing or other inadvertent errors in these Official Rules or in other materials relating to the Sweepstakes.</p>
            <p>This promotion is in no way sponsored, endorsed or administered by, or associated with Facebook, Twitter, Instagram, Snapchat, YouTube, Pinterest, LinkedIn or Google. You understand that you are providing your information to the owner of this sweepstakes and not to Facebook, Twitter, Instagram, Snapchat, YouTube, Pinterest, LinkedIn or Google.</p>
          </div>
          <div className="action-row" style={{ marginTop: '24px' }}>
            <a href="#" className="action-button secondary">Back</a>
          </div>
        </section>
      ) : isContestPage ? (
        <section className="content-card form-card">
          <img src={icon} alt="The Grove Icon" className="brand-icon" />
          <h1 className="form-title">Tour The Grove to Enter</h1>
          <p className="subtitle">After the tour, complete your sweepstakes at the office!</p>

          <form
            className="contest-form"
            ref={formRef}
            onSubmit={(event) => {
              event.preventDefault()
              if (!formRef.current) return
              setSubmitState('sending')

              const doSend = (locationStr: string) => {
                // inject location into a hidden field so EmailJS picks it up
                const existing = formRef.current!.querySelector<HTMLInputElement>('input[name="location"]')
                const locInput = existing ?? document.createElement('input')
                locInput.type = 'hidden'
                locInput.name = 'location'
                locInput.value = locationStr
                if (!existing) formRef.current!.appendChild(locInput)

                emailjs
                  .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current!, EMAILJS_PUBLIC_KEY)
                  .then(() => setSubmitState('success'))
                  .catch(() => setSubmitState('error'))
              }

              if (locationOptIn && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude, accuracy } = pos.coords
                    doSend(`${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)`)
                  },
                  () => doSend('Opted in — permission denied or unavailable'),
                  { timeout: 8000 },
                )
              } else {
                doSend(locationOptIn ? 'Opted in — geolocation not supported' : 'Not shared')
              }
            }}
          >
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

              <label className="field full-width location-opt-in">
                <span className="location-opt-in-inner">
                  <input
                    type="checkbox"
                    name="locationOptIn"
                    checked={locationOptIn}
                    onChange={(e) => setLocationOptIn(e.target.checked)}
                    className="location-checkbox"
                  />
                  <span>
                    I agree to share my location to help The Grove at Bradford Hills understand where their advertising is reaching people. <span className="optional-label">(optional)</span>
                  </span>
                </span>
              </label>
            </div>

            <div className="action-row">
              <a href="#" className="action-button secondary">
                Back
              </a>
              {submitState === 'success' ? (
                <span className="submit-feedback success">Submitted! We'll be in touch.</span>
              ) : (
                <button
                  type="submit"
                  className="action-button primary"
                  disabled={submitState === 'sending'}
                >
                  {submitState === 'sending' ? 'Sending…' : 'Submit'}
                </button>
              )}
            </div>
            {submitState === 'error' && (
              <p className="submit-feedback error">Something went wrong. Please try again.</p>
            )}
          </form>
        </section>
      ) : (
        <section className="content-card">
          <img src={icon} alt="The Grove Icon" className="brand-icon" />
          <p className="subtitle">Win 1 year free rent!</p>

          <div className="video-container">
            <div className="video-wrapper">
              <div id="yt-player" style={{ width: '100%', height: '100%' }} />
            </div>
            {countdown === 0 && (
              <a href="#contest" className="skip-button">
                Skip
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
                </svg>
              </a>
            )}
          </div>

          <div className="action-row">
            {!countdownStarted ? (
              <button type="button" className="action-button secondary" disabled>
                Watch to Enter
              </button>
            ) : countdown > 0 ? (
              <button type="button" className="action-button secondary" disabled>
                Enter Contest ({countdown})
              </button>
            ) : (
              <a href="#contest" className="action-button secondary">
                Enter Contest
              </a>
            )}
          </div>
          <a href="#rules" className="rules-link">Official Rules</a>
        </section>
      )}
    </main>
  )
}

export default App
