import { useEffect, useRef } from 'react'

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.yapperphone.app'
const SAMSUNG_STORE = 'https://galaxystore.samsung.com/detail/com.yapperphone.app'
const LAUNCH_DATE = new Date('2026-04-16T09:00:00+03:00')

function Navbar() {
  const launched = Date.now() >= LAUNCH_DATE.getTime()
  return (
    <nav className="navbar scrolled" style={{top:16}} aria-label="Main navigation">
      <a href="/" className="navbar-logo">
        <img src="/yapper_logo.svg" alt="Yapper Phone" width="28" height="28" style={{background:'none'}} />
        <span>Yapper Phone</span>
      </a>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/#pricing">Pricing</a></li>
      </ul>
      {launched
        ? <a href={PLAY_STORE} className="navbar-cta" target="_blank" rel="noopener noreferrer">Try Free</a>
        : <a href="/#originals" className="navbar-cta">Get Originals</a>}
    </nav>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}><img src="/yapper_logo.svg" alt="" width="24" height="24" style={{background:'none'}} /><h4 style={{margin:0}}>Yapper Phone</h4></div>
          <p>Health Communications Technology — a category invented by Yapper.</p>
          <p style={{marginTop:'0.5rem'}}>© 2026 SUPER SINCE BIRTH Tmi</p>
        </div>
        <div>
          <h5>Legal</h5>
          <ul className="footer-links">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/legal">Legal Information</a></li>
          </ul>
        </div>
        <div>
          <h5>Contact</h5>
          <ul className="footer-links"><li><a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a></li></ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-status"><span className="status-dot" /> System Operational</div>
        <p>Institute for The Study Of Humanity and Maximized Impact ry</p>
        <p>667+ USPTO Provisional Patent Applications · February 27, 2026</p>
      </div>
    </footer>
  )
}

