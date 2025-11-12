import { useGlowEffect } from '../hooks/useGlowEffect'

const Guides = () => {
  useGlowEffect()

  return (
    <section className="content-section section" id="guides">
      <div className="container">
        <h2 className="section-title" data-heading="Guides">Guides</h2>
        <div className="content-wrapper">
          <h3>Step-by-Step Tutorials for All Game Features</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">📖 Getting Started Guide</h4>
              <ul>
                <li>Account setup and verification</li>
                <li>How to claim Welcome Bonus</li>
                <li>Understanding the game interface</li>
                <li>Your first mining operation</li>
                <li>Basics of XP currency</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🏗️ Building Your Mining Hub</h4>
              <ul>
                <li>How to place and manage ASICs</li>
                <li>Land placement and optimization</li>
                <li>Energy Station management</li>
                <li>Datacenter capacity planning</li>
                <li>City infrastructure development</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">💱 Marketplace Trading Guide</h4>
              <ul>
                <li>How to list assets for sale</li>
                <li>Buying assets from other players</li>
                <li>Understanding market prices</li>
                <li>Price risk and disclaimer</li>
                <li>Trading best practices</li>
                <li>Tax considerations (users responsible for own taxes)</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">👥 Social Features</h4>
              <ul>
                <li>Joining BTC Game Pools</li>
                <li>Ambassador Program enrollment</li>
                <li>How referrals work</li>
                <li>Community participation</li>
                <li>Leaderboard rankings explained</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🎯 Advanced Features</h4>
              <ul>
                <li>Visualizer analytics</li>
                <li>Optimizing for final level</li>
                <li>Reward eligibility and payout</li>
                <li>Event participation</li>
                <li>Maximizing loyalty points</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">❓ FAQ & Troubleshooting</h4>
              <ul>
                <li>Common issues and solutions</li>
                <li>Account security</li>
                <li>Asset recovery (if applicable)</li>
                <li>Support contact information</li>
                <li>Terms of Service overview</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Guides
