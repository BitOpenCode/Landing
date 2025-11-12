import { useGlowEffect } from '../hooks/useGlowEffect'

const Tips = () => {
  useGlowEffect()

  return (
    <section className="content-section section" id="tips">
      <div className="container">
        <h2 className="section-title" data-heading="Tips & Tricks">Tips & Tricks</h2>
        <div className="content-wrapper">
          <h3>Pro Strategies to Maximize Your Mining Efficiency</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">⚡ Early Game Strategy</h4>
              <ul>
                <li><strong>Start with Welcome Bonus:</strong> Use your free ASIC, Land, Datacenter, and Energy Station wisely</li>
                <li><strong>Focus on Energy Management:</strong> Balance energy consumption with mining output</li>
                <li><strong>Level Up Strategically:</strong> Prioritize reaching milestones that unlock new features</li>
                <li><strong>Join Mining Pools Early:</strong> Collaborate with other players for better rewards</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🏆 Mid-Game Optimization</h4>
              <ul>
                <li><strong>Trade Assets Wisely:</strong> Monitor marketplace prices. Buy low, sell high (but remember: prices can drop to zero!)</li>
                <li><strong>Scarce Assets Strategy:</strong> Land, Energy Stations, and Datacenters are limited (137 each). Early investment may appreciate if demand grows</li>
                <li><strong>Diversify Your Portfolio:</strong> Don't put all XP into one asset type</li>
                <li><strong>Energy Stations Are Key:</strong> Increasing energy cap allows for more ASICs and higher output</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🎯 Advanced Techniques</h4>
              <ul>
                <li><strong>Marketplace Timing:</strong> Watch price trends over 24-48 hours before trading</li>
                <li><strong>Referral Program:</strong> Build a network of active players for referral bonuses</li>
                <li><strong>Leaderboard Climbing:</strong> Top players earn monthly rewards. Consistent activity beats occasional big plays</li>
                <li><strong>Final Level Preparation:</strong> Plan your path to final level - this unlocks reward eligibility</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">⚠️ Risk Management</h4>
              <ul>
                <li><strong>Never invest more than you can afford to lose</strong> - Asset values can drop to zero</li>
                <li><strong>Marketplace is P2P</strong> - Prices are volatile and determined by players, not ECOS</li>
                <li><strong>Understand Illiquidity Risk</strong> - You may not be able to sell assets when you want</li>
                <li><strong>Research Before Trading</strong> - Check market history and active listings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Tips
