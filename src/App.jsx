import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createGiftCheckout, joinWaitlist, getFoundersCount } from './firebase'
import FeaturesPage from './FeaturesPage'
import LegalPage from './LegalPage'

gsap.registerPlugin(ScrollTrigger)

// ─── Yapper site v7.7 ───────────────────────────────────────────────
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.yapperphone.app'
const DISCORD = 'https://discord.gg/GN37uWKn9k'

// LIVE Stripe Payment Link - Yapper Founders €67 self-purchase (swapped from test 2026-06-08).
const FOUNDERS_STRIPE = 'https://buy.stripe.com/cNi9ATdiVcBu0gjfQp8g000'

// Master launch switch. true = app live on Google Play.
// The hero, final-CTA section, and banner still show Founders alongside the Play Store CTA
// - dual-state launch window while the 1,000-cap Founders is selling.
// When Founders sells out, drop the Founders pieces from heroCta + final-CTA + banner.
const LAUNCHED = true

const characters = [
  'yapper-bud','yapper-jade','yapper-sam','yapper-nami',
  'yapper-beathead','yapper-mala','yapper-elwood','yapper-frank',
  'yapper-robert','yapper-shawn','yapper-pierre','yapper-rick',
  'yapper-twain','yapper-louise','yapper-karen','yapper-gabe',
  'yapper-ben','yapper-fred','yapper-tyson'
]

const FAQ_ITEMS = [
  { q: 'Does the other person need Yapper?', a: 'No. You can call anyone. Yapper works with any phone number. When you call someone who also has Yapper, you unlock bilateral features like shared countdown timers, duration negotiation, and agenda topics visible on both screens. Calls to non-Yapper numbers still work as normal phone calls with your own timer running.' },
  { q: 'Does Yapper replace my phone app?', a: 'Yes. Yapper is a full dialer replacement. It handles all your calls, contacts, and call history. You set it as your default phone app during setup. Everything your stock dialer does, Yapper does, plus time-bound calls, focus audio, ICE emergency bypass, and everything else.' },
  { q: 'What happens when the timer ends?', a: 'A gentle chime plays for both people. The call doesn\'t cut off. You get a clear signal that the agreed time is up, and either person can end naturally. No awkward "I have to go" needed. The timer gave you both permission to wrap up.' },
  { q: 'Is my data safe?', a: 'All data stays on your device. Analytics are processed on-device. There is no cloud upload without your explicit action. Yapper has no servers of its own; the one cloud component is a handshake that lets two Yapper phones agree a call length, and it carries nothing else. Calls run on your carrier\'s network. Yapper doesn\'t sell data, serve ads, or share your information with anyone.' },
  { q: 'What about iOS / iPhone?', a: 'Yapper Phone is Android-only at launch (Google Play). iOS deployment requires Apple to open telephony APIs to third-party apps, something we\'re actively advocating for through accessibility and regulatory channels.' },
  { q: 'Do ICE emergency features require a subscription?', a: 'Yes. ICE Emergency calls, ICE Checkup calls, and the lockscreen emergency info card require an active subscription, an active free trial, or Yapper Founders lifetime access. The 7-day free trial includes all ICE features.' },
]

const CALL_TYPES = [
  { name: 'Standard', emoji: '📞', color: '#00C853', desc: 'The everyday call with time awareness built in. Duration negotiation, countdown timer, all core features active.' },
  { name: 'Body Double', emoji: '🤝', color: '#7B1FA2', desc: 'ADHD accountability sessions. Not a conversation: a passive co-presence session for task activation. A widely used ADHD strategy.' },
  { name: 'Agenda', emoji: '📋', color: '#2196F3', desc: 'Both people see the topic before anyone answers. Write a short agenda, receiving side sees it before answering and both sides see it under the timer the entire call. You can save agendas, set presets for contacts and Yapper also saves the incoming agendas for you to use yourself later if you want.' },
  { name: 'ICE Emergency', emoji: '🆘', color: '#E53935', desc: 'Urgent, high-priority calls. Bypasses silent mode, Do Not Disturb, and all restrictions. Maximum volume.' },
  { name: 'ICE Checkup', emoji: '🩺', color: '#F57C00', desc: 'If you\'ve set someone as your ICE contact, they can reach you with a Checkup call that bypasses silent mode and Do Not Disturb when they suspect danger or have a reason to worry. Your safety net, even when your phone is on mute.' },
  { name: 'Custom', emoji: '🎨', color: '#00BCD4', desc: 'Set any duration down to the second. For calls that don\'t fit a label. The interface is yours to configure.' },
]

function TrustBar({className}) {
  return (
    <div className={`trust-bar-inline ${className || ''}`}>
      <span className="trust-item-inline">🇫🇮 Built in Finland</span>
      <span className="trust-item-inline">📱 29 languages</span>
      <span className="trust-item-inline">🔒 All data on your device</span>
      <span className="trust-item-inline">📋 667+ innovation disclosures, one USPTO provisional patent application</span>
    </div>
  )
}