function PrivacyPolicy() {
  return (
    <div className="legal-content">
      <h1>Privacy Policy</h1>
      <p className="legal-meta">Effective date: April 18, 2026 · Last updated: April 18, 2026</p>
      <p>This Privacy Policy describes how Yapper Phone handles your personal data. It is written to be read, not to be hidden behind.</p>

      <h2>1. Who controls your data</h2>
      <p>The data controller for Yapper Phone is:</p>
      <p><strong>SUPER SINCE BIRTH Tmi</strong><br/>Business ID (Y-tunnus): 2461315-1<br/>Aleksis Kiven katu 45 B 21<br/>00520 Helsinki, Finland<br/><a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a></p>
      <p>For any question about your data, including the rights described in Section 9, write to that email. You will receive a response within 30 days.</p>

      <h2>2. Our approach to your data</h2>
      <p>Yapper Phone was built to keep your personal life on your phone. Most of what the app generates — your calls, your notes, your contacts, your relationships, your behavioral dashboard, your health data — is stored locally on your device and never transmitted to us or to any third party.</p>
      <p>A small amount of data leaves your device, and only when strictly necessary:</p>
      <ul>
        <li>Your Google account identifier, so your paid subscription follows you across devices and reinstalls</li>
        <li>Your Stripe payment information, if and when you purchase Yapper Originals or gift a subscription</li>
        <li>Call-duration negotiation data when both participants of a call use Yapper, so your two devices can agree on a call length</li>
        <li>Crash reports, so we can fix bugs</li>
        <li>Pseudonymous technical identifiers inherent to running Firebase SDKs</li>
      </ul>
      <p>That is the complete list. We do not collect analytics about how you use the app. We do not sell data. We do not serve advertising. We do not share data with brokers, marketers, or third parties not listed in this policy.</p>

      <h2>3. Data that stays on your device</h2>
      <p>The following data is stored only on your device and is never transmitted to us or to any third party:</p>
      <ul>
        <li>Contacts and contact details, tags, relationship notes</li>
        <li>Medications, medical conditions, blood type, allergies, and emergency contacts that you record for loved ones</li>
        <li>Your own medical information — conditions, medications, blood type, allergies — if you choose to enable the ICE lock-screen emergency info feature</li>
        <li>Call history, call durations, call types, call agendas, and call participants</li>
        <li>Call notes that you type</li>
        <li>Your phone number, stored as a SHA-256 hash — the raw number is hashed on your device and the hash never leaves it</li>
        <li>Behavioral dashboard data, including call patterns, focus usage, and time-signal usage</li>
        <li>Settings, preferences, language, timer profiles, focus sound preferences, time signal intervals, battery alert thresholds</li>
        <li>Any file, folder, or note you create within the app</li>
      </ul>
      <p>All data in this section is stored exclusively in Yapper Phone's private storage on your device. <strong>Firebase Firestore has no access to this data, and neither do we.</strong> If something happens to your device, we cannot restore this data. You can delete any of it at any time by uninstalling the app or by using Android's storage access controls.</p>

      <h2>4. Data that is transmitted</h2>

      <h3>4.1 Google account identifier</h3>
      <p>When you start a free trial, subscribe, redeem Yapper Originals, or redeem a promo code, you are asked to sign in with Google. A stable identifier for your Google account, along with the associated email, is transmitted from your device to our backend (Firebase Firestore, operated on Google Cloud) and stored there for a single purpose: tracking whether your account has a paid entitlement. This allows your subscription to follow you when you reinstall the app, change devices, or replace your phone.</p>
      <p>We do not access your Google Drive, Contacts, Calendar, Photos, or any other Google service. The only scopes requested are <code>profile</code> and <code>email</code>.</p>
      <p><strong>Legal basis:</strong> performance of a contract (GDPR Art. 6(1)(b)) — processing is necessary to provide the paid service you have purchased.</p>

      <h3>4.2 Firebase Anonymous Authentication and call-duration negotiation</h3>
      <p>The app uses Firebase Anonymous Authentication to manage your session. This generates a randomized session identifier that is not tied to your identity and changes when you reinstall the app.</p>
      <p>When you call another Yapper user, the call-duration negotiation between your two devices works through Firebase Firestore, governed by security rules that:</p>
      <ul>
        <li>Match your device and the other party's device using SHA-256 hashed phone numbers</li>
        <li>Permit only the two parties to a given call to read or write that call's negotiation data</li>
        <li>Do not expose your identity, your Google account, your contacts, your call content, or any other personal data to Google or to any third party</li>
      </ul>
      <p>What passes through Firestore during negotiation is limited to the minimal information the two devices need to agree: the proposed duration, the accepted duration, and the call type. The raw phone numbers are never transmitted — only their hashes.</p>
      <p><strong>Legal basis:</strong> legitimate interest (GDPR Art. 6(1)(f)) for session security; performance of a contract (GDPR Art. 6(1)(b)) for the call-duration negotiation feature.</p>

      <h3>4.3 Firebase Firestore writes</h3>
      <p>Firestore stores only the following records:</p>
      <ul>
        <li>Entitlement records keyed to your Google account — whether you have an active subscription, Yapper Originals lifetime access, Finnish Type 1 diabetic grant, or promo code entitlement, and the period of validity</li>
        <li>Gift records, when the gift feature launches — who sent a gift to whom and whether it has been redeemed</li>
        <li>Subscription state mirrored from Google Play Billing</li>
        <li>Transient call-duration negotiation data between two Yapper users, keyed to hashed phone numbers (see Section 4.2)</li>
      </ul>
      <p><strong>Firestore stores only the records listed above. It has no access to any data on your device — not your contacts, not your call history, not your notes, not your health information, not your behavioral dashboard.</strong> The data flow is strictly one direction: your device writes specific minimal records to Firestore for the purposes above. Firestore does not read from your device and cannot reach into it.</p>
      <p><strong>Legal basis:</strong> performance of a contract (GDPR Art. 6(1)(b)).</p>

      <h3>4.4 Stripe</h3>
      <p>If you purchase Yapper Originals (€67 lifetime) or buy Yapper as a gift, your payment information (name, email, card details) is processed by Stripe Payments Europe, Ltd. and Stripe, Inc. We never see your full card number. We receive your email so that we can match your payment to your Google account when you redeem your purchase in the app.</p>
      <p>Stripe's privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">https://stripe.com/privacy</a></p>
      <p><strong>Legal basis:</strong> performance of a contract (GDPR Art. 6(1)(b)).</p>

      <h3>4.5 Firebase Crashlytics</h3>
      <p>When the app crashes, a crash report is sent to Google (Firebase Crashlytics) so we can fix the bug. The report contains:</p>
      <ul>
        <li>The crash stack trace and error type</li>
        <li>Device model and operating system version</li>
        <li>A pseudonymous Firebase installation identifier</li>
        <li>The app state at the time of the crash — not the content of your calls, notes, contacts, or health data</li>
      </ul>
      <p>You can reset the installation identifier by clearing the app's data in Android settings.</p>
      <p><strong>Legal basis:</strong> legitimate interest (GDPR Art. 6(1)(f)) — identifying and fixing defects in the software.</p>

      <h3>4.6 Firebase SDK technical identifiers</h3>
      <p>Using Firebase SDKs (Anonymous Authentication, Firestore, Crashlytics) inherently involves pseudonymous technical identifiers that Firebase generates to operate those SDKs — including a Firebase Installations identifier. These identifiers are not tied to your name, your phone number, your contacts, your Google account, or the content of your calls. They allow Firebase to distinguish one app instance from another for technical purposes such as crash attribution and session management.</p>
      <p>You can reset these identifiers by clearing the app's data in Android settings.</p>
      <p><strong>Legal basis:</strong> legitimate interest (GDPR Art. 6(1)(f)) — technical operation of the application.</p>

      <h3>4.7 Google Play Billing</h3>
      <p>If you subscribe through the Google Play Store, your payment and subscription management is handled entirely by Google Play Billing. We receive confirmation of your subscription status from Google; we do not process your payment information.</p>
      <p>Google Play's privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></p>
      <p><strong>Legal basis:</strong> performance of a contract (GDPR Art. 6(1)(b)).</p>

      <h2>5. What we do not do</h2>
      <ul>
        <li><strong>We do not record your phone calls.</strong> The app does not request the <code>RECORD_AUDIO</code> permission. Under the current Android telephony architecture, call recording is not technically possible in Yapper Phone. A visual "record" button on the in-call screen is non-functional and displays a "Future feature" indicator when tapped.</li>
        <li>We do not collect or transmit voice recordings of any kind.</li>
        <li>We do not use analytics SDKs to track your behavior within the app. Firebase Analytics is not enabled. Firebase Remote Config is not used.</li>
        <li>We do not serve advertising.</li>
        <li>We do not use your data to train machine learning models.</li>
        <li>We do not share your data with data brokers or marketing partners.</li>
        <li>We do not transmit your contacts, messages, health data, or any content of your communications.</li>
        <li>We do not verify your phone number by SMS. Your phone number is never sent off your device in any form other than its SHA-256 hash, and only for the purpose of matching two Yapper users on a call.</li>
        <li>We do not have any access to the data stored on your device, including any medical or health information you enter.</li>
      </ul>

      <h2>6. Your control over your health data</h2>
      <p>If you use Yapper's ICE emergency features, you may choose to enter medical information about yourself — conditions, medications, blood type, allergies, emergency contacts. You may also choose to display some or all of this information on your device's lock screen so that anyone who picks up your phone in an emergency can see it and call your emergency contact.</p>
      <p><strong>This is always your choice.</strong> Nothing is displayed on the lock screen by default. You activate it. You control what is shown. You turn it off at any time. There is no setting that exposes your medical information without your explicit action.</p>
      <p>The same applies to medical information you record for loved ones: it is stored on your device only, visible only to you inside the app, and never transmitted or shared.</p>

      <h2>7. International transfers</h2>
      <p>Google (Firebase, Google Sign-In, Google Play Billing, Crashlytics) and Stripe are US-based companies with EU operations. When data is transferred to the United States, it is protected by the EU-U.S. Data Privacy Framework, standard contractual clauses, and the respective providers' supplementary safeguards.</p>

      <h2>8. Data retention</h2>
      <ul>
        <li><strong>Entitlement records:</strong> retained while you have an active or recently expired subscription, Originals lifetime access, or T1D grant. If you have no valid entitlement for more than 24 months and no payment history, we may delete the record.</li>
        <li><strong>Gift records (when launched):</strong> retained for 24 months after redemption or expiry.</li>
        <li><strong>Call-duration negotiation data:</strong> transient — typically deleted within minutes of the call ending.</li>
        <li><strong>Stripe payment records:</strong> retained by Stripe according to their policies, and by us only as required by Finnish tax and accounting law (currently 6 years).</li>
        <li><strong>Crashlytics data:</strong> retained by Google for 90 days by default.</li>
        <li><strong>Firebase installation identifiers:</strong> retained while the app is installed on your device; removed when you uninstall or clear app data.</li>
      </ul>
      <p>Data stored on your device is retained until you delete it or uninstall the app.</p>

      <h2>9. Your rights under GDPR</h2>
      <p>You have the following rights concerning your personal data:</p>
      <ul>
        <li><strong>Right of access</strong> — request a copy of the personal data we hold about you.</li>
        <li><strong>Right to rectification</strong> — ask us to correct inaccurate data.</li>
        <li><strong>Right to erasure</strong> — ask us to delete your data. For entitlement records, erasure may end your paid subscription.</li>
        <li><strong>Right to restriction</strong> — ask us to pause processing of your data.</li>
        <li><strong>Right to data portability</strong> — request your data in a machine-readable format.</li>
        <li><strong>Right to object</strong> — object to processing based on legitimate interest.</li>
        <li><strong>Right to withdraw consent</strong> — where processing is based on consent, withdraw it at any time.</li>
        <li><strong>Right to lodge a complaint</strong> — if you believe we have mishandled your data, you have the right to complain to the Finnish supervisory authority, the <strong>Office of the Data Protection Ombudsman</strong> (Tietosuojavaltuutetun toimisto, <a href="https://www.tietosuoja.fi" target="_blank" rel="noopener noreferrer">www.tietosuoja.fi</a>), or the supervisory authority in your country of residence.</li>
      </ul>
      <p>To exercise any of these rights, write to <a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a>. You will receive a response within 30 days. You do not need to justify your request.</p>
      <p>Since we do not have access to the data stored on your device, requests under these rights apply only to the data listed in Section 4 (entitlement records, Stripe payment records, Crashlytics data, Firebase technical identifiers).</p>

      <h2>10. Children</h2>
      <p>Yapper Phone is intended for users aged 13 and older. We do not knowingly process the personal data of children under 13. If you become aware that a child under 13 has provided personal data through Yapper Phone, please contact us so we can delete it.</p>

      <h2>11. Security</h2>
      <p>We use standard Android technical measures to protect your data:</p>
      <ul>
        <li>Encryption in transit (TLS) for all network transfers</li>
        <li>Android file-based encryption at rest for all app-private data, protected by your device credential</li>
        <li>Android Keystore-backed encryption for entitlement records, providing an additional layer of tamper resistance</li>
        <li>HMAC-signed entitlement records</li>
        <li>Firestore Security Rules that restrict access to authorized parties only</li>
        <li>Restricted access to backend systems, currently limited to the developer</li>
      </ul>
      <p>No security system is perfect. If we learn of a data breach that affects you, we will notify you and the Finnish supervisory authority within the timeframes required by GDPR (72 hours).</p>

      <h2>12. Changes to this Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time. When we make material changes, we will announce them in the app and update the "Last updated" date above. We will never reduce your rights without your explicit consent.</p>

      <h2>13. Institute for The Study Of Humanity and Maximized Impact ry</h2>
      <p>A substantial portion of profits from Yapper Phone is directed to the Institute for The Study Of Humanity and Maximized Impact ry, a registered Finnish research association (Y-tunnus 3564524-7). The Institute is a downstream beneficiary of profits only. It does not receive, process, or access any user personal data. It is not a data controller or data processor under this policy.</p>

      <h2>14. Contact</h2>
      <p><strong>SUPER SINCE BIRTH Tmi</strong><br/>Aleksis Kiven katu 45 B 21<br/>00520 Helsinki, Finland<br/><a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a></p>
    </div>
  )
}

