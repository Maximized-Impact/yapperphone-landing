import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.yapperphone.app'
const SAMSUNG_STORE = 'https://galaxystore.samsung.com/detail/com.yapperphone.app'
const ORIGINALS_STRIPE = 'https://buy.stripe.com/PLACEHOLDER'
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
  const [months, setMonths] = useState(3)
  const [form, setForm] = useState({gifterName:'',gifterEmail:'',recipientName:'',recipientEmail:'',message:''})

  const monthlyTotal = (2.99 * months).toFixed(2)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Call Firebase Cloud Function createGiftCheckout
    // For now, show alert
    alert('Gift checkout coming soon! Stripe integration in progress.')
  }

  return (
    <section className="section section-dark gift-section" id="gift">
      <div className="section-inner">
        {/* Painting Hero */}
        <div className="gift-painting-wrap reveal">
          <img src="/wilda-painting.webp" alt="Sydämiä ja Tähdenlentoja — abstract painting with hearts in red, green, and black, blue circles, and yellow sunbursts on white canvas" loading="lazy" />
          <div className="gift-painting-caption">
            <div className="gift-painting-title">Sydämiä ja Tähdenlentoja</div>
            <div className="gift-painting-subtitle">Hearts and Shooting Stars</div>
            <div className="gift-painting-credit">by Wilda Vakkilainen, age 4 · 2023</div>
            <div className="gift-painting-tagline">Yapper was built for minds like hers.</div>
          </div>
        </div>

        {/* Headline */}
        <h2 className="gift-headline reveal">Give a Better Call</h2>
        <p className="gift-subheadline reveal">Give someone you love a phone call that finally works for their brain.</p>

        {/* Tier Cards */}
        <div className="gift-tiers reveal">
          <div className={`gift-tier ${tier === 'monthly' ? 'selected' : ''}`} onClick={() => setTier('monthly')}>
            <h4>Gift Monthly</h4>
            <div className="gift-tier-price">€{monthlyTotal}</div>
            <div className="gift-tier-detail">{months} month{months > 1 ? 's' : ''} of Pro</div>
            {tier === 'monthly' && (
              <div className="gift-months-selector">
                {[1,3,6,12].map(m => (
                  <button key={m} className={`gift-month-btn ${months === m ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setMonths(m) }}>{m}mo</button>
                ))}
              </div>
            )}
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

        {/* Gift Form */}
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
              <label>Recipient's name</label>
              <input type="text" required value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})} placeholder="Their name" />
            </div>
            <div className="gift-input-group">
              <label>Recipient's email</label>
              <input type="email" required value={form.recipientEmail} onChange={e => setForm({...form, recipientEmail: e.target.value})} placeholder="them@email.com" />
            </div>
          </div>
          <div className="gift-input-group">
            <label>Personal message (optional)</label>
            <textarea maxLength={200} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="I found something that helps me with phone calls. I want you to have it too." />
          </div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',border:'none'}}>
            Send Gift{tier === 'monthly' ? ` — €${monthlyTotal}` : tier === 'annual' ? ' — €19.99' : ' — €67'}
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
      <a href={SAMSUNG_STORE} className="secondary-link" target="_blank" rel="noopener noreferrer">Also on Samsung Galaxy Store →</a>
      <span className="micro-text">Launching April 16 · €2.99/month · 7-day free trial</span>
    </>
  )

  const pBtn = (label, featured) => (
    cd.launched
      ? <a href={PLAY_STORE} className={featured ? 'btn-primary' : 'btn-secondary'} style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">{label}</a>
      : <a href={PLAY_STORE} className={featured ? 'btn-primary' : 'btn-secondary'} style={{width:'100%',justifyContent:'center'}} target="_blank" rel="noopener noreferrer">Pre-register — April 16</a>
  )

  return (
    <div ref={mainRef}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="noise-overlay" aria-hidden="true" />

      <div className={`originals-banner ${bannerHidden ? 'hidden' : ''}`} role="banner">
        <span>🟢 YAPPER ORIGINALS — First 1,000. Lifetime Pro. €67.{!cd.launched && ' Now.'}</span>
        <a href="#originals">Learn More ↓</a>
      </div>

      <nav className={`navbar ${navScrolled ? 'scrolled' : 'transparent'}`} aria-label="Main navigation">
        <a href="#" className="navbar-logo">
          <img src="/yapper_logo.svg" alt="Yapper Phone" width="28" height="28" style={{background:'none'}} />
          <span>Yapper</span>
        </a>
        <ul className="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#originals">Originals</a></li>
        </ul>
        {cd.launched
          ? <a href={PLAY_STORE} className="navbar-cta" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="#originals" className="navbar-cta">Get Originals</a>}
      </nav>

      <section className="hero" id="main-content" style={{paddingTop:"8rem"}}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-headline hero-animate" style={{opacity:0}}>The first phone call app built for how <span className="accent">your brain</span> actually works.</h1>
            <p className="hero-sub hero-animate" style={{opacity:0}}>You know that feeling when a call goes 40 minutes and you had no idea? Or when you can't figure out how to end it? <strong>That's not a character flaw.</strong> Your phone was never designed for your brain. Yapper was.</p>
            <div className="hero-cta-group hero-animate" style={{opacity:0}}>{heroCta}</div>
          </div>
          <div className="hero-phone hero-animate" style={{opacity:0,paddingTop:'2rem'}}>
            <div className="phone-frame"><img src="/screenshot-in-call.jpg" alt="Yapper Phone in-call screen showing countdown timer" loading="eager" /></div>
          </div>
        </div>
        <div className="scroll-indicator" aria-hidden="true"><span>SCROLL</span><div className="scroll-chevron" /></div>
      </section>

      <div className="section-dark" style={{padding:'1.5rem 0'}}>
        <div className="character-strip" aria-label="Yapper character mascots">
          <div className="character-track">
            {[...characters,...characters].map((c,i) => <img key={i} src={`/${c}.png`} alt="" loading="lazy" width="100" height="150" />)}
          </div>
        </div>
      </div>

      <section className="section section-light" id="problem">
        <div className="section-inner"><div className="problem-text reveal">
          <p className="lead">For 150 years, the phone call has been built for the average brain.</p>
          <p className="stats"><strong>70% of young adults</strong> feel anxious when the phone rings. One in four UK adults under 35 have <strong>never answered a call</strong> to their mobile. One in five people worldwide are <strong>neurodivergent</strong>. The average brain is a myth.</p>
          <p className="bridge">Yapper is the first phone call redesigned for how humans actually think, feel, and communicate.</p>
        </div></div>
      </section>

      <section className="section section-dark">
        <div className="section-inner">
          <div className="consent-text reveal">
            <p className="opener">For the first time in the history of the telephone, both people agree before the call begins.</p>
            <p className="detail">How long. What it's about. When it ends. Before anyone picks up, both sides consent to the structure of the call. A shared countdown. A neutral ending. No one has to be the person who hangs up.</p>
            <p className="closer">This is bilateral duration negotiation — and no phone on Earth has ever done it.</p>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:'1.5rem',marginTop:'3rem',flexWrap:'wrap'}}>
            <div className="phone-frame reveal" style={{width:180}}><img src="/screenshot-setup.jpg" alt="Yapper pre-call setup" loading="lazy" /></div>
            <div className="phone-frame reveal" style={{width:180}}><img src="/screenshot-agenda.jpg" alt="Yapper in-call timer" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section className="section section-darker" id="features">
        <div className="section-inner">
          <div className="features-header reveal"><h2>What Yapper does.</h2></div>
          <div className="features-grid">
            <div className="feature-card reveal"><span className="feature-icon">⏱</span><h3>Set the time before the call starts.</h3><p>Both people agree on call duration before connecting. A synchronised countdown timer on both devices — colour-coded from green to orange to red. When the time is up, both of you know.</p><p className="feature-proof">Addresses documented ADHD time perception deficits (Ptacek et al., 2019)</p></div>
            <div className="feature-card reveal"><span className="feature-icon">🎧</span><h3>Brown noise, right in your call.</h3><p>Ambient focus sound mixed directly into your phone call. Separate volume controls. Hearing-safe levels. Unlike any other phone app on Earth.</p></div>
            <div className="feature-card reveal"><span className="feature-icon">🔔</span><h3>Gentle reminders — so you never lose track.</h3><p>Soft chimes at intervals you choose — every 5, 10, or 15 minutes. Your external clock for when the internal one goes quiet.</p></div>
            <div className="feature-card reveal"><span className="feature-icon">📐</span><h3>Every call has a shape.</h3><p>Standard. Agenda. Body Double. ICE Emergency. ICE Checkup. Custom. One app, six ways to call.</p></div>
            <div className="feature-card feature-card-with-phone reveal" style={{borderColor:'rgba(229,57,53,0.2)'}}>
              <div><span className="feature-icon">🆘</span><h3>The call that always gets through.</h3><p>If you are someone's ICE contact, you need one thing: to wake up when they need you. Not tomorrow. Not when you check your phone. Now. And if you are the person living with diabetes, epilepsy, a heart condition — you need to know that the one person you are counting on will actually hear you. ICE calls bypass Do Not Disturb. They bypass silent mode. They ring at maximum volume. The worry is the same on both sides of the call. Yapper makes sure the phone is never the reason it went unanswered.</p><p className="feature-proof">Addresses documented caregiver communication anxiety and patient isolation (Schulz & Sherwood, 2008)</p></div>
              <div className="phone-frame"><img src="/screenshot-emergency.jpg" alt="Emergency Info screen" loading="lazy" /></div>
            </div>
            <div className="feature-card reveal"><span className="feature-icon">💚</span><h3>Not a guilt trip. A gentle nudge.</h3><p>ADHD brains don't forget people on purpose. Yapper surfaces fading connections gently. Shame-free, by design.</p></div>
            <div className="feature-card reveal"><span className="feature-icon">📊</span><h3>Understand how you communicate.</h3><p>Your call patterns, social rhythms, and relationship health. All processing on your device.</p></div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="section-inner curb-cut-section reveal">
          <h2>Designed for neurodivergent brains. Better for every brain.</h2>
          <p style={{maxWidth:640,margin:'0 auto 1.5rem',color:'var(--text-secondary)',fontSize:'1.05rem',lineHeight:1.7}}>When JPMorgan Chase designed roles for autistic employees, those employees were 90–140% more productive. This is the curb-cut effect — and Yapper applies it to the phone call.</p>
          <div className="curb-cut-examples">
            <div className="curb-example"><p className="designed">Designed for ADHD</p><p>Time-bound calls rescue every professional trapped on a "quick call."</p></div>
            <div className="curb-example"><p className="designed">Designed for caregivers</p><p>Emergency bypass gives every parent peace of mind.</p></div>
            <div className="curb-example"><p className="designed">Designed for connection</p><p>A gentle nudge serves anyone whose life got too busy.</p></div>
          </div>
          <p className="curb-cta">You don't need a diagnosis to need a better phone call.</p>
        </div>
      </section>

      <section className="section section-dark adherence">
        <p className="line1 reveal">Other ADHD apps need you to remember to open them.</p>
        <p className="line2 reveal">Yapper works because your phone rings.</p>
        <p className="micro reveal">Mental health apps have a median 15-day retention of 3.9%. Yapper is built into the infrastructure your life already uses.</p>
      </section>

      <section className="section section-darker" id="originals">
        <div className="section-inner originals-section reveal">
          <div className="originals-card">
            <div style={{display:'inline-block',background:'var(--yapper-green)',color:'var(--dark)',fontFamily:'var(--font-mono)',fontSize:'0.75rem',fontWeight:700,padding:'0.3rem 1rem',borderRadius:100,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'1rem'}}>
              {cd.launched ? 'Limited spots' : '🔥 Available now — don\'t wait for launch'}
            </div>
            <h2>Yapper Originals</h2>
            <p className="originals-subtitle">The Founding 1,000</p>
            <p className="originals-price">€67 <span>one-time</span></p>
            <p className="originals-desc">This is for the people who see what Yapper is before the world catches up. The founding members who make the mission real.</p>
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

      <section className="section section-dark" id="pricing">
        <div className="section-inner">
          <h2 className="section-heading reveal">Simple pricing. Full app.</h2>
          {!cd.launched && <p style={{textAlign:'center',color:'var(--text-secondary)',marginBottom:'2rem',fontSize:'0.95rem'}}>Launching April 16. Pre-register now — or <a href="#originals" style={{color:'var(--yapper-green)'}}>grab Originals today</a>.</p>}
          <div className="pricing-grid">
            <div className="pricing-card reveal"><h3>Free Trial</h3><p className="pricing-amount">7 Days</p><p className="pricing-period">€0 — no credit card</p><ul className="pricing-features"><li>Full app, all features</li><li>All six call types</li><li>ICE Emergency included</li><li>No commitment</li></ul>{pBtn('Try Free',true)}</div>
            <div className="pricing-card featured reveal"><span className="pricing-badge">Best Value</span><h3>Annual</h3><p className="pricing-amount">€19.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/year</span></p><p className="pricing-period">Effective €1.67/month · Save 44%</p><ul className="pricing-features"><li>Full app, all features</li><li>All six call types</li><li>ICE Emergency included</li><li>29 languages</li></ul>{pBtn('Subscribe & Save',true)}</div>
            <div className="pricing-card reveal"><h3>Monthly</h3><p className="pricing-amount">€2.99<span style={{fontSize:'0.9rem',fontWeight:400}}>/mo</span></p><p className="pricing-period">Cancel anytime</p><ul className="pricing-features"><li>Full app, all features</li><li>All six call types</li><li>ICE Emergency included</li><li>29 languages</li></ul>{pBtn('Subscribe',false)}</div>
          </div>
          <p className="pricing-note reveal">Finnish Type 1 diabetics receive free lifetime Pro access. <a href="mailto:janne@maximized-impact.org">Contact us →</a></p>
        </div>
      </section>

      {/* ═══ GIFT SECTION ═══ */}
      <GiftSection />

      <section className="section section-darker">
        <div className="section-inner mission-text reveal">
          <div style={{textAlign:"center",marginBottom:"2rem"}}>
            <img src="/maximized_impact_institute_logo.png" alt="Institute for The Study Of Humanity and Maximized Impact" style={{height:"60px",width:"auto",opacity:0.85}} />
          </div>
          <p className="mission-pillars">NO EXIT · NO INVESTORS · NO CORPORATE CAPTURE · NO MARTYRDOM</p>
          <p className="mission-body">A substantial portion of all profits funds the Institute for The Study Of Humanity and Maximized Impact — a permanent Finnish research institute studying human communication, neurodiversity, and the human mind. The creators who build the ecosystem are compensated generously. Both of these are true simultaneously.</p>
          <p className="mission-closer">We are not building this to sell it. We are building this to make it permanent.</p>
        </div>
      </section>

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

      <div className={`sticky-cta ${stickyCta ? 'visible' : ''}`}>
        {cd.launched
          ? <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="#originals" className="btn-primary">Get Originals — €67</a>}
        <span className="price-hint">{cd.launched ? '7 days · No card' : 'Available now'}</span>
      </div>
    </div>
  )
}