function FAQAccordion() {
  const [open, setOpen] = useState(null)
  return (
    <section className="section section-dark" id="faq">
      <div className="section-inner">
        <h2 className="section-heading reveal">Common questions</h2>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item reveal ${open === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span>{item.q}</span>
                <span className="faq-chevron">{open === i ? '−' : '+'}</span>
              </button>
              <div className="faq-answer" style={{maxHeight: open === i ? 300 : 0}}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CallTypeCard({type, onClick}) {
  return (
    <button className="calltype-card reveal" onClick={onClick} style={{'--ct-color': type.color}}>
      <span className="calltype-emoji">{type.emoji}</span>
      <span className="calltype-name">{type.name}</span>
      <span className="calltype-dot" />
    </button>
  )
}

function CallTypeModal({type, onClose}) {
  if (!type) return null
  return (
    <div className="calltype-overlay" onClick={onClose}>
      <div className="calltype-modal" onClick={e => e.stopPropagation()} style={{'--ct-color': type.color}}>
        <button className="calltype-close" onClick={onClose}>✕</button>
        <span className="calltype-modal-emoji">{type.emoji}</span>
        <h3>{type.name}</h3>
        <p>{type.desc}</p>
      </div>
    </div>
  )
}

function GiftModal({open, onClose}) {
  const [tier, setTier] = useState('annual')
  const [months, setMonths] = useState(1)
  const [form, setForm] = useState({gifterName:'',gifterEmail:'',recipientName:'',recipientEmail:'',recipientEmailConfirm:'',message:''})
  const [loading, setLoading] = useState(false)
  const monthlyTotal = (2.99 * months).toFixed(2)

  const emailsMatch = form.recipientEmail.trim().length > 0
    && form.recipientEmail.trim() === form.recipientEmailConfirm.trim()
  const recipientConfirmMismatch = form.recipientEmailConfirm.trim().length > 0 && !emailsMatch

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!emailsMatch) return
    setLoading(true)
    try {
      const result = await createGiftCheckout({
        giftType: tier,
        months: tier === 'monthly' ? months : undefined,
        gifterName: form.gifterName,
        gifterEmail: form.gifterEmail,
        recipientName: form.recipientName,
        recipientEmail: form.recipientEmail,
        personalMessage: form.message,
      })
      window.location.href = result.data.url
    } catch (err) {
      console.error('Gift checkout error:', err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="gift-modal-overlay" onClick={onClose}>
      <div className="gift-modal" onClick={e => e.stopPropagation()}>
        <button className="gift-modal-close" onClick={onClose}>✕</button>
        <h2 className="gift-headline">Give a Better Call</h2>
        <p className="gift-subheadline">Give someone you love a phone call that finally works for their brain.</p>
        <div className="gift-tiers">
          <div className={`gift-tier ${tier === 'monthly' ? 'selected' : ''}`} onClick={() => setTier('monthly')}>
            <span className="gift-tier-badge">Flexible</span>
            <h4>Gift Monthly</h4>
            <div className="gift-tier-price">€{monthlyTotal}</div>
            <div className="gift-tier-detail">{months} month{months > 1 ? 's' : ''}</div>
            <div className="gift-months-selector">
              {[1,3,6].map(m => (
                <button key={m} className={`gift-month-btn ${months === m ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setTier('monthly'); setMonths(m) }}>{m}mo</button>
              ))}
            </div>
          </div>
          <div className={`gift-tier featured ${tier === 'annual' ? 'selected' : ''}`} onClick={() => setTier('annual')}>
            <span className="gift-tier-badge">Recommended</span>
            <h4>Gift Annual</h4>
            <div className="gift-tier-price">€19.99</div>
            <div className="gift-tier-detail">12 months · Save 44%</div>
          </div>
          <div className={`gift-tier ${tier === 'originals' ? 'selected' : ''}`} onClick={() => setTier('originals')}>
            <span className="gift-tier-badge gift-tier-originals-badge">Founding Member</span>
            <h4>Gift Founders</h4>
            <div className="gift-tier-price">€67</div>
            <div className="gift-tier-detail">Lifetime access · Forever</div>
          </div>
        </div>
        <form className="gift-form" style={{marginTop:'1.5rem'}} onSubmit={handleSubmit}>
          <div className="gift-form-row">
            <div className="gift-input-group"><label>Your name</label><input type="text" required value={form.gifterName} onChange={e => setForm({...form, gifterName: e.target.value})} placeholder="Your name" /></div>
            <div className="gift-input-group"><label>Your email</label><input type="email" required value={form.gifterEmail} onChange={e => setForm({...form, gifterEmail: e.target.value})} placeholder="you@email.com" /></div>
          </div>
          <div className="gift-form-row">
            <div className="gift-input-group"><label>{"Recipient's name"}</label><input type="text" required value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})} placeholder="Their name" /></div>
            <div className="gift-input-group"><label>{"Recipient's email"}</label><input type="email" required value={form.recipientEmail} onChange={e => setForm({...form, recipientEmail: e.target.value})} placeholder="them@email.com" /></div>
          </div>
          <div className="gift-form-row">
            <div className="gift-input-group" style={{gridColumn:'1 / -1'}}>
              <label>{"Confirm recipient's email"}</label>
              <input
                type="email"
                required
                value={form.recipientEmailConfirm}
                onChange={e => setForm({...form, recipientEmailConfirm: e.target.value})}
                placeholder="them@email.com"
                onPaste={e => e.preventDefault()}
                aria-invalid={recipientConfirmMismatch}
                style={recipientConfirmMismatch
                  ? {borderColor:'#E53935',boxShadow:'0 0 0 1px rgba(229,57,53,0.3)'}
                  : undefined} />
              {recipientConfirmMismatch && (
                <p style={{margin:'0.35rem 0 0',fontSize:'0.8rem',color:'#E53935'}}>
                  Emails don&apos;t match.
                </p>
              )}
            </div>
          </div>
          <div className="gift-input-group"><label>Personal message (optional)</label><textarea maxLength={200} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="I found something that helps me with phone calls. I want you to have it too." /></div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',border:'none'}} disabled={loading || !emailsMatch}>
            {loading ? 'Preparing checkout...' : `Send Gift${tier === 'monthly' ? ` - €${monthlyTotal}` : tier === 'annual' ? ' - €19.99' : ' - €67'}`}
          </button>
          <p className="gift-redeem-note" style={{marginTop:'1rem',fontSize:'0.8rem',lineHeight:1.6,color:'var(--text-secondary)',textAlign:'center'}}>Your gift is reserved the moment you buy. We email both of you right away. The recipient gets the redemption code and install instructions.</p>
          <div className="gift-trust"><span>🔒 Secure payment via Stripe</span><span>📨 Gift code emailed instantly</span><span>🇫🇮 Built in Finland</span></div>
        </form>
      </div>
    </div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | done | error
  const submit = async (e) => {
    e.preventDefault()
    if (!email) return
    setState('loading')
    try {
      await joinWaitlist({ email })
      setState('done')
    } catch (err) {
      console.error('Waitlist error:', err)
      setState('error')
    }
  }
  if (state === 'done') return <p style={{color:'var(--yapper-green)',fontWeight:600,fontFamily:'var(--font-display)'}}>You&apos;re on the list. We&apos;ll be in touch. 🟢</p>
  return (
    <form onSubmit={submit} style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:'center'}}>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address"
        style={{flex:'1 1 220px',minWidth:0,padding:'0.85rem 1rem',borderRadius:10,border:'1px solid rgba(255,255,255,0.14)',background:'rgba(255,255,255,0.04)',color:'var(--text-primary)',fontFamily:'inherit',fontSize:'0.95rem'}} />
      <button type="submit" className="btn-primary" disabled={state === 'loading'} style={{border:'none'}}>{state === 'loading' ? 'Joining…' : 'Notify me'}</button>
      {state === 'error' && <p style={{flexBasis:'100%',fontSize:'0.82rem',color:'var(--text-secondary)',marginTop:'0.3rem'}}>Couldn&apos;t reach the server. Please <a href={DISCORD} target="_blank" rel="noopener noreferrer" style={{color:'var(--yapper-green)'}}>join the Discord</a> and we&apos;ll keep you posted.</p>}
    </form>
  )
}

function MobileNavDrawer({open, onClose, ctaHref, ctaLabel, ctaExternal}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div className={`mobile-nav-backdrop ${open ? 'open' : ''}`}
           onClick={onClose} aria-hidden="true" />
      <aside id="mobile-nav-drawer"
             className={`mobile-nav-drawer ${open ? 'open' : ''}`}
             role="dialog" aria-modal="true" aria-label="Site navigation">
        <button className="mobile-nav-close" onClick={onClose} aria-label="Close menu">✕</button>
        <nav className="mobile-nav-links" aria-label="Mobile navigation">
          <a href="/features" onClick={onClose}>Features</a>
          <a href="/gift" onClick={onClose}>Gift</a>
          <a href="/privacy" onClick={onClose}>Privacy</a>
        </nav>
        <div className="mobile-nav-cta-wrap">
          {ctaExternal
            ? <a href={ctaHref} className="btn-primary mobile-nav-cta"
                 target="_blank" rel="noopener noreferrer" onClick={onClose}>{ctaLabel}</a>
            : <a href={ctaHref} className="btn-primary mobile-nav-cta"
                 onClick={onClose}>{ctaLabel}</a>}
        </div>
      </aside>
    </>
  )
}

function AppRouter() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  if (path === '/features' || path === '/features/') {
    return <FeaturesPage />
  }
  if (path === '/gift' || path === '/gift/') {
    return <LandingPage giftAutoOpen={true} />
  }
  if (path === '/privacy' || path === '/privacy/') {
    return <LegalPage page="privacy" />
  }
  if (path === '/terms' || path === '/terms/') {
    return <LegalPage page="terms" />
  }
  if (path === '/legal' || path === '/legal/') {
    return <LegalPage page="legal" />
  }
  return <LandingPage />
}

export default AppRouter

function LandingPage({giftAutoOpen = false}) {
  const [navScrolled, setNavScrolled] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [stickyCta, setStickyCta] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [activeCallType, setActiveCallType] = useState(null)
  const [giftOpen, setGiftOpen] = useState(giftAutoOpen)
  const [foundersCount, setFoundersCount] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mainRef = useRef(null)
  const scrollTimer = useRef(null)

  useEffect(() => {
    let cancelled = false
    getFoundersCount().then(c => { if (!cancelled) setFoundersCount(c) })
    return () => { cancelled = true }
  }, [])

  const nextFounderNumber = foundersCount != null ? foundersCount + 1 : null

  const handleScroll = useCallback(() => {
    const y = window.scrollY
    const heroHeight = window.innerHeight
    setBannerVisible(y < heroHeight * 0.6)
    setNavScrolled(y > 100)
    const shouldShow = y > heroHeight
    setStickyCta(shouldShow)
    if (shouldShow) {
      setStickyVisible(false)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => setStickyVisible(true), 3000)
    } else {
      setStickyVisible(false)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  }, [])

  useEffect(() => {
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.addEventListener('scroll', handleScroll, {passive:true})
    if (window.scrollY > window.innerHeight) {
      scrollTimer.current = setTimeout(() => setStickyVisible(true), 3000)
    }
    if (!prm) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.reveal').forEach(el => {
          gsap.fromTo(el,{opacity:0,y:40},{opacity:1,y:0,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true}})
        })
        gsap.fromTo('.hero-animate',{opacity:0,y:30},{opacity:1,y:0,duration:0.9,ease:'power3.out',stagger:0.12,delay:0.2})
      }, mainRef)
      return () => { ctx.revert(); window.removeEventListener('scroll', handleScroll) }
    }
    document.querySelectorAll('.reveal,.hero-animate').forEach(el => { el.style.opacity='1'; el.style.transform='none' })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const heroCta = LAUNCHED ? (
    <>
      {nextFounderNumber != null && (
        <span className="micro-text" style={{marginTop:'0.25rem',color:'var(--yapper-green)',fontWeight:600}}>
          Be Founder #{nextFounderNumber} · only 1,000 ever
        </span>
      )}
      <a href="#founders" className="btn-primary">Become a Founder - €67</a>
      <a href={PLAY_STORE} className="btn-secondary" target="_blank" rel="noopener noreferrer">Try Free for 7 Days</a>
      <span className="micro-text">Or start a free 7-day trial on Google Play · From €2.99/month or €19.99/year · Coming soon to Samsung Galaxy Store</span>
      <a href={DISCORD} className="secondary-link" target="_blank" rel="noopener noreferrer">Join the Discord →</a>
    </>
  ) : (
    <>
      <span className="micro-text">Not in the app stores yet. Founders get access first.</span>
      {nextFounderNumber != null && (
        <span className="micro-text" style={{marginTop:'0.25rem',color:'var(--yapper-green)',fontWeight:600}}>
          Be Founder #{nextFounderNumber} · only 1,000 ever
        </span>
      )}
      <a href="#founders" className="btn-primary">Become a Founder - €67</a>
      <a href={DISCORD} className="secondary-link" target="_blank" rel="noopener noreferrer">Join the Discord →</a>
    </>
  )

  const pBtn = (label) => (
    LAUNCHED
      ? <a href={PLAY_STORE} className="btn-primary" style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">{label}</a>
      : <a href="#waitlist" className="btn-primary" style={{width:'100%',justifyContent:'center'}}>Start free when we launch</a>
  )

  return (
    <div ref={mainRef}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="noise-overlay" aria-hidden="true" />
      <svg className="lotus-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><symbol id="lotus" viewBox="0 0 176 158"><path fillRule="evenodd" d="M86.12 2.60C90.78 0.04 94.49 7.60 90.20 9.63C85.07 12.06 81.54 5.11 86.12 2.60ZM88.04 20.37C98.74 31.74 106.95 41.86 113.42 56.22C118.45 49.48 123.97 43.02 128.38 35.85C130.46 32.47 132.14 28.82 133.88 25.25C141.64 39.85 147.59 55.64 145.80 72.50C145.41 76.10 144.35 79.72 143.52 83.23C152.47 74.28 160.35 65.87 165.60 54.15C166.94 51.15 167.93 48.08 168.99 44.99C171.19 52.39 173.19 59.77 173.79 67.50C174.18 72.51 173.87 77.55 173.22 82.51C169.53 110.77 150.68 131.80 125.90 144.42C113.86 150.56 99.09 155.48 85.50 155.07C75.50 154.77 59.27 148.90 50.26 144.27C24.89 131.21 5.71 109.74 2.72 80.50C2.31 76.51 1.98 72.54 2.25 68.51C2.79 60.57 4.82 53.02 6.96 45.39C8.63 49.70 10.22 54.03 12.41 58.11C17.62 67.84 25.26 75.65 32.76 83.61C31.75 79.29 30.61 74.93 30.27 70.49C29.43 59.37 32.09 47.99 36.27 37.74C38.00 33.49 40.13 29.39 42.11 25.27C44.41 29.89 46.70 34.56 49.64 38.83C53.75 44.79 58.36 50.42 62.75 56.16C69.21 41.98 77.49 31.67 88.04 20.37ZM88.11 27.62C74.56 43.46 61.57 59.15 64.74 81.53C65.69 88.24 67.85 94.47 71.03 100.46C73.88 105.82 77.47 110.65 80.79 115.71C83.56 119.92 85.82 124.36 88.10 128.84C90.07 124.78 92.10 120.84 94.53 117.03C97.77 111.96 101.53 107.23 104.45 101.96C116.92 79.46 113.12 60.10 98.42 40.11C95.23 35.76 91.60 31.73 88.11 27.62ZM41.97 35.92C40.30 40.44 38.48 45.00 37.25 49.66C32.72 66.86 34.67 83.38 46.10 97.36C48.34 100.10 50.96 102.57 53.56 104.95C60.90 111.66 69.01 117.41 75.43 125.10C80.12 130.72 82.94 135.93 86.28 142.39C85.55 138.49 85.05 134.56 83.58 130.87C81.15 124.74 77.21 119.36 73.55 113.93C68.56 106.56 63.72 98.90 61.38 90.21C59.92 84.79 59.05 79.12 59.16 73.50C59.22 70.82 59.58 68.14 60.03 65.50C60.19 64.54 60.64 63.41 60.63 62.43C60.63 61.69 60.61 61.84 60.33 61.17C59.88 60.08 56.51 56.15 55.58 54.90C50.94 48.63 46.29 42.41 41.97 35.92ZM134.12 35.85C130.89 40.80 127.54 45.66 123.92 50.38C121.75 53.21 119.56 56.03 117.41 58.88C116.88 59.59 116.00 60.34 115.67 61.17C115.41 61.81 115.39 61.69 115.39 62.40C115.39 63.10 115.74 63.85 115.86 64.54C116.16 66.19 116.48 67.90 116.69 69.57C117.00 72.18 117.03 74.87 116.94 77.50C116.77 82.87 115.61 88.31 113.82 93.37C112.16 98.07 109.98 102.61 107.39 106.87C101.88 115.93 92.60 125.78 91.01 136.50C91.00 136.59 90.76 138.41 90.79 138.50C91.03 138.82 91.26 139.13 91.50 139.45C96.28 129.91 102.64 122.17 110.67 115.14C114.05 112.19 117.62 109.46 120.99 106.49C124.68 103.23 128.39 99.79 131.38 95.85C141.98 81.83 143.21 65.34 138.69 48.73C137.49 44.33 135.75 40.09 134.12 35.85ZM8.06 60.36C7.18 66.38 6.69 72.40 7.24 78.49C10.03 108.90 31.56 131.16 58.65 142.83C67.03 146.44 75.75 148.48 84.57 150.62C78.26 136.29 73.30 128.46 61.39 118.09C57.30 114.52 52.97 111.21 49.02 107.48C46.62 105.22 44.23 102.86 42.13 100.33C40.62 98.52 39.35 96.49 37.72 94.78C34.82 91.71 31.49 88.99 28.48 86.02C22.92 80.55 17.54 74.80 13.05 68.40C11.24 65.82 9.67 63.07 8.06 60.36ZM168.24 60.07C166.67 62.69 165.13 65.37 163.42 67.90C159.31 73.97 154.26 79.41 149.07 84.57C146.73 86.90 144.35 89.19 141.93 91.44C140.74 92.56 139.43 93.60 138.32 94.80C136.86 96.38 135.78 98.25 134.44 99.91C132.37 102.46 129.99 104.84 127.61 107.10C123.15 111.35 118.22 115.02 113.61 119.09C102.51 128.89 97.41 137.09 91.66 150.59C97.95 149.20 104.22 147.89 110.33 145.76C136.85 136.50 161.86 116.06 167.68 87.31C169.51 78.27 169.24 69.19 168.24 60.07Z"/></symbol></svg>
      {lightboxSrc && <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}><img src={lightboxSrc} alt="Enlarged screenshot" /></div>}
      <CallTypeModal type={activeCallType} onClose={() => setActiveCallType(null)} />
      <GiftModal open={giftOpen} onClose={() => setGiftOpen(false)} />

      {/* ═══ ORIGINALS BANNER ═══ */}
      <div className={`originals-banner ${bannerVisible ? '' : 'hidden'}`} role="banner">
        <span>
          🟢 YAPPER FOUNDERS: {nextFounderNumber != null
            ? `be #${nextFounderNumber} of the first 1,000 · Lifetime €67`
            : 'First 1,000. Lifetime access. €67.'}{LAUNCHED ? ' · Live on Google Play now' : ' Now.'}
        </span>
        <a href="#founders">Learn More ↓</a>
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className={`navbar ${navScrolled ? 'scrolled' : 'transparent'} ${bannerVisible ? '' : 'banner-hidden'}`} aria-label="Main navigation">
        <a href="#" className="navbar-logo">
          <img src="/yapper_logo.svg" alt="Yapper Phone" width="28" height="28" style={{background:'none'}} />
          <span>Yapper Phone</span>
        </a>
        <ul className="navbar-links">
          <li><a href="/features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li>
            <a href="/gift"
               onClick={(e) => { e.preventDefault(); setGiftOpen(true) }}>
              Gift
            </a>
          </li>
          <li><a href="#mission">Mission</a></li>
        </ul>
        {LAUNCHED
          ? <a href={PLAY_STORE} className="navbar-cta" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="#founders" className="navbar-cta">Get Yapper</a>}
        <button
          type="button"
          className="navbar-hamburger"
          aria-label="Open menu"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setMobileNavOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>
      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        ctaHref={LAUNCHED ? PLAY_STORE : '#founders'}
        ctaLabel={LAUNCHED ? 'Try Free' : 'Get Yapper'}
        ctaExternal={LAUNCHED}
      />

      {/* ═══ 1. HERO ═══ */}
      <div className="hero-wrapper">
        <section className="hero" id="main-content">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-headline hero-animate" style={{opacity:0}}>The first phone call app built for how <span className="accent">your brain</span> actually works.</h1>
              <p className="hero-sub hero-animate" style={{opacity:0}}>You know that feeling when a call goes 40 minutes and you had no idea? Or when you can't figure out how to end it? <strong>That's not a character flaw.</strong> Your phone was never designed for your brain. Yapper Phone was.</p>
              <p className="hero-category hero-animate" style={{opacity:0}}>The world's first Health Communications Technology app.</p>
              <div className="hero-cta-group hero-animate" style={{opacity:0}}>{heroCta}</div>
            </div>
            <div className="hero-phone hero-animate" style={{opacity:0}}>
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-in-call.jpg')}><img src="/screenshot-in-call.jpg" alt="Yapper Phone in-call screen showing countdown timer at 04:08 with 6 seconds elapsed, green Connected status and agenda topic" loading="eager" /></div>
            </div>
          </div>
          <div className="scroll-indicator" aria-hidden="true"><span>SCROLL</span><div className="scroll-chevron" /></div>
        </section>

        {/* ═══ 2. CHARACTER STRIP ═══ */}
        <div style={{padding:'0 0 1.5rem 0'}}>
          <div className="character-strip" aria-label="Yapper character mascots">
            <div className="character-track">
              {[...characters,...characters].map((c,i) => <img key={i} src={`/${c}.png`} alt="" loading="lazy" />)}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 3. THE PROBLEM ═══ */}
      <section className="section section-light" id="problem">
        <div className="section-inner">
          <div className="problem-text reveal">
            <p className="lead">For 150 years, the phone call has been built for the average brain.</p>
            <p className="stats">70% of young adults feel anxious when the phone rings. One in four UK adults under 35 have never answered a call to their mobile. One in five people worldwide are neurodivergent. The average brain is a myth.</p>
            <p className="bridge">Yapper Phone is the first phone call redesigned for how humans actually think, feel, and communicate.</p>
          </div>
          <TrustBar className="reveal" />
        </div>
      </section>

      {/* ═══ 4. THREE KILLER FEATURES ═══ */}
      <section className="section section-darker" id="features">
        <div className="section-inner">
          <h2 className="section-heading reveal" style={{marginBottom:'1rem'}}>Three things no other phone does.</h2>

          {/* Feature 1: Time-Bound Calls + Consent Innovation */}
          <div className="killer-feature reveal">
            <div className="killer-feature-text">
              <span className="feature-icon">⏱</span>
              <h3>Set the time before the call starts.</h3>
              <p>For the first time in the history of the telephone, both people agree before the call begins. How long. What it's about. When it ends. A shared countdown on both phones, colour-coded from green to orange to red. When time's up, both of you know. No awkward endings. No time blindness. No guilt.</p>
              <p className="feature-closer">This is bilateral duration negotiation, and no phone on Earth has ever done it.</p>
            </div>
            <div className="killer-feature-screens">
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-setup.jpg')}><img src="/screenshot-setup.jpg" alt="Yapper pre-call setup showing duration picker" loading="lazy" /></div>
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-agenda.jpg')}><img src="/screenshot-agenda.jpg" alt="Yapper in-call screen showing timer counting down" loading="lazy" /></div>
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-incoming.jpg')}><img src="/screenshot-incoming.jpg" alt="Yapper incoming call screen showing duration options" loading="lazy" /></div>
            </div>
          </div>

          {/* Feature 2: Focus Audio & Time Signals */}
          <div className="killer-feature reverse reveal">
            <div className="killer-feature-text">
              <span className="feature-icon">🎧</span>
              <h3>Focus audio and time signals, right in your call.</h3>
              <p>Brown, white or pink noise, rain, ocean or forest: mixed directly into your phone call and playing system-wide. Soft chimes at intervals you choose, from 10 seconds to 30 minutes. Reduce sensory overload. Think clearly. Stay present. No other phone app on Earth does this. It requires system dialer privileges that Yapper Phone has.</p>
            </div>
            <div className="killer-feature-screens">
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-menu-floating.jpg')}><img src="/screenshot-menu-floating.jpg" alt="Yapper Phone menu showing Focus Sound and Time Signal controls" loading="lazy" /></div>
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-focus-overlay.jpg')}><img src="/screenshot-focus-overlay.jpg" alt="Focus Sound overlay with brown noise, white noise, pink noise, rain, ocean waves, forest sounds, Time Signal interval slider, and Social Media Break controls" loading="lazy" /></div>
            </div>
          </div>

          {/* Feature 3: Emergency */}
          <div className="killer-feature reveal">
            <div className="killer-feature-text">
              <span className="feature-icon">🆘</span>
              <h3>Emergency calls always get through.</h3>
              <p>ICE bypass. Lock screen emergency info card with your medical conditions, medications, blood type, and emergency contacts. One tap, no passcode needed. Bidirectional: your emergency contacts can reach you through silent mode too. Available with any active subscription or trial.</p>
              <p style={{marginTop:'0.75rem',color:'var(--text-primary)',fontWeight:600,fontSize:'0.95rem'}}>When it matters most, getting through matters most: no passcode, no fumbling, no barriers.</p>
            </div>
            <div className="killer-feature-screens">
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-emergency-info.jpg')}><img src="/screenshot-emergency-info.jpg" alt="Yapper Emergency Info screen" loading="lazy" /></div>
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-emergency-lockscreen.jpg')}><img src="/screenshot-emergency-lockscreen.jpg" alt="Yapper lock screen emergency notification" loading="lazy" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. SIX CALL TYPES GRID ═══ */}
      <section className="section section-dark">
        <div className="section-inner">
          <h2 className="section-heading reveal">Every call has an intention.<br/><span style={{color:'var(--text-secondary)',fontWeight:400,fontSize:'0.7em'}}>Now your phone knows it too.</span></h2>
          <div className="calltype-grid reveal">
            {CALL_TYPES.map((ct, i) => (
              <CallTypeCard key={i} type={ct} onClick={() => setActiveCallType(ct)} />
            ))}
          </div>
          <div className="features-link reveal">
            <p style={{textAlign:'center',marginTop:'2rem'}}>
              <span style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.1rem',color:'var(--text-primary)'}}>45 features. 6 call types. </span>
              <span style={{color:'var(--text-secondary)',fontSize:'1rem'}}>This is just the start.</span>
            </p>
            <p style={{textAlign:'center',marginTop:'0.75rem'}}>
              <a href="/features" className="btn-secondary" style={{fontSize:'0.9rem',padding:'0.6rem 1.5rem'}}>See all features →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 6. TESTIMONIALS (before pricing) ═══ */}
      <section className="section section-darker">
        <div className="section-inner">
          <h2 className="testimonials-heading reveal">Real calls. Real people.</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card reveal">
              <div className="testimonial-quote">{"\"My dad was one of the first people to test Yapper Phone. In the Finnish winter, he never answers his phone on walks. His fingers freeze. The first time I called him with Yapper, I scrolled the timer to 20 seconds. He looked at his phone, saw '20 seconds,' and picked up. I asked my question, he answered, and then he gave me a quick review of the app right there in the snow. Five stars! And we ended in time.\""}</div>
              <div className="testimonial-author"><span className="testimonial-name">Janne Vakkilainen</span><span className="testimonial-role">Founder, Yapper Phone</span></div>
            </div>
            <div className="testimonial-card reveal">
              <div className="testimonial-quote">{"\"First I started using the Focus Sound during calls. Then I tried the Time Signal. Now I play system-wide brown noise and a one-minute time signal all day while I'm working. Once a minute I'm reminded, 'oh, that was a minute,' and my days feel longer. When I hear the chime it pulls me out of a daydream, a total sidequest rabbit hole, or a procrastination freeze. I've started managing my time better. It's actually a relief. Pretty amazing.\""}</div>
              <div className="testimonial-author"><span className="testimonial-name">ADHD</span><span className="testimonial-role">Beta tester</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. CURB-CUT ═══ */}
      <section className="section section-light">
        <div className="section-inner curb-cut-section reveal">
          <h2>Designed for neurodivergent brains. Better for every brain.</h2>
          <p style={{maxWidth:640,margin:'0 auto 1.5rem',color:'var(--text-secondary)',fontSize:'1.05rem',lineHeight:1.7}}>When JPMorgan Chase designed roles for autistic employees, those employees were 90-140% more productive. When environments are built for the most demanding users, everyone performs better. This is the curb-cut effect, and Yapper applies it to the phone call.</p>
          <div className="curb-cut-examples">
            <div className="curb-example"><p className="designed">Designed for ADHD</p><p>{"Time-bound calls designed for ADHD time blindness? They also rescue every professional trapped on a calendar-wrecking \"quick call.\""}</p></div>
            <div className="curb-example"><p className="designed">Designed for caregivers</p><p>{"Emergency bypass designed for a diabetic child's caregiver? It gives every parent peace of mind."}</p></div>
            <div className="curb-example"><p className="designed">Designed for connection</p><p>{"A gentle nudge about friends you haven't called? That serves anyone whose life got too busy to keep up."}</p></div>
          </div>
          <p className="curb-cta">You don't need a diagnosis to need a better phone call.</p>
        </div>
      </section>

      {/* ═══ 8. ADHERENCE ═══ */}
      <section className="section section-dark adherence">
        <p className="line1 reveal">Other ADHD apps need you to remember to open them.</p>
        <p className="line2 reveal">Yapper works because eventually your phone rings.</p>
        <p className="micro reveal">Mental health apps have a median 15-day retention of 3.9%. Yapper Phone is built into the infrastructure your life already uses.</p>
      </section>

      {/* ═══ 9. ORIGINALS ═══ */}
      <section className="section section-darker" id="founders">
        <div className="section-inner originals-section reveal">
          <div className="originals-card">
            <div style={{display:'inline-block',background:'var(--yapper-green)',color:'var(--dark)',fontFamily:'var(--font-mono)',fontSize:'0.75rem',fontWeight:700,padding:'0.3rem 1rem',borderRadius:100,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'1rem'}}>
              {LAUNCHED ? 'Limited spots' : '🔥 Available now. Don\'t wait for launch'}
            </div>
            <h2>Yapper Founders</h2>
            <p className="originals-subtitle">The Founding 1,000</p>
            <p className="originals-price">€67 <span>one-time</span></p>
            {nextFounderNumber != null && (
              <p style={{
                margin:'0.5rem 0 1rem',
                fontFamily:'var(--font-mono)',
                fontSize:'0.85rem',
                color:'var(--yapper-green)',
                fontWeight:600,
                letterSpacing:'0.04em'
              }}>
                Be Founder #{nextFounderNumber} of 1,000
              </p>
            )}
            <p className="originals-desc">This is for the people who see what Yapper Phone is before the world catches up. The ones who know that phone calls needed this twenty years ago. The founding members who make the mission real.</p>
            <ul className="originals-perks">
              <li>Lifetime access: every feature, every update, forever</li>
              <li>Your name permanently displayed on the Founders screen inside the app</li>
              <li>Early access to every new feature before public release</li>
              <li>A founding role in building Health Communications Technology</li>
            </ul>
            <a href={FOUNDERS_STRIPE} className="btn-primary" target="_blank" rel="noopener noreferrer">Become a Founder - €67</a>
            <p style={{marginTop:'1rem',fontSize:'0.8rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>1,000 spots globally. When they're gone, they're gone.</p>
          </div>
        </div>
      </section>

      {/* ═══ 10. PRICING ═══ */}
      <section className="section section-dark" id="pricing">
        <div className="section-inner">
          <h2 className="section-heading reveal">Your phone call, finally on your terms.</h2>
          {!LAUNCHED && <p style={{textAlign:'center',color:'var(--text-secondary)',marginBottom:'2rem',fontSize:'0.95rem'}}>Yapper isn&apos;t in the app stores yet. <a href="#founders" style={{color:'var(--yapper-green)'}}>Become a Founder</a> for access today, or join the <a href="#waitlist" style={{color:'var(--yapper-green)'}}>waitlist</a> for free access at launch.</p>}
          <div className="pricing-grid two-col">
            <div className="pricing-card reveal">
              <span className="pricing-badge secondary">Great Value</span>
              <h3>Monthly</h3>
              <p className="pricing-amount">€2.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/mo</span></p>
              <p className="pricing-period">Cancel anytime</p>
              <ul className="pricing-features"><li>All 45 features</li><li>All six call types</li><li>ICE Emergency included</li><li>7-day free trial</li></ul>
              {pBtn('Try Free')}
            </div>
            <div className="pricing-card featured reveal">
              <span className="pricing-badge">Best Value</span>
              <h3>Annual</h3>
              <p className="pricing-amount">€19.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/year</span></p>
              <p className="pricing-period">€1.67/month · Save 44%</p>
              <ul className="pricing-features"><li>All 45 features</li><li>All six call types</li><li>ICE Emergency included</li><li>7-day free trial</li></ul>
              {pBtn('Try Free')}
            </div>
          </div>
          <p className="pricing-ice-note reveal">ICE emergency features included with all active subscriptions, active trials, and Yapper Founders.</p>
          <p className="reveal" style={{textAlign:'center',marginTop:'0.75rem',fontSize:'0.8rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>Subscriptions are billed through Google Play in 176 countries. Your local price is shown there. Founders is a one-time €67, charged in EUR.</p>
        </div>
      </section>

      {/* ═══ 11. GIFT (compact) ═══ */}
      <section className="section section-darker" id="gift">
        <div className="section-inner" style={{textAlign:'center'}}>
          <h2 className="section-heading reveal">Give someone a phone call that finally works.</h2>
          <div className="gift-compact reveal">
            <div className="gift-painting-wrap" style={{maxWidth:400,margin:'0 auto 2rem'}}>
              <img src="/wilda-painting.webp" alt="Sydämiä ja Tähdenlentoja - Hearts and Shooting Stars" loading="lazy" />
              <div className="gift-painting-caption">
                <div className="gift-painting-title">Sydämiä ja Tähdenlentoja</div>
                <div className="gift-painting-subtitle">Hearts and Shooting Stars</div>
                <div className="gift-painting-credit">by Wilda Vakkilainen, age 5 · 2023</div>
              </div>
            </div>
            <p style={{color:'var(--text-secondary)',fontSize:'1rem',maxWidth:480,margin:'0 auto 1.5rem',lineHeight:1.7}}>Gift Yapper to someone you care about: a month, a year, or a lifetime Founder spot. They redeem the code in the app.</p>
            <button className="btn-secondary" onClick={() => setGiftOpen(true)}>Gift Yapper →</button>
          </div>
        </div>
      </section>

      {/* ═══ 12. MISSION (compressed) ═══ */}
      <section className="section section-dark" id="mission">
        <div className="section-inner mission-text reveal">
          <div className="institute-block">
            <svg aria-hidden="true" focusable="false"><use href="#lotus"/></svg>
            <p className="inst"><strong>Institute for The Study Of Humanity</strong>A research initiative of Maximized Impact ry, a Finnish registered association. Helsinki.</p>
          </div>
          <p style={{textAlign:'center',fontSize:'0.95rem',color:'var(--yapper-green)',fontFamily:'var(--font-display)',fontWeight:600,marginBottom:'2rem'}}>We offer free lifetime access to Yapper Phone to all Finnish Type 1 diabetics. How to claim it will be announced.</p>
          <p className="mission-body">A substantial portion of all profits from Yapper Phone permanently funds the Institute for The Study Of Humanity, a research initiative of Maximized Impact ry, a Finnish registered association. We build and finance our think tank with our own inventions.</p>
          <p className="mission-stats">A single USPTO provisional patent application containing 667+ innovation disclosures, filed February 27, 2026. Four out of five already implemented in working code. The rest map the road ahead. 45 shipping features. Built by one person using Claude in eight months, at a total cost of ~€15,400.</p>
          <p className="mission-stats">The category is defined in the Institute&apos;s first publication, <a href="https://doi.org/10.5281/zenodo.21978705" target="_blank" rel="noopener noreferrer" style={{color:'var(--yapper-green)'}}>The Case for Health Communications Technology</a> (Version 1.0, August 2026, DOI 10.5281/zenodo.21978705). Research: <a href="https://research.maximized-impact.org/" target="_blank" rel="noopener noreferrer" style={{color:'var(--yapper-green)'}}>research.maximized-impact.org</a>.</p>
          <p className="mission-closer">Purpose should pay. Martyrdom kills missions.</p>
          <p className="mission-pillars">NO EXIT · NO INVESTORS · NO CORPORATE CAPTURE · NO MARTYRDOM</p>
        </div>
      </section>

      {/* ═══ 13. FAQ ═══ */}
      <FAQAccordion />

      {/* ═══ 14. FINAL CTA + TRUST BAR ═══ */}
      <section id="waitlist" className="section section-dark trust-section">
        <div className="section-inner reveal">
          <h2 className="trust-headline">Your phone call, finally on your terms.</h2>
          <div style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap',alignItems:'center'}}>
            {LAUNCHED
              ? <><a href="#founders" className="btn-primary">Become a Founder - €67</a><a href={PLAY_STORE} className="btn-secondary" target="_blank" rel="noopener noreferrer">Try Free for 7 Days</a></>
              : <><a href={FOUNDERS_STRIPE} className="btn-primary" target="_blank" rel="noopener noreferrer">Become a Founder - €67</a><a href={DISCORD} className="btn-secondary" target="_blank" rel="noopener noreferrer">Join the Discord</a></>}
          </div>
          <p style={{textAlign:'center',marginTop:'0.75rem',fontSize:'0.8rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{LAUNCHED ? 'Free 7-day trial · Cancel anytime · From €2.99/month or €19.99/year, or become a Founder for €67 lifetime · Coming soon to Samsung Galaxy Store' : 'Not in the app stores yet. Founders get access first. €67 one-time, charged in EUR.'}</p>
          {!LAUNCHED && (
            <div style={{maxWidth:460,margin:'2.25rem auto 0',textAlign:'center'}}>
              <p style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.05rem',color:'var(--text-primary)',marginBottom:'0.4rem'}}>Not ready to found? Be first to know.</p>
              <p style={{color:'var(--text-secondary)',fontSize:'0.9rem',marginBottom:'1rem'}}>Get free access the day Yapper launches, and follow the build along the way.</p>
              <WaitlistForm />
              <p style={{marginTop:'0.85rem',fontSize:'0.85rem',color:'var(--text-secondary)'}}>or <a href={DISCORD} target="_blank" rel="noopener noreferrer" style={{color:'var(--yapper-green)'}}>join the Discord →</a></p>
            </div>
          )}
          <div className="trust-bar">
            <span className="trust-item">🇫🇮 Built in Finland</span>
            <span className="trust-item">📱 29 languages</span>
            <span className="trust-item">🔒 All data on your device</span>
            <span className="trust-item">📋 667+ innovation disclosures, one USPTO provisional patent application</span>
          </div>
        </div>
      </section>

      {/* ═══ 15. FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}><img src="/yapper_logo.svg" alt="" width="24" height="24" style={{background:'none'}} /><h4 style={{margin:0}}>Yapper Phone</h4></div>
            <p>Health Communications Technology: a category invented by Yapper.</p>
            <p style={{marginTop:'0.5rem'}}>© 2026 SUPER SINCE BIRTH</p>
          </div>
          <div>
            <h5>Product</h5>
            <ul className="footer-links"><li><a href="/features">Features</a></li><li><a href="#pricing">Pricing</a></li><li><a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">Google Play</a></li></ul>
          </div>
          <div>
            <h5>Community</h5>
            <ul className="footer-links"><li><a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a></li><li><a href="https://instagram.com/yapperphone" target="_blank" rel="noopener noreferrer">Instagram</a></li><li><a href="https://tiktok.com/@yapperphone" target="_blank" rel="noopener noreferrer">TikTok</a></li></ul>
            <h5 style={{marginTop:'1.5rem'}}>Legal</h5>
            <ul className="footer-links"><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li><li><a href="/legal">Legal Information</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-status"><span className="status-dot" /> System Operational</div>
          <p>Institute for The Study Of Humanity, a research initiative of Maximized Impact ry, a Finnish registered association</p>
          <p>One USPTO provisional patent application · 667+ innovation disclosures · February 27, 2026</p>
          <p style={{marginTop:'0.5rem'}}><a href="mailto:janne@maximized-impact.org" style={{color:'var(--text-muted)'}}>janne@maximized-impact.org</a></p>
        </div>
      </footer>

      {/* ═══ SMART STICKY CTA ═══ */}
      {/* During the dual-state launch window, the sticky CTA pushes Founders
          (the scarce offer); Try Free is reachable from the hero/footer/navbar. */}
      <div className={`sticky-cta ${stickyCta ? 'active' : ''} ${stickyVisible ? 'visible' : ''}`}>
        <a href="#founders" className="btn-primary">Become a Founder - €67</a>
        <span className="price-hint">{LAUNCHED ? 'Lifetime · Live on Google Play' : 'Lifetime access · €67'}</span>
      </div>
    </div>
  )
}