function TermsOfService() {
  return (
    <div className="legal-content">
      <h1>Terms of Service</h1>
      <p className="legal-meta">Effective date: April 18, 2026 · Last updated: April 18, 2026</p>
      <p>These Terms of Service govern your use of Yapper Phone. Read them before you subscribe. They are written to be clear, not to trap you.</p>

      <h2>1. Who we are</h2>
      <p>Yapper Phone is developed and operated by:</p>
      <p><strong>SUPER SINCE BIRTH Tmi</strong><br/>Business ID (Y-tunnus): 2461315-1<br/>Aleksis Kiven katu 45 B 21<br/>00520 Helsinki, Finland<br/><a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a></p>

      <h2>2. The service</h2>
      <p>Yapper Phone is an Android application that replaces your default phone dialer with a time-aware calling system. It includes features such as duration-first calling, bilateral duration negotiation, in-call countdown timers, focus audio, time signals, ICE emergency functions, call notes, and relationship management tools.</p>
      <p>The app does not record phone calls and does not request microphone permission for call recording. A visual "record" button in the in-call screen is non-functional and displays a "Future feature" indicator when tapped.</p>

      <h2>3. Who can use Yapper Phone</h2>
      <p>You must be at least 13 years old to use Yapper Phone. If you are between 13 and the age of majority in your country, you should have the consent of a parent or legal guardian.</p>
      <p>Yapper Phone is available globally on Android devices running a supported version of the operating system. Subscription, Yapper Originals redemption, and promo code redemption require a Google account.</p>

      <h2>4. Accounts and identity</h2>
      <p>Yapper Phone uses two identity layers:</p>
      <ul>
        <li><strong>Anonymous local session</strong> — a randomized identifier tied to your app installation. Used to operate features within the app. Not tied to your name or contact details.</li>
        <li><strong>Google account</strong> — required only when you start a paid subscription, redeem Yapper Originals, or redeem a promo code. Used to anchor your paid entitlement so it follows you across reinstalls and devices.</li>
      </ul>
      <p>You are responsible for maintaining the security of your Google account. We cannot restore a paid entitlement to a Google account you no longer control.</p>

      <h2>5. Subscriptions</h2>

      <h3>5.1 Plans and prices</h3>
      <ul>
        <li><strong>Monthly:</strong> €2.99 per month, with a 7-day free trial for new subscribers</li>
        <li><strong>Annual:</strong> €19.99 per year, with a 7-day free trial for new subscribers</li>
      </ul>
      <p>Both plans include the same features: all 34 shipping features, all six call types, and ICE Emergency functionality. There is no lower-tier "free" version of the app. Without an active subscription, free trial, Yapper Originals lifetime access, Finnish Type 1 diabetic grant, or valid promo code, the app does not function as a dialer.</p>

      <h3>5.2 Free trial</h3>
      <p>New subscribers receive a 7-day free trial. You are not charged during the trial. If you do not cancel before the trial ends, your subscription begins automatically at the price of your selected plan. You can cancel at any time during the trial in your Google Play subscription settings.</p>
      <p>Free trial eligibility is limited to new subscribers. If you have previously held a paid subscription on the same Google account, you may not be eligible for a new trial.</p>

      <h3>5.3 Billing, renewal, and cancellation</h3>
      <p>Subscriptions are billed through Google Play Billing and renew automatically at the end of each period unless cancelled. To cancel:</p>
      <ol>
        <li>Open the Google Play Store app on your device</li>
        <li>Tap your profile icon, then Payments & subscriptions {'>'} Subscriptions</li>
        <li>Select Yapper Phone and follow the instructions to cancel</li>
      </ol>
      <p>Cancellation takes effect at the end of your current paid period. You retain access to paid features until the period ends. No further charges are made after cancellation.</p>

      <h3>5.4 Refunds</h3>
      <p>Refunds are handled by Google Play according to <a href="https://support.google.com/googleplay/answer/2479637" target="_blank" rel="noopener noreferrer">Google's refund policy</a>.</p>
      <p>Under the EU Consumer Rights Directive, consumers in the EU have a 14-day right of withdrawal from digital service purchases. By starting your free trial or by using paid features, you expressly agree to begin the service before the 14-day withdrawal period ends, which — under the Directive — forfeits the withdrawal right for digital content supplied with your prior express consent.</p>

      <h3>5.5 Price changes</h3>
      <p>We may change subscription prices. Any price change takes effect at your next renewal, and only after we have notified you in advance through the app, by email at the address associated with your Google Play account, or both. You can cancel at any time before a price change takes effect.</p>

      <h2>6. Yapper Originals</h2>
      <p>Yapper Originals is a one-time lifetime purchase for €67, processed through Stripe, limited to the first 1,000 purchasers globally. It includes:</p>
      <ul>
        <li>Lifetime access to all current and future Yapper Pro features</li>
        <li>Your name permanently displayed on the Founders screen inside the app</li>
        <li>Early access to new features before public release</li>
      </ul>

      <h3>6.1 Redemption</h3>
      <p>After purchase, you redeem your Yapper Originals entitlement by signing into the app with the same Google account you intend to use on your device. If the email used at Stripe checkout does not match a Google account you can sign into, contact <a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a> for manual verification.</p>

      <h3>6.2 What "lifetime" means</h3>
      <p>"Lifetime" refers to the operational lifetime of Yapper Phone and its successor products operated by SUPER SINCE BIRTH Tmi or its successors. If the service is permanently discontinued, you are not automatically entitled to a refund, but we will give you advance notice and — where legally required — a reasonable prorated refund.</p>

      <h3>6.3 Refunds for Originals</h3>
      <p>Under the EU Consumer Rights Directive, you have a 14-day right of withdrawal from a Yapper Originals purchase. After 14 days, the purchase is non-refundable. If you request a refund within 14 days and have not yet redeemed your Originals entitlement in the app, you will receive a full refund. If you have redeemed the entitlement, you have begun the service and waived the right of withdrawal.</p>

      <h3>6.4 Non-transferable</h3>
      <p>Yapper Originals is tied to one Google account and cannot be transferred, sold, or shared. Attempted transfers may result in termination without refund.</p>

      <h2>7. Finnish Type 1 diabetic grant program</h2>
      <p>As part of the mission of the Institute for The Study Of Humanity and Maximized Impact ry, free lifetime Yapper Pro access is offered to Finnish residents living with Type 1 diabetes. To apply, email <a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a> with reasonable evidence of diagnosis and Finnish residence. Verification is conducted manually and at our reasonable discretion. Grants are not transferable.</p>

      <h2>8. Gifts (planned feature)</h2>
      <p>A gift mechanic is planned for a future release. When it launches, each paying subscriber will be able to gift one free month of Yapper Pro to another person. Further details — eligibility, redemption, and terms — will be published when the feature ships and these Terms will be updated accordingly.</p>

      <h2>9. Promo codes</h2>
      <p>We may from time to time distribute promo codes that grant temporary Yapper Pro entitlement (typically 30 days). Promo codes:</p>
      <ul>
        <li>Are limited to one per Google account</li>
        <li>Are not transferable or sellable</li>
        <li>Do not stack with existing subscriptions</li>
        <li>Expire at the stated duration</li>
        <li>After expiry, you may subscribe through Google Play Billing normally</li>
      </ul>

      <h2>10. Your use of the service</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Reverse engineer, decompile, or disassemble the app, except to the extent expressly permitted by applicable law (including EU interoperability exceptions)</li>
        <li>Use the app for unlawful purposes</li>
        <li>Attempt to bypass entitlement enforcement</li>
        <li>Automate or script the app for purposes other than normal personal use</li>
        <li>Resell, sublicense, or redistribute the app or any entitlement</li>
      </ul>

      <h2>11. ICE Emergency features</h2>
      <p>Yapper Phone includes ICE Emergency calling, ICE Checkup, and a lock-screen emergency info card. These features are designed to increase the likelihood of reaching help in an emergency. <strong>They are not a substitute for emergency services or professional medical supervision.</strong> In a life-threatening emergency, call your country's emergency number directly (112 in the EU, 911 in the United States).</p>
      <p>We make no guarantee that ICE features will function in every circumstance. Factors outside our control — including cellular coverage, device state, battery level, recipient availability, and operating system behavior — can prevent calls from being placed or received.</p>

      <h2>12. Intellectual property</h2>
      <p>Yapper Phone, including all code, designs, trademarks, and the name "Yapper," is the property of SUPER SINCE BIRTH Tmi and its successors. 667+ USPTO provisional patent applications covering the technology in Yapper Phone were filed on February 27, 2026.</p>
      <p>You receive a non-exclusive, non-transferable, revocable license to use the app on your personal devices while you have a valid entitlement. You do not acquire any ownership interest in Yapper Phone or its underlying intellectual property.</p>

      <h2>13. Disclaimers</h2>
      <p>Yapper Phone is provided "as is." To the maximum extent permitted by law, we disclaim all warranties, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the app will be uninterrupted, error-free, or free from bugs.</p>
      <p>These disclaimers do not limit any rights you have as a consumer under Finnish or EU law that cannot be disclaimed by contract.</p>

      <h2>14. Limitation of liability</h2>
      <p>To the maximum extent permitted by law, SUPER SINCE BIRTH Tmi is not liable for indirect, incidental, consequential, special, or punitive damages arising from your use of or inability to use Yapper Phone, including loss of profits, loss of data, or business interruption.</p>
      <p>Our aggregate liability to you for any claim arising from or related to these Terms or Yapper Phone is limited to the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) €100.</p>
      <p>These limitations do not apply to liability for death, personal injury, fraud, or gross negligence, or to any liability that cannot be limited under Finnish or EU law.</p>

      <h2>15. Changes to these Terms</h2>
      <p>We may update these Terms. When we make material changes, we will notify you in the app and update the "Last updated" date above. If you do not agree with the changes, you may cancel your subscription and stop using the app.</p>

      <h2>16. Termination</h2>
      <p>You may stop using Yapper Phone at any time by cancelling your subscription and uninstalling the app.</p>
      <p>We may suspend or terminate your access if you materially breach these Terms. Where reasonably possible, we will give you notice and an opportunity to cure the breach. Termination does not entitle you to a refund for the unused portion of a subscription, except where legally required.</p>

      <h2>17. Governing law and disputes</h2>
      <p>These Terms are governed by the laws of Finland. Disputes arising from these Terms are subject to the exclusive jurisdiction of the Helsinki District Court, except that consumers may bring disputes in the courts of their country of residence as permitted by mandatory consumer protection law.</p>

      <h3>17.1 Consumer dispute resolution</h3>
      <p>If you are a consumer in Finland and have a dispute with us that we have not resolved to your satisfaction, you may refer the matter to the <strong>Finnish Consumer Disputes Board</strong> (Kuluttajariitalautakunta): <a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer">www.kuluttajariita.fi</a>. Before submitting a dispute, please contact the Finnish Consumer Advisory Services: <a href="https://www.kkv.fi" target="_blank" rel="noopener noreferrer">www.kkv.fi</a>.</p>

      <h3>17.2 EU online dispute resolution</h3>
      <p>If you are a consumer resident in the European Union, you may also use the European Commission's Online Dispute Resolution platform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>

      <h2>18. Contact</h2>
      <p><strong>SUPER SINCE BIRTH Tmi</strong><br/>Aleksis Kiven katu 45 B 21<br/>00520 Helsinki, Finland<br/><a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a></p>
    </div>
  )
}

