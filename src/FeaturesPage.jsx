import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.yapperphone.app'
const SAMSUNG_STORE = 'https://galaxystore.samsung.com/detail/com.yapperphone.app'
const ORIGINALS_STRIPE = 'https://buy.stripe.com/test_cNi9ATdiVcBu0gjfQp8g000'
const LAUNCH_DATE = new Date('2026-04-16T09:00:00+03:00')

const SECTIONS = [
  {
    id: 'duration', icon: '⏱', title: 'Duration-First Calling', subtitle: 'Because every call deserves a plan',
    features: [
      { title: 'Set the time before you dial', desc: 'Every outgoing call starts with one question: how long should this be? Pick Short, Long, or set a custom duration down to the second. Your personal call caps define what "Short" and "Long" mean for you. Request more time than your Long cap and the call is flagged as Extended — a clear signal that this is a big time commitment. No call is placed until you\'ve decided how long it should take.' },
      { title: 'Two-sided duration negotiation', desc: 'When both people use Yapper, calling becomes a conversation before the conversation. You propose a duration. They see your request alongside their own caps — four clear buttons, one choice. The receiver always has the final say. Their choice becomes the agreed duration on both sides. When only one side has Yapper, you still get your own countdown timer — the time-awareness benefit works either way.' },
      { title: 'Synchronised countdown timer', desc: 'A shared clock on both devices — colour-coded from green (fine) through orange (getting close) to red (wrap up now). Runs to overtime if needed, counting up instead of down.' },
      { title: 'Time signals & wrap-up warnings', desc: 'Configurable chimes at intervals from 10 seconds to 30 minutes — both in-call and system-wide. Escalating alerts as agreed time approaches. Independent volume controls. Runs as a native background service that survives app kill and reboots. A temporal anchor for time-blind brains.' },
    ]
  },
  {
    id: 'call-types', icon: '📞', title: 'Six Call Types', subtitle: 'Every call has an intention. Now your phone knows it.',
    intro: 'Each type transforms the entire call experience — timer, buttons, badges, and notification cards all change colour to match.',
    features: [
      { title: '📞 Standard Call', desc: 'The everyday call with time awareness built in. Default colour scheme. Duration negotiation, countdown timer, all core features active.' },
      { title: '🤝 Body Double Call', desc: 'ADHD accountability sessions. Not a conversation — a passive co-presence session for task activation. Someone is on the other end, and that\'s enough to start working. Clinically documented. Now built into your phone.', color: '#7B1FA2' },
      { title: '📋 Agenda Call', desc: 'Write a short agenda or select a saved one before the call connects. Both people know what the call is about before anyone answers. Saves the first two minutes of every call.', color: '#2196F3' },
      { title: '🆘 ICE Emergency', desc: 'Life-critical calls that bypass silent mode, Do Not Disturb, and all restrictions. Lock screen emergency card. GPS + SMS transmission. Your emergency contacts can reach you through silent mode too. Bidirectional. Available with any active subscription or trial.', color: '#E53935' },
      { title: '🩺 ICE Checkup', desc: 'Scheduled wellness check-ins. Softer than Emergency — a daily "are you okay?" from the people who worry about you. Still bypasses restrictions. Still wakes them up if they need to hear from you.', color: '#F57C00' },
      { title: '🎨 Custom Duration', desc: 'Set any duration down to the second. The interface adapts. For calls that don\'t fit a label — the only rule is that you chose the time before the call connected.', color: '#00BCD4' },
    ]
  },
  {
    id: 'focus', icon: '🎧', title: 'Focus & Sensory Tools', subtitle: 'Your brain\'s environment, under your control',
    features: [
      { title: 'Focus Sound — in-call and system-wide', desc: 'Brown noise at launch — mixed directly into live phone call audio. Also plays system-wide through a separate audio stream. Two independent volume controls. Hearing-safe maximum levels. This requires system dialer privileges — no third-party app can do this. Only a true dialer replacement can mix audio into the telephony stream.' },
      { title: 'System-wide Time Signal', desc: 'Configurable chimes at intervals from 10 seconds to 30 minutes. Runs as a native background service — survives app kill, survives reboots. Visual, audible, and haptic. Independent of any active call. Your external clock for when the internal one goes quiet.' },
      { title: 'Social Media Break', desc: 'Block apps by category — but let the people you love through. VIP contacts bypass every block, every filter, every category you\'ve silenced. Eight categories, three states each (Blocked, VIP Only, Allowed), up to 40 individual notification groups. It learns your patterns passively as you go. Runs in the background even when Yapper is closed. Survives reboots.' },
    ]
  },
  {
    id: 'documentation', icon: '📝', title: 'Documentation & File Management', subtitle: 'Your calls, your records, your files',
    features: [
      { title: 'Call Notes', desc: 'Capture key points as you talk. Notes saved to folders you choose via Android\'s Storage Access Framework. They exist as normal files on your device — accessible by any file manager, surviving app uninstalls. No consent required. No storage overhead. Just clarity.' },
    ]
  },
  {
    id: 'relationships', icon: '💜', title: 'Relationship Intelligence', subtitle: 'Your phone knows who matters',
    features: [
      { title: 'Contact Tagging', desc: 'Tag contacts as ICE, ICE4 (you are their ICE), or Mutual ICE — and create your own custom tags. Tags propagate everywhere in the UI: contact lists, recents, dialer, in-call, PIP.' },
      { title: 'Networks — Relationship CRM', desc: 'A full contact details screen: where you met, notes, tags, social media handles, mutual friends, and the groups you\'ve added them to. "When you met" is set automatically — Yapper checks your call history and uses the first timestamp as the date. Create groups in Setup that propagate to every contact\'s Details page. Build a memory repository of your relationships. You can also add medications and medical conditions for loved ones whose health information is important to know.' },
      { title: 'Favourites Strip', desc: 'Scrollable strip of starred contacts. Four sort modes. ICE4 Priority Mode forces emergency contacts first. Collapsible with one tap.' },
      { title: 'People Missing You', desc: 'Gentle nudges when someone you care about hasn\'t heard from you in a while. Not guilt — awareness. Shame-free, by design.' },
      { title: 'Communication Patterns Dashboard', desc: 'Call Science, Social Graph, Chronobiology, Focus & Presence, Relationship Intelligence, Self-Mastery. Six behavioral domains. Coach and Research modes. PDF/JSON/CSV export. All processing on-device.' },
      { title: 'Battery Alert Intelligence', desc: 'Configurable alerts at custom battery levels. Full-screen alerts that cut through lock screen, Do Not Disturb, silent mode. Colour-coded from green to orange to red. Alert tones that descend in pitch. Designed from medical alarm research.' },
    ]
  },
  {
    id: 'accessibility', icon: '🎯', title: 'Built For Your Brain', subtitle: 'Neurodivergent-first, not an afterthought',
    features: [
      { title: 'Ambient Clock — Lock Screen Widget', desc: 'Your lock screen finally does something. A big adjustable clock, date, missed calls with one-tap call-back, Now Playing from any music app with transport controls, a freely movable Focus Sound on/off button, and a Quick Timer with instant presets — Pomodoro daisy-chaining coming in the next update. Less unlocking. More living.' },
      { title: 'Gyro Mode — Progressive Disclosure', desc: 'A master toggle controlling how much you see in settings. Off: only essentials. On: advanced controls animate into view. Reduces cognitive load for everyday use while making full depth available to power users.' },
      { title: 'Settings Profiles', desc: 'Save, load, rename named profiles. Built-in ADHD/Autism preset at launch. Work mode, sleep mode, whatever you need. One tap to switch.' },
      { title: 'Picture-in-Picture', desc: 'Minimize the in-call screen to a floating window and navigate anywhere in Yapper — Recents, Keypad, Contacts, settings, all features. Access everything the app offers while on a call.' },
      { title: 'Full-Featured Dialer', desc: 'T9 dialpad with real-time contact suggestions. Paste from clipboard. Country code auto-detection. Every call goes through call setup — no call is placed without a duration choice first.' },
      { title: 'Action Dock', desc: 'Configurable shortcut toolbar. Each screen has its own independently customisable buttons. Adjustable opacity for foldable devices.' },
      { title: 'Yapper Menu', desc: 'Accessible from your main screens — Recents, Keypad, Contacts. Three floating buttons at the bottom: Social Media Break, System-Wide Time Signal, System-Wide Focus Sound. Long press for settings.' },
    ]
  },
  {
    id: 'privacy', icon: '🔒', title: 'Privacy By Architecture', subtitle: 'We built Yapper so we never need to see your data',
    features: [
      { title: 'On-device everything', desc: 'All statistics, behavioral insights, call history, notes, and health data are stored locally on your phone. No cloud analytics. No third-party tracking. Your identity is never exposed. Your files. Your folders. Your control.' },
    ]
  },
]

