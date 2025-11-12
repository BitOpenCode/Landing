import { useGlowEffect } from '../hooks/useGlowEffect'

const City = () => {
  useGlowEffect()

  return (
    <section className="content-section section" id="city">
      <div className="container">
        <h2 className="section-title" data-heading="City Screen">City Screen</h2>
        <div className="content-wrapper">
          <h3>Explore and Manage Your Mining City</h3>
          <p>Build and expand your mining infrastructure in the city view. Plan your layout strategically to maximize efficiency.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🏙️ City Management Features</h4>
              <ul>
                <li><strong>Strategic Placement:</strong> Position Land, Energy Stations, and Datacenters for optimal performance</li>
                <li><strong>Infrastructure View:</strong> Visual overview of your entire mining operation</li>
                <li><strong>Capacity Planning:</strong> See where you can expand and what's needed</li>
                <li><strong>Resource Distribution:</strong> Manage energy flow across your assets</li>
                <li><strong>City Growth:</strong> Watch your mining hub develop over time</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">🏗️ Building Types</h4>
              <ul>
                <li><strong>Land:</strong> Foundation for other structures. Only 137 total in the game!</li>
                <li><strong>Energy Stations:</strong> Power generation. Limited to 137 units.</li>
                <li><strong>Datacenters:</strong> Housing for ASICs. Max capacity 250 ASICs per datacenter.</li>
                <li><strong>ASIC Farms:</strong> Mining hardware placement and management</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">💡 City Planning Tips</h4>
              <ul>
                <li><strong>Start Small:</strong> Use Welcome Bonus assets effectively</li>
                <li><strong>Energy First:</strong> Ensure adequate Energy Stations before expanding</li>
                <li><strong>Land is Scarce:</strong> Every Land placement should be strategic</li>
                <li><strong>Datacenter Capacity:</strong> Plan ASIC placement according to datacenter limits</li>
                <li><strong>Balanced Growth:</strong> Don't over-extend - maintain energy balance</li>
                <li><strong>Marketplace Opportunities:</strong> Consider acquiring additional Land/Energy/Datacenters if available</li>
              </ul>
            </div>

            <div className="feature-card">
              <span className="glow"></span>
              <h4 className="card-title">📊 City Development Progression</h4>
              <ul>
                <li><strong>Early Stage:</strong> Focus on basic infrastructure with Welcome Bonus</li>
                <li><strong>Growth Stage:</strong> Expand through marketplace purchases or in-game achievements</li>
                <li><strong>Optimization Stage:</strong> Fine-tune layout for maximum efficiency</li>
                <li><strong>Final Stage:</strong> Reach final level with optimized city configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default City
