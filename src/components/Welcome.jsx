const Welcome = () => {
  return (
    <section className="content-section section" id="welcome">
      <div className="container">
        <h2 className="section-title" data-heading="Welcome Bonus">Welcome Bonus</h2>
        <div className="content-wrapper">
          <h3>Start Mining & Get Free Assets</h3>
          <p>New players receive a complete starter pack to begin their mining journey immediately!</p>
          
          <div className="welcome-assets">
            <h4>🎁 What You Get</h4>
            <ul className="bonus-assets-list">
              <li><strong>1 ASIC</strong> - Your first mining hardware to start generating xpBTC</li>
              <li><strong>1 Land</strong> - Rare asset (only 137 total in game!) Place your infrastructure</li>
              <li><strong>1 Datacenter</strong> - Houses up to 250 ASICs. Critical for expansion</li>
              <li><strong>1 Energy Station</strong> - Powers your operations. Limited edition (137 total)</li>
            </ul>
            <p className="bonus-value">💎 <strong>Total Value:</strong> Complete starter infrastructure worth thousands of XP!</p>
          </div>

          <div className="welcome-how">
            <h4>📋 How to Claim</h4>
            <ol>
              <li>Create your ECOS Mining Game account</li>
              <li>Complete basic account setup and verification</li>
              <li>Welcome Bonus is automatically added to your inventory</li>
              <li>Start building your mining hub immediately!</li>
            </ol>
          </div>

          <div className="welcome-tips">
            <h4>💡 Making the Most of Your Bonus</h4>
            <ul>
              <li><strong>Strategic Placement:</strong> Position your Land carefully - it's valuable and limited</li>
              <li><strong>Energy Management:</strong> Use your Energy Station to power your ASIC efficiently</li>
              <li><strong>Datacenter Planning:</strong> You can add up to 249 more ASICs to your datacenter later</li>
              <li><strong>Marketplace Opportunity:</strong> These assets are tradeable - but keep them for your first month to learn!</li>
              <li><strong>Foundation Building:</strong> This starter pack gives you everything needed to reach early milestones</li>
            </ul>
          </div>

          <div className="welcome-note">
            <p>🚀 <strong>Start Your Journey:</strong> With this bonus, you can begin mining xpBTC, earning XP, and working toward final level rewards immediately. No initial investment required!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Welcome

