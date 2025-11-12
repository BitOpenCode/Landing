import { useGlowEffect } from '../hooks/useGlowEffect'

const Community = () => {
  useGlowEffect()

  return (
    <section className="content-section section" id="community">
      <div className="container">
        <h2 className="section-title" data-heading="Community">Community</h2>
        <div className="content-wrapper">
          <h3>Join Thousands of Miners in the ECOS Ecosystem</h3>
          <p>Connect with other players, share strategies, participate in events, and grow your mining empire together.</p>
          
          <div className="community-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🔗 Connect With Us</h4>
              <div className="social-platforms">
                <a href="#" className="community-link">
                  <i className="uil uil-telegram"></i>
                  <span>Telegram Community</span>
                </a>
                <a href="#" className="community-link">
                  <i className="uil uil-discord"></i>
                  <span>Discord Server</span>
                </a>
                <a href="#" className="community-link">
                  <i className="uil uil-twitter"></i>
                  <span>Twitter/X</span>
                </a>
              </div>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🌟 Community Benefits</h4>
              <ul>
                <li><strong>Strategy Sharing:</strong> Learn from experienced players</li>
                <li><strong>Marketplace Insights:</strong> Discuss asset prices and trends</li>
                <li><strong>Pool Coordination:</strong> Find teammates for mining pools</li>
                <li><strong>Referral Network:</strong> Build your ambassador network</li>
                <li><strong>Event Updates:</strong> Stay informed about special events</li>
                <li><strong>Support:</strong> Get help from community and moderators</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">📜 Community Guidelines</h4>
              <ul>
                <li>Be respectful to all community members</li>
                <li>No market manipulation discussions or coordination</li>
                <li>No spamming or promotional content without permission</li>
                <li>Follow Terms of Service at all times</li>
                <li>Report suspicious activity to moderators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Community

