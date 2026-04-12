import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createGiftCheckout } from './firebase'
import FeaturesPage from './FeaturesPage'

gsap.registerPlugin(ScrollTrigger)

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.yapperphone.app'
const SAMSUNG_STORE = 'https://galaxystore.samsung.com/detail/com.yapperphone.app'
const ORIGINALS_STRIPE = 'https://buy.stripe.com/test_cNi9ATdiVcBu0gjfQp8g000'
const DISCORD = 'https://discord.gg/yapperphone'
const LAUNCH_DATE = new Date('2026-04-16T09:00:00+03:00')

const characters = [
  'yapper-bud','yapper-jade','yapper-sam','yapper-nami',
  'yapper-beathead','yapper-mala','yapper-elwood','yapper-frank',
  'yapper-robert','yapper-shawn','yapper-pierre','yapper-rick',
  'yapper-twain','yapper-louise','yapper-karen','yapper-gabe',
  'yapper-ben','yapper-fred','yapper-tyson'
]

const FAQ_ITEMS = [
  { q: 'Does the other person need Yapper?', a: 'No. You can call anyone — Yapper works with any phone number. When you call someone who also has Yapper, you unlock bilateral features like shared countdown timers, duration negotiation, and agenda topics visible on both screens. Calls to non-Yapper numbers still work as normal phone calls with your own timer running.' },
  { q: 'Does Yapper replace my phone app?', a: 'Yes — Yapper is a full dialer replacement. It handles all your calls, contacts, and call history. You set it as your default phone app during setup. Everything your stock dialer does, Yapper does — plus time-bound calls, focus audio, ICE emergency bypass, and everything else.' },
  { q: 'What happens when the timer ends?', a: 'A gentle chime plays for both people. The call doesn\'t cut off — you get a clear signal that the agreed time is up, and either person can end naturally. No awkward "I have to go" needed. The timer gave you both permission to wrap up.' },
  { q: 'Is my data safe?', a: 'All data stays on your device. Call recordings are stored locally. Analytics are processed on-device. There is no cloud upload without your explicit action. Yapper doesn\'t sell data, serve ads, or share your information with anyone.' },
  { q: 'What about iOS / iPhone?', a: 'Yapper Phone is Android-only at launch (Google Play and Samsung Galaxy Store). iOS deployment requires Apple to open telephony APIs to third-party apps — something we\'re actively advocating for through accessibility and regulatory channels.' },
  { q: 'Do ICE emergency features require a subscription?', a: 'Yes — ICE Emergency calls, ICE Checkup calls, and the lockscreen emergency info card require an active subscription, an active free trial, or Yapper Originals lifetime access. The 7-day free trial includes all ICE features.' },
]

const CALL_TYPES = [
  { name: 'Standard', emoji: '📞', color: '#00C853', desc: 'The everyday call with time awareness built in. Duration negotiation, countdown timer, all core features active.' },
  { name: 'Body Double', emoji: '🤝', color: '#7B1FA2', desc: 'ADHD accountability sessions. Not a conversation — a passive co-presence session for task activation. Clinically documented.' },
  { name: 'Agenda', emoji: '📋', color: '#2196F3', desc: 'Both people see the topic before anyone answers. Write a short agenda — it sits under the timer the entire call.' },
  { name: 'ICE Emergency', emoji: '🆘', color: '#E53935', desc: 'Life-critical calls. Bypasses silent mode, Do Not Disturb, and all restrictions. Maximum volume. GPS + SMS transmission.' },
  { name: 'ICE Checkup', emoji: '🩺', color: '#F57C00', desc: 'If you\'ve set someone as your ICE contact, they can reach you with a Checkup call that bypasses silent mode and Do Not Disturb — when they suspect danger or have a reason to worry. Your safety net, even when your phone is on mute.' },
  { name: 'Custom', emoji: '🎨', color: '#00BCD4', desc: 'Set any duration down to the second. For calls that don\'t fit a label. The interface is yours to configure.' },
]

function useCountdown(target) {
  const [r, setR] = useState({days:0,hours:0,minutes:0,seconds:0,launched:false})
  useEffect(() => {
    const tick = () => {
      const d = target - Date.now()
      if (d <= 0) { setR({days:0,hours:0,minutes:0,seconds:0,launched:true}); return }
      setR({days:Math.floor(d/864e5),hours:Math.floor(d%864e5/36e5),minutes:Math.floor(d%36e5/6e4),seconds:Math.floor(d%6e4/1e3),launched:false})
    }
    tick(); const id = setInterval(tick,1000); return () => clearInterval(id)
  },[target])
  return r
}

