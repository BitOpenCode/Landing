import { useGlowEffect } from '../hooks/useGlowEffect'

const Ambassador = () => {
  useGlowEffect()

  return (
    <section className="content-section section" id="ambassador">
      <div className="container">
        <h2 className="section-title" data-heading="Ambassador Program">Ambassador Program</h2>
        <div className="content-wrapper">
          <h3>Become an ECOS Ambassador</h3>
          <p>Share ECOS Mining Game with your network and earn rewards for each active player you bring to the game.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🎁 Referral Rewards</h4>
              <ul>
                <li><strong>1-5 TON</strong> per successful referral (when both players reach final level)</li>
                <li>Limited to a specific number of referrals per month</li>
                <li>Rewards paid in cryptocurrency to your verified wallet</li>
                <li>Both you and your referred friend receive bonuses</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">✅ Requirements</h4>
              <ul>
                <li>Reach final game level</li>
                <li>Maintain active account in good standing</li>
                <li>Verify your wallet address for payouts</li>
                <li>Complete KYC/AML verification (if required)</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">📋 How It Works</h4>
              <ol>
                <li>Get your unique referral link from the game</li>
                <li>Share it with friends, community, social media</li>
                <li>Your referrals sign up and start playing</li>
                <li>When both you and your referral reach final level, you both earn rewards</li>
                <li>Payouts processed monthly (5-30 business days)</li>
              </ol>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">⚖️ Terms</h4>
              <p>Rewards are voluntary gifts from ECOS, not guaranteed obligations. ECOS may modify or terminate the program at any time. Read full terms in section 4.7 of Terms of Service.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Ambassador
