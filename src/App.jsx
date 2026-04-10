import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createGiftCheckout } from './firebase'

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

function GiftSection() {
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

  return (
    <section className="section section-dark gift-section" id="gift">
      <div className="section-inner">
        <div className="gift-painting-wrap reveal">
          <img src="/wilda-painting.webp" alt="Sydämiä ja Tähdenlentoja — abstract painting with hearts in red, green, and black, blue circles, and yellow sunbursts on white canvas" loading="lazy" />
          <div className="gift-painting-caption">
            <div className="gift-painting-title">Sydämiä ja Tähdenlentoja</div>
            <div className="gift-painting-subtitle">Hearts and Shooting Stars</div>
            <div className="gift-painting-credit">by Wilda Vakkilainen, age 4 · 2023</div>
            <div className="gift-painting-tagline">Yapper Phone was built for minds like hers.</div>
          </div>
        </div>
        <h2 className="gift-headline reveal">Give a Better Call</h2>
        <p className="gift-subheadline reveal">Give someone you love a phone call that finally works for their brain.</p>
        <div className="gift-tiers reveal">
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
        <form className="gift-form reveal" onSubmit={handleSubmit}>
          <div className="gift-form-row">
            <div className="gift-input-group">
              <label>Your name</label>
              <input type="text" required value={form.gifterName} onChange={e => setForm({...form, gifterName: e.target.value})} placeholder="Your name" />
            </div>
            <div className="gift-input-group">
              <label>Your email</label>
              <input type="email" required value={form.gifterEmail} onChange={e => setForm({...form, gifterEmail: e.target.value})} placeholder="you@email.com" />
            </div>
          </div>
          <div className="gift-form-row">
            <div className="gift-input-group">
              <label>{"Recipient's name"}</label>
              <input type="text" required value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})} placeholder="Their name" />
            </div>
            <div className="gift-input-group">
              <label>{"Recipient's email"}</label>
              <input type="email" required value={form.recipientEmail} onChange={e => setForm({...form, recipientEmail: e.target.value})} placeholder="them@email.com" />
            </div>
          </div>
          <div className="gift-input-group">
            <label>Personal message (optional)</label>
            <textarea maxLength={200} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="I found something that helps me with phone calls. I want you to have it too." />
          </div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',border:'none'}} disabled={loading}>
            {loading ? 'Preparing checkout...' : `Send Gift${tier === 'monthly' ? ` — €${monthlyTotal}` : tier === 'annual' ? ' — €19.99' : ' — €67'}`}
          </button>
          <div className="gift-trust">
            <span>🔒 Secure payment via Stripe</span>
            <span>📨 Gift delivered instantly by email</span>
            <span>🇫🇮 Built in Finland</span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [bannerHidden] = useState(false)
  const [stickyCta, setStickyCta] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const mainRef = useRef(null)
  const cd = useCountdown(LAUNCH_DATE)

  useEffect(() => {
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onScroll = () => { setNavScrolled(window.scrollY > 100); setStickyCta(window.scrollY > window.innerHeight) }
    window.addEventListener('scroll', onScroll, {passive:true})
    if (!prm) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.reveal').forEach(el => {
          gsap.fromTo(el,{opacity:0,y:40},{opacity:1,y:0,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true}})
        })
        gsap.fromTo('.hero-animate',{opacity:0,y:30},{opacity:1,y:0,duration:0.9,ease:'power3.out',stagger:0.12,delay:0.2})
      }, mainRef)
      return () => { ctx.revert(); window.removeEventListener('scroll', onScroll) }
    }
    document.querySelectorAll('.reveal,.hero-animate').forEach(el => { el.style.opacity='1'; el.style.transform='none' })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroCta = cd.launched ? (
    <>
      <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free for 7 Days</a>
      <a href={SAMSUNG_STORE} className="secondary-link" target="_blank" rel="noopener noreferrer">Also on Samsung Galaxy Store →</a>
      <span className="micro-text">No credit card required · €2.99/month after trial</span>
    </>
  ) : (
    <>
      <Countdown cd={cd} />
      <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Pre-register on Google Play</a>
      <a href={SAMSUNG_STORE} className="secondary-link" target="_blank" rel="noopener noreferrer">Coming to Samsung Galaxy Store →</a>
      <span className="micro-text">Launching April 16 · €2.99/month · 7-day free trial</span>
    </>
  )

  const pBtn = (label, featured) => (
    cd.launched
      ? <a href={PLAY_STORE} className="btn-primary" style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">{label}</a>
      : <a href={PLAY_STORE} className="btn-primary" style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">Pre-register April 16</a>
  )

  return (
    <div ref={mainRef}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="noise-overlay" aria-hidden="true" />
      {lightboxSrc && <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}><img src={lightboxSrc} alt="Enlarged screenshot" /></div>}

      {/* ORIGINALS BANNER */}
      <div className={`originals-banner ${bannerHidden ? 'hidden' : ''}`} role="banner">
        <span>🟢 YAPPER ORIGINALS — First 1,000. Lifetime Pro. €67.{!cd.launched && ' Now.'}</span>
        <a href="#originals">Learn More ↓</a>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${navScrolled ? 'scrolled' : 'transparent'}`} aria-label="Main navigation">
        <a href="#" className="navbar-logo">
          <img src="/yapper_logo.svg" alt="Yapper Phone" width="28" height="28" style={{background:'none'}} />
          <span>Yapper Phone</span>
        </a>
        <ul className="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#gift">Gift</a></li>
          <li><a href="#originals">Originals</a></li>
        </ul>
        {cd.launched
          ? <a href={PLAY_STORE} className="navbar-cta" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="#originals" className="navbar-cta">Get Originals</a>}
      </nav>

      {/* HERO WRAPPER — single gradient background for hero + characters */}
      <div className="hero-wrapper">
        <section className="hero" id="main-content">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-headline hero-animate" style={{opacity:0}}>The first phone call app built for how <span className="accent">your brain</span> actually works.</h1>
              <p className="hero-sub hero-animate" style={{opacity:0}}>You know that feeling when a call goes 40 minutes and you had no idea? Or when you can't figure out how to end it? <strong>That's not a character flaw.</strong> Your phone was never designed for your brain. Yapper Phone was.</p>
              <div className="hero-cta-group hero-animate" style={{opacity:0}}>{heroCta}</div>
            </div>
            <div className="hero-phone hero-animate" style={{opacity:0}}>
              <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-in-call.jpg')}><img src="/screenshot-in-call.jpg" alt="Yapper Phone in-call screen showing countdown timer at 04:08 with 6 seconds elapsed, green Connected status and agenda topic" loading="eager" /></div>
            </div>
          </div>
          <div className="scroll-indicator" aria-hidden="true"><span>SCROLL</span><div className="scroll-chevron" /></div>
        </section>

        {/* CHARACTER STRIP */}
        <div style={{padding:'0 0 1.5rem 0'}}>
          <div className="character-strip" aria-label="Yapper character mascots">
            <div className="character-track">
              {[...characters,...characters].map((c,i) => <img key={i} src={`/${c}.png`} alt="" loading="lazy" />)}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE PROBLEM */}
      <section className="section section-light" id="problem">
        <div className="section-inner">
          <div className="problem-text reveal">
            <p className="lead">For 150 years, the phone call has been built for the average brain.</p>
            <p className="stats"><strong>70% of young adults</strong> feel anxious when the phone rings. One in four UK adults under 35 have <strong>never answered a call</strong> to their mobile. One in five people worldwide are <strong>neurodivergent</strong>. The average brain is a myth.</p>
            <p className="bridge">Yapper Phone is the first phone call redesigned for how humans actually think, feel, and communicate.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE CONSENT INNOVATION */}
      <section className="section section-dark">
        <div className="section-inner">
          <div className="consent-text reveal">
            <p className="opener">For the first time in the history of the telephone, both people agree before the call begins.</p>
            <p className="detail">How long. What it's about. When it ends. Before anyone picks up, both sides consent to the structure of the call. A shared countdown. A neutral ending. No one has to be the person who hangs up.</p>
            <p className="closer">This is bilateral duration negotiation — and no phone on Earth has ever done it.</p>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:'1.5rem',marginTop:'3rem',flexWrap:'wrap'}}>
            <div className="phone-frame reveal" style={{width:160}} onClick={() => setLightboxSrc('/screenshot-setup.jpg')}><img src="/screenshot-setup.jpg" alt="Yapper pre-call setup showing duration picker with Agenda mode selected" loading="lazy" /></div>
            <div className="phone-frame reveal" style={{width:160}} onClick={() => setLightboxSrc('/screenshot-agenda.jpg')}><img src="/screenshot-agenda.jpg" alt="Yapper in-call screen showing timer counting down with agenda topic displayed" loading="lazy" /></div>
            <div className="phone-frame reveal" style={{width:160}} onClick={() => setLightboxSrc('/screenshot-incoming.jpg')}><img src="/screenshot-incoming.jpg" alt="Yapper incoming call screen showing caller avatar, agenda topic, and duration options — Long Call, Short Call, Custom Cap, and caller's Requested time" loading="lazy" /></div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SEVEN FEATURES */}
      <section className="section section-darker" id="features">
        <div className="section-inner">
          <div className="features-header reveal"><h2>What Yapper Phone does.</h2></div>
          <div className="features-grid">

            {/* Feature 1 — Time-Bound Calls */}
            <div className="feature-card reveal">
              <span className="feature-icon">⏱</span>
              <h3>Set the time before the call starts.</h3>
              <p>Both people agree on call duration before connecting. A synchronised countdown timer on both devices — colour-coded from green to orange to red. When the time is up, both of you know. No more calls that spiral into an hour you didn't have.</p>
              <p className="feature-proof">Addresses documented ADHD time perception deficits (Ptacek et al., 2019)</p>
            </div>

            {/* Feature 2 — Six Call Types */}
            <div className="feature-card reveal">
              <span className="feature-icon">📐</span>
              <h3>Every call has a shape.</h3>
              <p>Standard for everyday. Agenda for when you need to stay on topic — the subject line sits under the timer so both of you see it. Body Double for silent companionship while you work. ICE Emergency and ICE Checkup for when lives are at stake. Custom for everything else. The entire interface transforms for each type — colour, layout, purpose. One app, six ways to call.</p>
            </div>

            {/* Feature 3 — Focus Sound */}
            <div className="feature-card reveal">
              <span className="feature-icon">🎧</span>
              <h3>Focus sound, right in your call.</h3>
              <p>Ambient focus sound — brown noise at launch, with pink noise, white noise, and other sounds to help you focus and relax coming in a later update — mixed directly into your phone call. Also playing system-wide. Separate volume controls. Hearing-safe levels. Unlike any other phone app on Earth — because until now, no one built the phone call for the brain that needs background noise to focus.</p>
            </div>

            {/* Feature 4 — Time Signals */}
            <div className="feature-card reveal">
              <span className="feature-icon">🔔</span>
              <h3>Time signals — gentle reminders so you never lose track of time.</h3>
              <p>Soft chimes at intervals you choose — from 10 seconds to 30 minutes. Visual, audible, and haptic. Designed to coexist with deep focus, not interrupt it. Your external clock for when the internal one goes quiet.</p>
            </div>

            {/* Feature 5 — Communication Patterns */}
            <div className="feature-card reveal">
              <span className="feature-icon">📊</span>
              <h3>Understand how you communicate. On your terms.</h3>
              <p>{"A multi-domain dashboard showing your call patterns, social rhythms, and relationship health — with warm, plain-language summaries (\"You're a Night Owl caller\") alongside the raw data. Export everything. All processing happens on your device. Your patterns, your data, your insight."}</p>
            </div>

            {/* Feature 6 — People Missing You */}
            <div className="feature-card reveal">
              <span className="feature-icon">💚</span>
              <h3>Not a guilt trip. A gentle nudge.</h3>
              <p>{"ADHD brains don't forget people on purpose. When someone drops out of your call pattern — a friend you haven't spoken to in months, a parent you keep meaning to call — Yapper surfaces them gently. Not as a failure. Not as a streak that broke. As a person who would love to hear from you. Shame-free, by design."}</p>
              <p className="feature-proof">Designed around the shame-guilt-avoidance cycle documented in ADHD relationship research</p>
            </div>

            {/* SAFETY FEATURES */}
            <h2 className="safety-heading reveal">Safety Features</h2>

            {/* Safety 1 — Lockscreen Emergency Info */}
            <div className="feature-card full-width reveal">
              <span className="feature-icon">🆘</span>
              <h3>Lockscreen emergency info card</h3>
              <p>{"Yapper Phone's Emergency Info system puts your critical medical information — conditions, medications, blood type, allergies, emergency contacts — behind one tap on your lock screen. If a paramedic, a bystander, or a nurse picks up your phone, they don't need your passcode. They don't need to guess. Your name, your conditions, your ICE contacts — it's all right there. And inside the app, you build your medical profile once, and it's always ready. The same screen that helps first responders also helps you: one tap to call your ICE contact directly from the emergency info view."}</p>
              <div className="ice-strip">
                <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-medical-info.jpg')}><img src="/screenshot-medical-info.jpg" alt="Yapper user profile medical information setup showing gender, age, blood type, allergy status, height and weight" loading="lazy" /></div>
                <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-emergency-lockscreen.jpg')}><img src="/screenshot-emergency-lockscreen.jpg" alt="Yapper lock screen notification showing Emergency Info SOS tap to open alert alongside Focus Sound and Time Signal notifications" loading="lazy" /></div>
                <div className="phone-frame" onClick={() => setLightboxSrc('/screenshot-emergency-info.jpg')}><img src="/screenshot-emergency-info.jpg" alt="Yapper Emergency Info screen showing medical conditions, medications, blood type, and ICE contact with one-tap calling" loading="lazy" /></div>
              </div>
            </div>

            {/* Safety 2 — ICE Call */}
            <div className="feature-card full-width reveal">
              <span className="feature-icon">📞</span>
              <h3>The call that always gets through.</h3>
              <p>{"When you are someone's ICE contact, you need one thing: to wake up when they need you. Not tomorrow. Not when you check your phone. Now. And if you are the person living with diabetes, epilepsy, a heart condition — you need to know that the one person you are counting on will actually hear you. ICE calls bypass Do Not Disturb. They bypass silent mode. They ring at maximum volume. The worry is the same on both sides of the call. Yapper makes sure the phone is never the reason it went unanswered."}</p>
              <p className="feature-proof">Addresses documented caregiver communication anxiety and patient isolation (Schulz & Sherwood, 2008)</p>
              <div className="ice-video-wrap">
                <video controls preload="metadata" playsInline>
                  <source src="/yapper_phone_safety_features_demo.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Feature 8 — Battery Intelligence */}
            <div className="feature-card full-width reveal">
              <span className="feature-icon">🔋</span>
              <h3>{"Your phone’s battery warning was designed to be dismissed. This one was designed to make you act."}</h3>
              <p>{"Full-screen alerts that cut through everything — lock screen, Do Not Disturb, silent mode. Colour-coded from green to orange to red as battery drops. Estimated time remaining. And alert tones that descend in pitch as your battery drains — so even if you’re not looking, you can hear that it’s getting worse. Designed from medical alarm research to cut through hyperfocus without startling you."}</p>
              <p style={{marginTop:'1rem',color:'var(--text-primary)',fontWeight:600}}>A dead phone isn't just an inconvenience. For some people, staying reachable is staying alive.</p>
              <div className="battery-strip">
                <div className="phone-frame" onClick={() => setLightboxSrc('/battery-full.jpg')}><img src="/battery-full.jpg" alt="Full battery alert at 100% with green colour scheme" loading="lazy" /></div>
                <div className="phone-frame" onClick={() => setLightboxSrc('/battery-low.jpg')}><img src="/battery-low.jpg" alt="Low battery alert at 20% with orange colour scheme showing Getting Low warning" loading="lazy" /></div>
                <div className="phone-frame" onClick={() => setLightboxSrc('/battery-critical.jpg')}><img src="/battery-critical.jpg" alt="Critical battery alert at 3% with red colour scheme showing Charge now! warning" loading="lazy" /></div>
              </div>
              <div className="battery-color-legend">
                <span><span className="battery-dot" style={{background:'#00C853'}}></span> Full</span>
                <span><span className="battery-dot" style={{background:'#F57C00'}}></span> Getting low</span>
                <span><span className="battery-dot" style={{background:'#E53935'}}></span> Critical</span>
              </div>
              <p className="feature-proof">Battery intelligence with configurable thresholds — a system-level capability only a true dialer replacement can deliver</p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: THE CURB-CUT MOMENT */}
      <section className="section section-light">
        <div className="section-inner curb-cut-section reveal">
          <h2>Designed for neurodivergent brains. Better for every brain.</h2>
          <p style={{maxWidth:640,margin:'0 auto 1.5rem',color:'var(--text-secondary)',fontSize:'1.05rem',lineHeight:1.7}}>When JPMorgan Chase designed roles for autistic employees, those employees were 90–140% more productive. When environments are built for the most demanding users, everyone performs better. This is the curb-cut effect — and Yapper applies it to the phone call.</p>
          <div className="curb-cut-examples">
            <div className="curb-example">
              <p className="designed">Designed for ADHD</p>
              <p>{"Time-bound calls designed for ADHD time blindness? They also rescue every professional trapped on a calendar-wrecking \"quick call.\""}</p>
            </div>
            <div className="curb-example">
              <p className="designed">Designed for caregivers</p>
              <p>{"Emergency bypass designed for a diabetic child's caregiver? It gives every parent peace of mind."}</p>
            </div>
            <div className="curb-example">
              <p className="designed">Designed for connection</p>
              <p>{"A gentle nudge about friends you haven't called? That serves anyone whose life got too busy to keep up."}</p>
            </div>
          </div>
          <p className="curb-cta">You don't need a diagnosis to need a better phone call.</p>
        </div>
      </section>

      {/* SECTION 6: THE ADHERENCE ARGUMENT */}
      <section className="section section-dark adherence">
        <p className="line1 reveal">Other ADHD apps need you to remember to open them.</p>
        <p className="line2 reveal">Yapper works because eventually your phone rings.</p>
        <p className="micro reveal">Mental health apps have a median 15-day retention of 3.9%. Yapper Phone is built into the infrastructure your life already uses.</p>
      </section>

      {/* SECTION 7: YAPPER ORIGINALS */}
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

      {/* SECTION 8: PRICING */}
      <section className="section section-dark" id="pricing">
        <div className="section-inner">
          <h2 className="section-heading reveal">Simple pricing. Full app.</h2>
          {!cd.launched && <p style={{textAlign:'center',color:'var(--text-secondary)',marginBottom:'2rem',fontSize:'0.95rem'}}>Launching April 16. Pre-register now — or <a href="#originals" style={{color:'var(--yapper-green)'}}>grab Originals today</a>.</p>}
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
              {pBtn('Try Free', true)}
            </div>
            <div className="pricing-card featured reveal">
              <span className="pricing-badge">Best Value</span>
              <h3>Annual</h3>
              <p className="pricing-amount">€19.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/year</span></p>
              <p className="pricing-period">Effective €1.67/month · Save 44%</p>
              <ul className="pricing-features">
                <li>Full app, all features</li>
                <li>All six call types</li>
                <li>ICE Emergency included</li>
                <li>29 languages</li>
              </ul>
              {pBtn('Subscribe & Save', true)}
            </div>
            <div className="pricing-card reveal">
              <h3>Monthly</h3>
              <p className="pricing-amount">€2.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/mo</span></p>
              <p className="pricing-period">Cancel anytime</p>
              <ul className="pricing-features">
                <li>Full app, all features</li>
                <li>All six call types</li>
                <li>ICE Emergency included</li>
                <li>29 languages</li>
              </ul>
              {pBtn('Subscribe', false)}
            </div>
          </div>
        </div>
      </section>

      {/* GIFT SECTION */}
      <GiftSection />

      {/* SECTION 9: THE MISSION */}
      <section className="section section-darker">
        <div className="section-inner mission-text reveal">
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <img src="/institute_logo_cropped.png" alt="Institute for The Study Of Humanity and Maximized Impact" style={{maxWidth:'420px',width:'100%',height:'auto',opacity:0.9}} />
          </div>
          <p style={{textAlign:'center',fontSize:'0.95rem',color:'var(--yapper-green)',fontFamily:'var(--font-display)',fontWeight:600,marginBottom:'2rem'}}>55,000 Finnish Type 1 diabetics receive free lifetime Pro access — a proof of our Institute's mission and integrity.</p>
          <p className="mission-body">A substantial portion of all profits funds the Institute for The Study Of Humanity and Maximized Impact — a permanent Finnish research institute studying human communication, neurodiversity, and the human mind. The creators who build the ecosystem are compensated generously. Both of these are true simultaneously.</p>
          <p className="mission-closer">We are not building this to sell it. We are building this to make it permanent.</p>
          <p className="mission-pillars">NO EXIT · NO INVESTORS · NO CORPORATE CAPTURE · NO MARTYRDOM</p>
        </div>
      </section>

      {/* SECTION 10: TRUST FOOTER */}
      <section className="section section-dark trust-section">
        <div className="section-inner reveal">
          <h2 className="trust-headline">Your phone call, finally on your terms.</h2>
          {!cd.launched && <Countdown cd={cd} />}
          <div style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap',alignItems:'center'}}>
            {cd.launched
              ? <><a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free for 7 Days on Google Play</a><a href={SAMSUNG_STORE} className="btn-secondary" target="_blank" rel="noopener noreferrer">Samsung Galaxy Store</a></>
              : <><a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Pre-register on Google Play</a><a href="#originals" className="btn-secondary">Or get Originals now — €67</a></>}
          </div>
          <p style={{textAlign:'center',marginTop:'0.75rem',fontSize:'0.8rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{cd.launched ? 'No credit card required · €2.99/month after trial' : 'Launching April 16, 2026 · €2.99/month · 7-day free trial'}</p>
          <div className="trust-bar">
            <span className="trust-item">🇫🇮 Built in Finland</span>
            <span className="trust-item">📱 29 languages</span>
            <span className="trust-item">🔒 All data on your device</span>
            <span className="trust-item">📋 667+ USPTO provisional patent applications</span>
          </div>
        </div>
      </section>

      {/* SECTION 11: FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
              <img src="/yapper_logo.svg" alt="" width="24" height="24" style={{background:'none'}} />
              <h4 style={{margin:0}}>Yapper Phone</h4>
            </div>
            <p>Health Communications Technology</p>
            <p style={{marginTop:'0.5rem'}}>© 2026 SUPER SINCE BIRTH Tmi</p>
          </div>
          <div>
            <h5>Download</h5>
            <ul className="footer-links"><li><a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">Google Play</a></li><li><a href={SAMSUNG_STORE} target="_blank" rel="noopener noreferrer">Samsung Galaxy Store</a></li></ul>
            <h5 style={{marginTop:'1.5rem'}}>Community</h5>
            <ul className="footer-links"><li><a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a></li><li><a href="https://instagram.com/yapperphone" target="_blank" rel="noopener noreferrer">Instagram</a></li><li><a href="https://tiktok.com/@yapperphone" target="_blank" rel="noopener noreferrer">TikTok</a></li></ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul className="footer-links"><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li></ul>
            <h5 style={{marginTop:'1.5rem'}}>Contact</h5>
            <ul className="footer-links"><li><a href="mailto:janne@maximized-impact.org">janne@maximized-impact.org</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-status"><span className="status-dot" /> System Operational</div>
          <p>Institute for The Study Of Humanity and Maximized Impact ry</p>
          <p>667+ USPTO Provisional Patent Applications · February 27, 2026</p>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className={`sticky-cta ${stickyCta ? 'visible' : ''}`}>
        {cd.launched
          ? <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="#originals" className="btn-primary">Get Originals — €67</a>}
        <span className="price-hint">{cd.launched ? '7 days · No card' : 'Available now'}</span>
      </div>
    </div>
  )
}