function LegalImprint() {
  return (
    <div className="legal-content">
      <h1>Legal Information</h1>

      <h2>Service operator</h2>
      <p><strong>SUPER SINCE BIRTH Tmi</strong><br/>Business ID (Y-tunnus): 2461315-1<br/>Aleksis Kiven katu 45 B 21<br/>00520 Helsinki, Finland</p>
      <p>Sole proprietor: Janne Mikael Vakkilainen</p>

      <h2>Contact</h2>
      <p>General and privacy: <a href="mailto:janne@yapperphone.app">janne@yapperphone.app</a></p>

      <h2>Regulatory information</h2>
      <p>SUPER SINCE BIRTH Tmi is a Finnish sole proprietorship (toiminimi) registered with the Finnish Patent and Registration Office (PRH).</p>

      <h2>Research association</h2>
      <p>Yapper Phone is developed alongside the research mission of the <strong>Institute for The Study Of Humanity and Maximized Impact ry</strong> (Y-tunnus 3564524-7), a Finnish registered research association. A substantial portion of profits from Yapper Phone funds the Institute.</p>

      <h2>Patent notice</h2>
      <p>Yapper Phone is covered by 667+ USPTO provisional patent applications filed on February 27, 2026.</p>

      <h2>Dispute resolution</h2>
      <ul>
        <li>Finnish Consumer Disputes Board: <a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer">www.kuluttajariita.fi</a></li>
        <li>Finnish Consumer Advisory Services: <a href="https://www.kkv.fi" target="_blank" rel="noopener noreferrer">www.kkv.fi</a></li>
        <li>EU Online Dispute Resolution platform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a></li>
      </ul>

      <h2>Legal documents</h2>
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
      </ul>
    </div>
  )
}

export default function LegalPage({page}) {
  const mainRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  let content
  if (page === 'privacy') content = <PrivacyPolicy />
  else if (page === 'terms') content = <TermsOfService />
  else content = <LegalImprint />

  return (
    <div ref={mainRef}>
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <section className="section section-dark" style={{paddingTop:'7rem'}}>
        <div className="section-inner">
          {content}
        </div>
      </section>
      <Footer />
    </div>
  )
}
