import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.yapperphone.app'
const SAMSUNG_STORE = 'https://galaxystore.samsung.com/detail/com.yapperphone.app'
const ORIGINALS_STRIPE = 'https://buy.stripe.com/PLACEHOLDER'
const DISCORD = 'https://discord.gg/yapperphone'

const characters = [
  'yapper-bud', 'yapper-jade', 'yapper-sam', 'yapper-nami',
  'yapper-beathead', 'yapper-mala', 'yapper-elwood', 'yapper-frank',
  'yapper-robert', 'yapper-shawn', 'yapper-pierre', 'yapper-rick',
  'yapper-twain', 'yapper-louise', 'yapper-karen', 'yapper-gabe',
  'yapper-ben', 'yapper-fred', 'yapper-tyson'
]

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [bannerHidden, setBannerHidden] = useState(false)
  const [stickyCta, setStickyCta] = useState(false)
  const mainRef = useRef(null)

  // Navbar scroll effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 100)
      setStickyCta(window.scrollY > window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // GSAP reveal animations (skip if reduced motion)
    if (!prefersReducedMotion) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.reveal').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true }
            }
          )
        })

        // Hero stagger
        gsap.fromTo('.hero-animate',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.2 }
        )
      }, mainRef)
      return () => { ctx.revert(); window.removeEventListener('scroll', handleScroll) }
    }

    // If reduced motion, just make everything visible
    document.querySelectorAll('.reveal, .hero-animate').forEach(el => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={mainRef}>
      {/* Skip to content */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ═══ SECTION 0: Originals Banner ═══ */}
      <div className={`originals-banner ${bannerHidden ? 'hidden' : ''}`} role="banner">
        <span>🟢 YAPPER ORIGINALS — Be one of the first 1,000. Lifetime Pro. €67.</span>
        <a href="#originals">Learn More ↓</a>
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className={`navbar ${navScrolled ? 'scrolled' : 'transparent'}`} aria-label="Main navigation">
        <a href="#" className="navbar-logo">
          <img src="/yapper_logo.svg" alt="Yapper Phone" width="28" height="28" />
          <span>Yapper</span>
        </a>
        <ul className="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#originals">Originals</a></li>
        </ul>
        <a href={PLAY_STORE} className="navbar-cta" target="_blank" rel="noopener noreferrer">
          Try Free
        </a>
      </nav>

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="hero" id="main-content">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-headline hero-animate" style={{ opacity: 0 }}>
              The first phone call app built for how{' '}
              <span className="accent">your brain</span> actually works.
            </h1>
            <p className="hero-sub hero-animate" style={{ opacity: 0 }}>
              You know that feeling when a call goes 40 minutes and you had no idea? Or when you can't figure out how to end it? <strong>That's not a character flaw.</strong> Your phone was never designed for your brain. Yapper was.
            </p>
            <div className="hero-cta-group hero-animate" style={{ opacity: 0 }}>
              <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">
                Try Free for 7 Days
              </a>
              <a href={SAMSUNG_STORE} className="secondary-link" target="_blank" rel="noopener noreferrer">
                Also on Samsung Galaxy Store →
              </a>
              <span className="micro-text">No credit card required · €2.99/month after trial</span>
            </div>
          </div>
          <div className="hero-phone hero-animate" style={{ opacity: 0 }}>
            <div className="phone-frame">
              <img src="/screenshot-in-call.jpg" alt="Yapper Phone in-call screen showing countdown timer at 04:14 with green Connected status" loading="eager" />
            </div>
          </div>
        </div>
        <div className="scroll-indicator" aria-hidden="true">
          <span>SCROLL</span>
          <div className="scroll-chevron" />
        </div>
      </section>

      {/* ═══ CHARACTER STRIP ═══ */}
      <div className="section-dark" style={{ padding: '1rem 0' }}>
        <div className="character-strip" aria-label="Yapper character mascots">
          <div className="character-track">
            {[...characters, ...characters].map((c, i) => (
              <img key={i} src={`/${c}.png`} alt="" loading="lazy" width="80" height="120" />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: THE PROBLEM ═══ */}
      <section className="section section-light" id="problem">
        <div className="section-inner">
          <div className="problem-text reveal">
            <p className="lead">For 150 years, the phone call has been built for the average brain.</p>
            <p className="stats">
              <strong>70% of young adults</strong> feel anxious when the phone rings.
              One in four UK adults under 35 have <strong>never answered a call</strong> to their mobile.
              One in five people worldwide are <strong>neurodivergent</strong>.
              The average brain is a myth.
            </p>
            <p className="bridge">Yapper is the first phone call redesigned for how humans actually think, feel, and communicate.</p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: THE CONSENT INNOVATION ═══ */}
      <section className="section section-dark">
        <div className="section-inner">
          <div className="consent-text reveal">
            <p className="opener">For the first time in the history of the telephone, both people agree before the call begins.</p>
            <p className="detail">
              How long. What it's about. When it ends. Before anyone picks up, both sides consent to the structure of the call.
              A shared countdown. A neutral ending. No one has to be the person who hangs up.
            </p>
            <p className="closer">This is bilateral duration negotiation — and no phone on Earth has ever done it.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <div className="phone-frame reveal" style={{ width: 180 }}>
              <img src="/screenshot-setup.jpg" alt="Yapper pre-call setup showing duration picker set to 4 minutes 14 seconds with Agenda mode selected" loading="lazy" />
            </div>
            <div className="phone-frame reveal" style={{ width: 180 }}>
              <img src="/screenshot-agenda.jpg" alt="Yapper in-call screen showing timer counting down with agenda topic displayed" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: SEVEN FEATURES ═══ */}
      <section className="section section-darker" id="features">
        <div className="section-inner">
          <div className="features-header reveal">
            <h2>What Yapper does.</h2>
          </div>
          <div className="features-grid">

            {/* Feature 1 — Time-Bound Calls */}
            <div className="feature-card reveal">
              <span className="feature-icon">⏱</span>
              <h3>Set the time before the call starts.</h3>
              <p>
                Both people agree on call duration before connecting. A synchronised countdown timer
                on both devices — colour-coded from green to orange to red. When the time is up, both of you know.
                No more calls that spiral into an hour you didn't have.
              </p>
              <p className="feature-proof">Addresses documented ADHD time perception deficits (Ptacek et al., 2019)</p>
            </div>

            {/* Feature 2 — Focus Audio */}
            <div className="feature-card reveal">
              <span className="feature-icon">🎧</span>
              <h3>Brown noise, right in your call.</h3>
              <p>
                Ambient focus sound mixed directly into your phone call. Separate volume controls. Hearing-safe levels.
                Unlike any other phone app on Earth — because until now, no one built the phone call for the brain
                that needs background noise to focus.
              </p>
            </div>

            {/* Feature 3 — Time Signals */}
            <div className="feature-card reveal">
              <span className="feature-icon">🔔</span>
              <h3>Gentle reminders — so you never lose track.</h3>
              <p>
                Soft chimes at intervals you choose — every 5, 10, or 15 minutes. Visual, audible, and haptic.
                Designed to coexist with deep focus, not interrupt it. Your external clock for when the internal one goes quiet.
              </p>
            </div>

            {/* Feature 4 — Six Call Types */}
            <div className="feature-card reveal">
              <span className="feature-icon">📐</span>
              <h3>Every call has a shape.</h3>
              <p>
                Standard for everyday. Agenda for when you need to stay on topic — the subject line sits under
                the timer so both of you see it. Body Double for silent companionship while you work.
                ICE Emergency and ICE Checkup for when lives are at stake. Custom for everything else.
                The entire interface transforms for each type. One app, six ways to call.
              </p>
            </div>

            {/* Feature 5 — ICE */}
            <div className="feature-card feature-card-with-phone reveal" style={{ borderColor: 'rgba(229, 57, 53, 0.2)' }}>
              <div>
                <span className="feature-icon">🆘</span>
                <h3>The call that always gets through.</h3>
                <p>
                  When someone you love has a medical condition — diabetes, a heart problem, epilepsy — you need to know your call
                  will reach them. ICE calls bypass Do Not Disturb. They bypass silent mode. They play at maximum volume.
                  Because a software setting should never stand between a caregiver and the person they're protecting.
                  Your 3am call gets through.
                </p>
                <p className="feature-proof">Addresses documented caregiver communication anxiety (Schulz & Sherwood, 2008)</p>
              </div>
              <div className="phone-frame">
                <img src="/screenshot-emergency.jpg" alt="Yapper Emergency Info screen showing medical information, conditions, medications, and ICE contacts" loading="lazy" />
              </div>
            </div>

            {/* Feature 6 — People Missing You */}
            <div className="feature-card reveal">
              <span className="feature-icon">💚</span>
              <h3>Not a guilt trip. A gentle nudge.</h3>
              <p>
                ADHD brains don't forget people on purpose. When someone drops out of your call pattern — a friend you
                haven't spoken to in months, a parent you keep meaning to call — Yapper surfaces them gently.
                Not as a failure. Not as a streak that broke. As a person who would love to hear from you.
                Shame-free, by design.
              </p>
              <p className="feature-proof">Designed around the shame-guilt-avoidance cycle documented in ADHD relationship research</p>
            </div>

            {/* Feature 7 — Communication Patterns */}
            <div className="feature-card reveal">
              <span className="feature-icon">📊</span>
              <h3>Understand how you communicate. On your terms.</h3>
              <p>
                A multi-domain dashboard showing your call patterns, social rhythms, and relationship health — with
                warm, plain-language summaries alongside the raw data.
                Export everything. All processing happens on your device. Your patterns, your data, your insight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: THE CURB-CUT MOMENT ═══ */}
      <section className="section section-light">
        <div className="section-inner curb-cut-section reveal">
          <h2>Designed for neurodivergent brains. Better for every brain.</h2>
          <p style={{ maxWidth: 640, margin: '0 auto 1.5rem', color: '#555', fontSize: '1.05rem', lineHeight: 1.7 }}>
            When JPMorgan Chase designed roles for autistic employees, those employees were 90–140% more productive.
            When environments are built for the most demanding users, everyone performs better.
            This is the curb-cut effect — and Yapper applies it to the phone call.
          </p>
          <div className="curb-cut-examples">
            <div className="curb-example">
              <p className="designed">Designed for ADHD</p>
              <p>Time-bound calls designed for time blindness rescue every professional trapped on a calendar-wrecking "quick call."</p>
            </div>
            <div className="curb-example">
              <p className="designed">Designed for caregivers</p>
              <p>Emergency bypass designed for a diabetic child's caregiver gives every parent peace of mind.</p>
            </div>
            <div className="curb-example">
              <p className="designed">Designed for connection</p>
              <p>A gentle nudge about friends you haven't called serves anyone whose life got too busy to keep up.</p>
            </div>
          </div>
          <p className="curb-cta">You don't need a diagnosis to need a better phone call.</p>
        </div>
      </section>

      {/* ═══ SECTION 6: THE ADHERENCE ARGUMENT ═══ */}
      <section className="section section-dark adherence">
        <p className="line1 reveal">Other ADHD apps need you to remember to open them.</p>
        <p className="line2 reveal">Yapper works because your phone rings.</p>
        <p className="micro reveal">
          Mental health apps have a median 15-day retention of 3.9%.
          Yapper is built into the infrastructure your life already uses.
        </p>
      </section>

      {/* ═══ SECTION 7: YAPPER ORIGINALS ═══ */}
      <section className="section section-darker" id="originals">
        <div className="section-inner originals-section reveal">
          <div className="originals-card">
            <h2>Yapper Originals</h2>
            <p className="originals-subtitle">The Founding 1,000</p>
            <p className="originals-price">€67 <span>one-time</span></p>
            <p className="originals-desc">
              This is for the people who see what Yapper is before the world catches up.
              The ones who know that phone calls needed this twenty years ago.
              The founding members who make the mission real.
            </p>
            <ul className="originals-perks">
              <li>Lifetime Pro access — every feature, every update, forever</li>
              <li>Your name permanently displayed on the Founders screen inside the app</li>
              <li>Early access to every new feature before public release</li>
              <li>A founding role in building Health Communications Technology</li>
            </ul>
            <a href={ORIGINALS_STRIPE} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Become a Yapper Original — €67
            </a>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              1,000 spots globally. When they're gone, they're gone.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: PRICING ═══ */}
      <section className="section section-dark" id="pricing">
        <div className="section-inner">
          <h2 className="section-heading reveal">Simple pricing. Full app.</h2>
          <div className="pricing-grid">
            <div className="pricing-card reveal">
              <h3>Free Trial</h3>
              <p className="pricing-amount">7 Days</p>
              <p className="pricing-period">€0 — no credit card</p>
              <ul className="pricing-features">
                <li>Full app, all features</li>
                <li>All six call types</li>
                <li>ICE Emergency included</li>
                <li>No commitment</li>
              </ul>
              <a href={PLAY_STORE} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} target="_blank" rel="noopener noreferrer">
                Try Free
              </a>
            </div>
            <div className="pricing-card featured reveal">
              <span className="pricing-badge">Best Value</span>
              <h3>Annual</h3>
              <p className="pricing-amount">€19.99<span style={{ fontSize: '0.9rem', fontWeight: 400 }}>/year</span></p>
              <p className="pricing-period">Effective €1.67/month · Save 44%</p>
              <ul className="pricing-features">
                <li>Full app, all features</li>
                <li>All six call types</li>
                <li>ICE Emergency included</li>
                <li>29 languages</li>
              </ul>
              <a href={PLAY_STORE} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} target="_blank" rel="noopener noreferrer">
                Subscribe & Save
              </a>
            </div>
            <div className="pricing-card reveal">
              <h3>Monthly</h3>
              <p className="pricing-amount">€2.99<span style={{ fontSize: '0.9rem', fontWeight: 400 }}>/mo</span></p>
              <p className="pricing-period">Cancel anytime</p>
              <ul className="pricing-features">
                <li>Full app, all features</li>
                <li>All six call types</li>
                <li>ICE Emergency included</li>
                <li>29 languages</li>
              </ul>
              <a href={PLAY_STORE} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} target="_blank" rel="noopener noreferrer">
                Subscribe
              </a>
            </div>
          </div>
          <p className="pricing-note reveal">
            Finnish Type 1 diabetics receive free lifetime Pro access.{' '}
            <a href="mailto:janne@maximized-impact.org">Contact us →</a>
          </p>
        </div>
      </section>

      {/* ═══ SECTION 9: THE MISSION ═══ */}
      <section className="section section-darker">
        <div className="section-inner mission-text reveal">
          <p className="mission-pillars">NO EXIT · NO INVESTORS · NO CORPORATE CAPTURE · NO MARTYRDOM</p>
          <p className="mission-body">
            A substantial portion of all profits funds the Institute for The Study Of Humanity
            and Maximized Impact — a permanent Finnish research institute studying human communication,
            neurodiversity, and the human mind. The creators who build the ecosystem are compensated
            generously. Both of these are true simultaneously.
          </p>
          <p className="mission-closer">We are not building this to sell it. We are building this to make it permanent.</p>
        </div>
      </section>

      {/* ═══ SECTION 10: TRUST FOOTER ═══ */}
      <section className="section section-dark trust-section">
        <div className="section-inner reveal">
          <h2 className="trust-headline">Your phone call, finally on your terms.</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Try Free for 7 Days on Google Play
            </a>
            <a href={SAMSUNG_STORE} className="btn-secondary" target="_blank" rel="noopener noreferrer">
              Samsung Galaxy Store
            </a>
          </div>
          <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            No credit card required · €2.99/month after trial
          </p>
          <div className="trust-bar">
            <span className="trust-item">🇫🇮 Built in Finland</span>
            <span className="trust-item">📱 29 languages</span>
            <span className="trust-item">🔒 All data on your device</span>
            <span className="trust-item">📋 667+ USPTO provisional patent applications</span>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 11: FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>Yapper Phone</h4>
            <p>Health Communications Technology</p>
            <p style={{ marginTop: '0.5rem' }}>© 2026 SUPER SINCE BIRTH Tmi</p>
          </div>
          <div>
            <h5>Download</h5>
            <ul className="footer-links">
              <li><a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">Google Play</a></li>
              <li><a href={SAMSUNG_STORE} target="_blank" rel="noopener noreferrer">Samsung Galaxy Store</a></li>
            </ul>
            <h5 style={{ marginTop: '1.5rem' }}>Community</h5>
            <ul className="footer-links">
              <li><a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a></li>
              <li><a href="https://instagram.com/yapperphone" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://tiktok.com/@yapperphone" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul className="footer-links">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
            <h5 style={{ marginTop: '1.5rem' }}>Contact</h5>
            <ul className="footer-links">
              <li><a href="mailto:janne@maximized-impact.org">janne@maximized-impact.org</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-status">
            <span className="status-dot" /> System Operational
          </div>
          <p>Institute for The Study Of Humanity and Maximized Impact ry</p>
          <p>667+ USPTO Provisional Patent Applications · February 27, 2026</p>
        </div>
      </footer>

      {/* ═══ STICKY MOBILE CTA ═══ */}
      <div className={`sticky-cta ${stickyCta ? 'visible' : ''}`}>
        <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">
          Try Free
        </a>
        <span className="price-hint">7 days · No card</span>
      </div>
    </div>
  )
}