function Countdown({cd}) {
  if (cd.launched) return null
  return (
    <div style={{display:'flex',gap:12,justifyContent:'center',margin:'1.5rem 0',fontFamily:'var(--font-mono)',fontSize:'0.85rem',color:'var(--text-secondary)'}}>
      {[['days',cd.days],['hrs',cd.hours],['min',cd.minutes],['sec',cd.seconds]].map(([l,v]) => (
        <div key={l} style={{textAlign:'center'}}>
          <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.8rem',color:'var(--yapper-green)',lineHeight:1,minWidth:48}}>{String(v).padStart(2,'0')}</div>
          <div style={{fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:2,marginTop:4}}>{l}</div>
        </div>
      ))}
    </div>
  )
}

function TrustBar({className}) {
  return (
    <div className={`trust-bar-inline ${className || ''}`}>
      <span className="trust-item-inline">🇫🇮 Built in Finland</span>
      <span className="trust-item-inline">📱 29 languages</span>
      <span className="trust-item-inline">🔒 All data on your device</span>
      <span className="trust-item-inline">📋 667+ USPTO provisional patent applications</span>
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

function GiftModal({open, onClose, cd}) {
  const [tier, setTier] = useState('annual')
  const [months, setMonths] = useState(1)
  const [form, setForm] = useState({gifterName:'',gifterEmail:'',recipientName:'',recipientEmail:'',message:''})
  const [loading, setLoading] = useState(false)
  const monthlyTotal = (2.99 * months).toFixed(2)

  const handleSubmit = async (e) => {
    e.preventDefault()
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
            <div className="gift-tier-detail">{months} month{months > 1 ? 's' : ''} of Pro</div>
            <div className="gift-months-selector">
              {[1,3,6].map(m => (
                <button key={m} className={`gift-month-btn ${months === m ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setMonths(m) }}>{m}mo</button>
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
            <h4>Gift Originals</h4>
            <div className="gift-tier-price">€67</div>
            <div className="gift-tier-detail">Lifetime Pro · Forever</div>
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
          <div className="gift-input-group"><label>Personal message (optional)</label><textarea maxLength={200} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="I found something that helps me with phone calls. I want you to have it too." /></div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',border:'none'}} disabled={loading}>
            {loading ? 'Preparing checkout...' : `Send Gift${tier === 'monthly' ? ` — €${monthlyTotal}` : tier === 'annual' ? ' — €19.99' : ' — €67'}`}
          </button>
          <div className="gift-trust"><span>🔒 Secure payment via Stripe</span><span>📨 Gift delivered instantly by email</span><span>🇫🇮 Built in Finland</span></div>
        </form>
      </div>
    </div>
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
  return <LandingPage />
}

export default AppRouter

function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [stickyCta, setStickyCta] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [activeCallType, setActiveCallType] = useState(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const mainRef = useRef(null)
  const scrollTimer = useRef(null)
  const cd = useCountdown(LAUNCH_DATE)

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

  const heroCta = cd.launched ? (
    <>
      <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free for 7 Days</a>
      <a href={SAMSUNG_STORE} className="secondary-link" target="_blank" rel="noopener noreferrer">Also on Samsung Galaxy Store →</a>
      <span className="micro-text">7-day free trial · Cancel anytime · €2.99/month</span>
    </>
  ) : (
    <>
      <Countdown cd={cd} />
      <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Pre-register on Google Play</a>
      <a href={SAMSUNG_STORE} className="secondary-link" target="_blank" rel="noopener noreferrer">Coming to Samsung Galaxy Store →</a>
      <span className="micro-text">Launching April 16 · €2.99/month · 7-day free trial</span>
    </>
  )

  const pBtn = (label) => (
    cd.launched
      ? <a href={PLAY_STORE} className="btn-primary" style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">{label}</a>
      : <a href={PLAY_STORE} className="btn-primary" style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">Pre-register April 16</a>
  )

  return (
    <div ref={mainRef}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="noise-overlay" aria-hidden="true" />
      {lightboxSrc && <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}><img src={lightboxSrc} alt="Enlarged screenshot" /></div>}
      <CallTypeModal type={activeCallType} onClose={() => setActiveCallType(null)} />
      <GiftModal open={giftOpen} onClose={() => setGiftOpen(false)} cd={cd} />

      {/* ═══ ORIGINALS BANNER ═══ */}
      <div className={`originals-banner ${bannerVisible ? '' : 'hidden'}`} role="banner">
        <span>🟢 YAPPER ORIGINALS — First 1,000. Lifetime Pro. €67.{!cd.launched && ' Now.'}</span>
        <a href="#originals">Learn More ↓</a>
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
          <li><a href="#mission">Mission</a></li>
        </ul>
        {cd.launched
          ? <a href={PLAY_STORE} className="navbar-cta" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="#originals" className="navbar-cta">Get Originals</a>}
      </nav>

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
              <p>For the first time in the history of the telephone, both people agree before the call begins. How long. What it's about. When it ends. A shared countdown on both phones — colour-coded from green to orange to red. When time's up, both of you know. No awkward endings. No time blindness. No guilt.</p>
              <p className="feature-closer">This is bilateral duration negotiation — and no phone on Earth has ever done it.</p>
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
              <p>Brown noise mixed directly into your phone call — and playing system-wide. Soft chimes at intervals you choose, from 10 seconds to 30 minutes. Reduce sensory overload. Think clearly. Stay present. No other phone app on Earth does this — it requires system dialer privileges that Yapper Phone has.</p>
            </div>
            <div className="killer-feature-screens">
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-menu-floating.jpg')}><img src="/screenshot-menu-floating.jpg" alt="Yapper Phone menu showing Focus Sound and Time Signal controls" loading="lazy" /></div>
            </div>
          </div>

          {/* Feature 3: Emergency */}
          <div className="killer-feature reveal">
            <div className="killer-feature-text">
              <span className="feature-icon">🆘</span>
              <h3>Emergency calls always get through.</h3>
              <p>ICE bypass. Lock screen emergency info card with your medical conditions, medications, blood type, and emergency contacts — one tap, no passcode needed. Bidirectional — your emergency contacts can reach you through silent mode too. Available with any active subscription or trial.</p>
              <p style={{marginTop:'0.75rem',color:'var(--text-primary)',fontWeight:600,fontSize:'0.95rem'}}>A dead phone isn't just an inconvenience. For some people, staying reachable is staying alive.</p>
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
              <span style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.1rem',color:'var(--text-primary)'}}>34 features. 6 call types. </span>
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
              <div className="testimonial-quote">{"\"My dad was one of the first people to test Yapper Phone. In the Finnish winter, he never answers his phone on walks — his fingers freeze. The first time I called him with Yapper, I scrolled the timer to 20 seconds. He looked at his phone, saw '20 seconds,' and picked up. I asked my question, he answered, and then he gave me a quick review of the app right there in the snow. Five stars! And we ended in time.\""}</div>
              <div className="testimonial-author"><span className="testimonial-name">Janne Vakkilainen</span><span className="testimonial-role">Founder, Yapper Phone</span></div>
            </div>
            <div className="testimonial-card reveal">
              <div className="testimonial-quote">{"\"I'm Type 1 diabetic and I live alone. My parents and I beta tested Yapper Phone together. One night I had a low sugar event and called my mom with an ICE call. She woke up — the alert bypassed everything. My parents stayed on the line, ready to call an ambulance if needed, while I ate to get my blood sugar back to a safe range. Afterwards we were relieved, talking about how Yapper Phone will save lives. It's a no-brainer.\""}</div>
              <div className="testimonial-author"><span className="testimonial-name">Finnish Type 1 diabetic</span><span className="testimonial-role">Beta tester</span></div>
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
          <p style={{maxWidth:640,margin:'0 auto 1.5rem',color:'var(--text-secondary)',fontSize:'1.05rem',lineHeight:1.7}}>When JPMorgan Chase designed roles for autistic employees, those employees were 90–140% more productive. When environments are built for the most demanding users, everyone performs better. This is the curb-cut effect — and Yapper applies it to the phone call.</p>
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
      <section className="section section-darker" id="originals">
        <div className="section-inner originals-section reveal">
          <div className="originals-card">
            <div style={{display:'inline-block',background:'var(--yapper-green)',color:'var(--dark)',fontFamily:'var(--font-mono)',fontSize:'0.75rem',fontWeight:700,padding:'0.3rem 1rem',borderRadius:100,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'1rem'}}>
              {cd.launched ? 'Limited spots' : '🔥 Available now — don\'t wait for launch'}
            </div>
            <h2>Yapper Originals</h2>
            <p className="originals-subtitle">The Founding 1,000</p>
            <p className="originals-price">€67 <span>one-time</span></p>
            <p className="originals-desc">This is for the people who see what Yapper Phone is before the world catches up. The ones who know that phone calls needed this twenty years ago. The founding members who make the mission real.</p>
            <ul className="originals-perks">
              <li>Lifetime Pro access — every feature, every update, forever</li>
              <li>Your name permanently displayed on the Founders screen inside the app</li>
              <li>Early access to every new feature before public release</li>
              <li>A founding role in building Health Communications Technology</li>
            </ul>
            <a href={ORIGINALS_STRIPE} className="btn-primary" target="_blank" rel="noopener noreferrer">Become a Yapper Original — €67</a>
            <p style={{marginTop:'1rem',fontSize:'0.8rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>1,000 spots globally. When they're gone, they're gone.</p>
          </div>
        </div>
      </section>

      {/* ═══ 10. PRICING ═══ */}
      <section className="section section-dark" id="pricing">
        <div className="section-inner">
          <h2 className="section-heading reveal">Your phone call, finally on your terms.</h2>
          {!cd.launched && <p style={{textAlign:'center',color:'var(--text-secondary)',marginBottom:'2rem',fontSize:'0.95rem'}}>Launching April 16. Pre-register now — or <a href="#originals" style={{color:'var(--yapper-green)'}}>grab Originals today</a>.</p>}
          <div className="pricing-grid">
            <div className="pricing-card reveal">
              <h3>Monthly</h3>
              <p className="pricing-amount">€2.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/mo</span></p>
              <p className="pricing-period">Cancel anytime</p>
              <ul className="pricing-features"><li>All 34 features</li><li>All six call types</li><li>ICE Emergency included</li><li>7-day free trial</li></ul>
              {pBtn('Try Free')}
            </div>
            <div className="pricing-card featured reveal">
              <span className="pricing-badge">Best Value</span>
              <h3>Annual</h3>
              <p className="pricing-amount">€19.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/year</span></p>
              <p className="pricing-period">€1.67/month · Save 44%</p>
              <ul className="pricing-features"><li>All 34 features</li><li>All six call types</li><li>ICE Emergency included</li><li>7-day free trial</li></ul>
              {pBtn('Try Free')}
            </div>
            <div className="pricing-card reveal">
              <h3>Originals</h3>
              <p className="pricing-amount">€67<span style={{fontSize:'0.9rem',fontWeight:400}}> once</span></p>
              <p className="pricing-period">Lifetime · 1,000 spots</p>
              <ul className="pricing-features"><li>All 34 features forever</li><li>Name in Founders credits</li><li>Early access to everything</li><li>All future features included</li></ul>
              <a href={ORIGINALS_STRIPE} className="btn-primary" style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">Get Originals</a>
            </div>
          </div>
          <p className="pricing-ice-note reveal">ICE emergency features included with all active subscriptions, active trials, and Yapper Originals.</p>
        </div>
      </section>

      {/* ═══ 11. GIFT (compact) ═══ */}
      <section className="section section-darker" id="gift">
        <div className="section-inner" style={{textAlign:'center'}}>
          <h2 className="section-heading reveal">Give someone a phone call that finally works.</h2>
          <div className="gift-compact reveal">
            <div className="gift-painting-wrap" style={{maxWidth:400,margin:'0 auto 2rem'}}>
              <img src="/wilda-painting.webp" alt="Sydämiä ja Tähdenlentoja — Hearts and Shooting Stars" loading="lazy" />
              <div className="gift-painting-caption">
                <div className="gift-painting-title">Sydämiä ja Tähdenlentoja</div>
                <div className="gift-painting-subtitle">Hearts and Shooting Stars</div>
                <div className="gift-painting-credit">by Wilda Vakkilainen, age 5 · 2023</div>
              </div>
            </div>
            <p style={{color:'var(--text-secondary)',fontSize:'1rem',maxWidth:480,margin:'0 auto 1.5rem',lineHeight:1.7}}>Gift a month of Yapper Pro to someone you care about. Every launch subscriber gets one free gift to share.</p>
            <button className="btn-secondary" onClick={() => setGiftOpen(true)}>Gift Yapper →</button>
          </div>
        </div>
      </section>

      {/* ═══ 12. MISSION (compressed) ═══ */}
      <section className="section section-dark" id="mission">
        <div className="section-inner mission-text reveal">
          <div style={{textAlign:'center',marginBottom:'2rem'}}><img src="/institute_logo_cropped.png" alt="Institute for The Study Of Humanity and Maximized Impact" style={{maxWidth:'380px',width:'100%',height:'auto',opacity:0.9}} /></div>
          <p style={{textAlign:'center',fontSize:'0.95rem',color:'var(--yapper-green)',fontFamily:'var(--font-display)',fontWeight:600,marginBottom:'2rem'}}>55,000 Finnish Type 1 diabetics receive free lifetime Pro access — a proof of our Institute's mission and integrity.</p>
          <p className="mission-body">A substantial portion of all profits from Yapper Phone funds the Institute for The Study Of Humanity and Maximized Impact — a Finnish registered research association. We build and finance our think tank with our own inventions.</p>
          <p className="mission-stats">667+ USPTO patent applications filed February 27, 2026. 34 shipping features. Built by one person using Claude at a total cost of ~€14K.</p>
          <p className="mission-closer">Purpose should pay. Martyrdom kills missions.</p>
          <p className="mission-pillars">NO EXIT · NO INVESTORS · NO CORPORATE CAPTURE · NO MARTYRDOM</p>
        </div>
      </section>

      {/* ═══ 13. FAQ ═══ */}
      <FAQAccordion />

      {/* ═══ 14. FINAL CTA + TRUST BAR ═══ */}
      <section className="section section-dark trust-section">
        <div className="section-inner reveal">
          <h2 className="trust-headline">Your phone call, finally on your terms.</h2>
          {!cd.launched && <Countdown cd={cd} />}
          <div style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap',alignItems:'center'}}>
            {cd.launched
              ? <><a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free for 7 Days</a><a href={SAMSUNG_STORE} className="btn-secondary" target="_blank" rel="noopener noreferrer">Samsung Galaxy Store</a></>
              : <><a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Pre-register on Google Play</a><a href="#originals" className="btn-secondary">Or get Originals now — €67</a></>}
          </div>
          <p style={{textAlign:'center',marginTop:'0.75rem',fontSize:'0.8rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{cd.launched ? '7-day free trial · Cancel anytime · €2.99/month' : 'Launching April 16, 2026 · €2.99/month · 7-day free trial'}</p>
          <div className="trust-bar">
            <span className="trust-item">🇫🇮 Built in Finland</span>
            <span className="trust-item">📱 29 languages</span>
            <span className="trust-item">🔒 All data on your device</span>
            <span className="trust-item">📋 667+ USPTO provisional patent applications</span>
          </div>
        </div>
      </section>

      {/* ═══ 15. FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}><img src="/yapper_logo.svg" alt="" width="24" height="24" style={{background:'none'}} /><h4 style={{margin:0}}>Yapper Phone</h4></div>
            <p>Health Communications Technology — a category invented by Yapper.</p>
            <p style={{marginTop:'0.5rem'}}>© 2026 SUPER SINCE BIRTH Tmi</p>
          </div>
          <div>
            <h5>Product</h5>
            <ul className="footer-links"><li><a href="/features">Features</a></li><li><a href="#pricing">Pricing</a></li><li><a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">Google Play</a></li><li><a href={SAMSUNG_STORE} target="_blank" rel="noopener noreferrer">Samsung Galaxy Store</a></li></ul>
          </div>
          <div>
            <h5>Community</h5>
            <ul className="footer-links"><li><a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a></li><li><a href="https://instagram.com/yapperphone" target="_blank" rel="noopener noreferrer">Instagram</a></li><li><a href="https://tiktok.com/@yapperphone" target="_blank" rel="noopener noreferrer">TikTok</a></li></ul>
            <h5 style={{marginTop:'1.5rem'}}>Legal</h5>
            <ul className="footer-links"><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-status"><span className="status-dot" /> System Operational</div>
          <p>Institute for The Study Of Humanity and Maximized Impact ry</p>
          <p>667+ USPTO Provisional Patent Applications · February 27, 2026</p>
          <p style={{marginTop:'0.5rem'}}><a href="mailto:janne@maximized-impact.org" style={{color:'var(--text-muted)'}}>janne@maximized-impact.org</a></p>
        </div>
      </footer>

      {/* ═══ SMART STICKY CTA ═══ */}
      <div className={`sticky-cta ${stickyCta ? 'active' : ''} ${stickyVisible ? 'visible' : ''}`}>
        {cd.launched
          ? <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="#originals" className="btn-primary">Get Originals — €67</a>}
        <span className="price-hint">{cd.launched ? '7-day trial · Cancel anytime' : 'Available now'}</span>
      </div>
    </div>
  )
}
