import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()
  
  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <section className="about section" id="about">
      <h2 className="section-title" data-heading="About the Game">ECOS Mining Game</h2>

      <div className="about-container container grid">
        <div className="about-img" style={{background: 'transparent', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src="/images/btc-icon.png" alt="Bitcoin" className="btc-icon-img" style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
        </div>

        <div className="about-data">
          <h3 className="about-heading">What is ECOS Mining Game?</h3>
          <p className="about-description">
            ECOS Mining Game is an educational project from ECOS company, where you can mine xpBTC, 
            develop your mining skills and build your mining hub together with the city. Players can use 
            various strategies to earn loyalty points, bonuses and get discounts on real company products. 
            The best players and leaders will be given the opportunity to get real BTC
          </p>

          <div className="button" onClick={() => handleNavigate('/visualizer')} style={{ cursor: 'pointer' }}>
            <i className="uil uil-rocket button-icon"></i>Start Game
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