const LANGUAGES = [
  'Arabic','Bengali','Chinese','English','Estonian','Finnish','French','German',
  'Gujarati','Hindi','Italian','Japanese','Javanese','Korean','Marathi','Punjabi',
  'Persian/Farsi','Polish','Portuguese','Russian','Spanish','Swedish','Tamil',
  'Telugu','Thai','Turkish','Ukrainian','Urdu','Vietnamese'
]

const COMING_SOON = [
  'Timestamped Bookmarks during calls',
  'White noise, pink noise, rain, ocean, forest sounds',
  'Isochronic tones (mono-safe in-call focus frequencies)',
  'Dialer Voice Search',
  'System-wide PIP (floating call widget anywhere on your phone)',
  'Elderly/Vulnerable Settings Preset',
  'Binaural beats (system-wide/speaker only)',
  'Custom sound import',
  'Cloud backup (back up all your data and settings)',
  'WearOS Companion (Month 3–4 post-launch)',
]

function FeatureCard({title, desc, color}) {
  return (
    <div className="fp-feature-card reveal" style={color ? {'--fp-accent': color} : {}}>
      <h4>{title}</h4>
      <p>{desc}</p>
      {color && <span className="fp-color-bar" />}
    </div>
  )
}

export default function FeaturesPage() {
  const mainRef = useRef(null)
  const launched = Date.now() >= LAUNCH_DATE.getTime()

  useEffect(() => {
    // Handle hash anchors (e.g. /features#call-types)
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } else {
      window.scrollTo(0, 0)
    }
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prm) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.reveal').forEach(el => {
          gsap.fromTo(el,{opacity:0,y:30},{opacity:1,y:0,duration:0.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})
        })
      }, mainRef)
      return () => ctx.revert()
    }
    document.querySelectorAll('.reveal').forEach(el => { el.style.opacity='1'; el.style.transform='none' })
  }, [])

  return (
    <div ref={mainRef}>
      {/* NAVBAR */}
      <nav className="navbar scrolled" style={{top:16}} aria-label="Main navigation">
        <a href="/" className="navbar-logo">
          <img src="/yapper_logo.svg" alt="Yapper Phone" width="28" height="28" style={{background:'none'}} />
          <span>Yapper Phone</span>
        </a>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/#pricing">Pricing</a></li>
          <li><a href="/#mission">Mission</a></li>
        </ul>
        {launched
          ? <a href={PLAY_STORE} className="navbar-cta" target="_blank" rel="noopener noreferrer">Try Free</a>
          : <a href="/#originals" className="navbar-cta">Get Originals</a>}
      </nav>

      {/* FEATURES HERO */}
      <section className="section section-dark" style={{paddingTop:'8rem'}}>
        <div className="section-inner" style={{textAlign:'center'}}>
          <h1 className="reveal" style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'clamp(1.8rem, 4vw, 3rem)',letterSpacing:'-0.03em',marginBottom:'1.5rem'}}>
            34 features. 6 call types. 9 coming soon.<br/>
            <span style={{color:'var(--text-secondary)',fontSize:'0.65em',fontWeight:400}}>Every one built for your brain.</span>
          </h1>
          <p className="reveal" style={{maxWidth:640,margin:'0 auto 2rem',color:'var(--text-secondary)',fontSize:'1.05rem',lineHeight:1.7}}>
            Yapper Phone replaces your default Android dialer with the most feature-complete accessibility-first phone app ever built. Real carrier calls. All data on your device. 667+ patents filed.
          </p>
          {launched
            ? <a href={PLAY_STORE} className="btn-primary reveal" target="_blank" rel="noopener noreferrer">Try Free for 7 Days</a>
            : <a href="/#originals" className="btn-primary reveal">Get Originals — €67 Lifetime</a>}

          {/* Section jump links */}
          <div className="fp-jump-links reveal">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className="fp-jump-link">
                <span>{s.icon}</span> {s.title}
              </a>
            ))}
            <a href="#languages" className="fp-jump-link"><span>🌐</span> Languages</a>
            <a href="#coming-soon" className="fp-jump-link"><span>🔜</span> Coming Soon</a>
          </div>
        </div>
      </section>

      {/* FEATURE SECTIONS */}
      {SECTIONS.map((section, si) => (
        <section key={section.id} id={section.id} className={`section ${si % 2 === 0 ? 'section-darker' : 'section-dark'}`}>
          <div className="section-inner">
            <div className="fp-section-header reveal">
              <span className="fp-section-icon">{section.icon}</span>
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
            </div>
            {section.intro && <p className="reveal" style={{textAlign:'center',maxWidth:640,margin:'0 auto 2rem',color:'var(--text-secondary)',fontSize:'0.95rem',lineHeight:1.7}}>{section.intro}</p>}
            <div className={`fp-features-grid ${section.features.length === 1 ? 'single' : ''}`}>
              {section.features.map((f, fi) => (
                <FeatureCard key={fi} title={f.title} desc={f.desc} color={f.color} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* LANGUAGES */}
      <section id="languages" className="section section-dark">
        <div className="section-inner">
          <div className="fp-section-header reveal">
            <span className="fp-section-icon">🌐</span>
            <h2>29 Languages at Launch</h2>
            <p>74 in the architecture for future releases</p>
          </div>
          <div className="fp-languages reveal">
            {LANGUAGES.map((lang, i) => (
              <span key={i} className="fp-lang-tag">{lang}</span>
            ))}
          </div>
          <p className="reveal" style={{textAlign:'center',marginTop:'1.5rem',color:'var(--text-muted)',fontSize:'0.85rem',fontFamily:'var(--font-mono)'}}>
            Full right-to-left support for Arabic, Persian, Urdu, and Hebrew. In-app language selector.
          </p>
          <p className="reveal" style={{textAlign:'center',marginTop:'0.75rem',color:'var(--yapper-green)',fontFamily:'var(--font-display)',fontWeight:600,fontSize:'1rem'}}>
            Your phone call experience should speak your language.
          </p>
        </div>
      </section>

      {/* COMING SOON */}
      <section id="coming-soon" className="section section-darker">
        <div className="section-inner">
          <div className="fp-section-header reveal">
            <span className="fp-section-icon">🔜</span>
            <h2>Coming Soon</h2>
            <p>Built, tested, and waiting for the right moment</p>
          </div>
          <div className="fp-coming-grid">
            {COMING_SOON.map((item, i) => (
              <div key={i} className="fp-coming-item reveal">
                <span className="fp-coming-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section section-dark" style={{textAlign:'center'}}>
        <div className="section-inner reveal">
          <h2 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'clamp(1.4rem, 3vw, 2rem)',marginBottom:'1.5rem'}}>
            34 features. One app. Your phone call, finally.
          </h2>
          {launched
            ? <a href={PLAY_STORE} className="btn-primary" target="_blank" rel="noopener noreferrer">Try Free for 7 Days</a>
            : <a href="/#originals" className="btn-primary">Get Originals — €67 Lifetime</a>}
          <p style={{marginTop:'1rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'}}>
            €2.99/month · €19.99/year · 7-day free trial · Cancel anytime
          </p>
          <p style={{marginTop:'0.25rem',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'}}>
            Yapper Originals: €67 lifetime (1,000 spots)
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:'1rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
            <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" style={{color:'var(--text-secondary)',fontSize:'0.85rem'}}>Google Play</a>
            <a href={SAMSUNG_STORE} target="_blank" rel="noopener noreferrer" style={{color:'var(--text-secondary)',fontSize:'0.85rem'}}>Samsung Galaxy Store</a>
          </div>
        </div>
      </section>

      {/* FOOTER (same as landing) */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}><img src="/yapper_logo.svg" alt="" width="24" height="24" style={{background:'none'}} /><h4 style={{margin:0}}>Yapper Phone</h4></div>
            <p>Health Communications Technology — a category invented by Yapper.</p>
            <p style={{marginTop:'0.5rem'}}>© 2026 SUPER SINCE BIRTH Tmi</p>
          </div>
          <div>
            <h5>Product</h5>
            <ul className="footer-links"><li><a href="/">Home</a></li><li><a href="/#pricing">Pricing</a></li><li><a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">Google Play</a></li><li><a href={SAMSUNG_STORE} target="_blank" rel="noopener noreferrer">Samsung Galaxy Store</a></li></ul>
          </div>
          <div>
            <h5>Community</h5>
            <ul className="footer-links"><li><a href="https://discord.gg/yapperphone" target="_blank" rel="noopener noreferrer">Discord</a></li><li><a href="https://instagram.com/yapperphone" target="_blank" rel="noopener noreferrer">Instagram</a></li><li><a href="https://tiktok.com/@yapperphone" target="_blank" rel="noopener noreferrer">TikTok</a></li></ul>
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
    </div>
  )
}
