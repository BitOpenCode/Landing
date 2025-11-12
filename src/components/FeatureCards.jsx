import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FeatureCards = () => {
  const navigate = useNavigate()
  
  const handleCardClick = (path) => {
    navigate(path)
  }

  // Initialize glow effect for all cards after mount
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card')
    
    // Utility functions
    const centerOfElement = ($el) => {
      const { width, height } = $el.getBoundingClientRect()
      return [width / 2, height / 2]
    }

    const pointerPositionRelativeToElement = ($el, e) => {
      const pos = [e.clientX, e.clientY]
      const { left, top, width, height } = $el.getBoundingClientRect()
      const x = pos[0] - left
      const y = pos[1] - top
      const px = clamp((100 / width) * x)
      const py = clamp((100 / height) * y)
      return { pixels: [x, y], percent: [px, py] }
    }

    const angleFromPointerEvent = ($el, dx, dy) => {
      let angleRadians = 0
      let angleDegrees = 0
      if (dx !== 0 || dy !== 0) {
        angleRadians = Math.atan2(dy, dx)
        angleDegrees = angleRadians * (180 / Math.PI) + 90
        if (angleDegrees < 0) {
          angleDegrees += 360
        }
      }
      return angleDegrees
    }

    const distanceFromCenter = ($card, x, y) => {
      const [cx, cy] = centerOfElement($card)
      return [x - cx, y - cy]
    }

    const closenessToEdge = ($card, x, y) => {
      const [cx, cy] = centerOfElement($card)
      const [dx, dy] = distanceFromCenter($card, x, y)
      let k_x = Infinity
      let k_y = Infinity
      if (dx !== 0) {
        k_x = cx / Math.abs(dx)
      }
      if (dy !== 0) {
        k_y = cy / Math.abs(dy)
      }
      return clamp(1 / Math.min(k_x, k_y), 0, 1)
    }

    const round = (value, precision = 3) => parseFloat(value.toFixed(precision))
    const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max)

    const cardUpdate = ($card) => (e) => {
      const position = pointerPositionRelativeToElement($card, e)
      const [px, py] = position.pixels
      const [perx, pery] = position.percent
      const [dx, dy] = distanceFromCenter($card, px, py)
      const edge = closenessToEdge($card, px, py)
      const angle = angleFromPointerEvent($card, dx, dy)

      $card.style.setProperty('--pointer-x', `${round(perx)}%`)
      $card.style.setProperty('--pointer-y', `${round(pery)}%`)
      $card.style.setProperty('--pointer-°', `${round(angle)}deg`)
      $card.style.setProperty('--pointer-d', `${round(edge * 100)}`)

      $card.classList.remove('animating')
    }

    cards.forEach($card => {
      const updateHandler = cardUpdate($card)
      $card.addEventListener('pointermove', updateHandler)
      $card.addEventListener('pointerleave', () => {
        $card.style.setProperty('--pointer-d', '0')
      })
    })

    return () => {
      cards.forEach($card => {
        $card.removeEventListener('pointermove', cardUpdate($card))
      })
    }
  }, [])

  return (
    <section className="feature-cards section" id="feature-cards">
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <filter id="lensFilter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap in="SourceGraphic" in2="blur" scale="50" xChannelSelector="A" yChannelSelector="A" />
        </filter>
      </svg>
      <div className="container">
        {/* About section above the card */}
        <div className="about-section-above-card" style={{
          marginTop: '-8rem',
          marginBottom: '2rem',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/images/btc-icon.png" 
                alt="Bitcoin" 
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{
              flex: '1 1 300px'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--title-color)',
                marginBottom: '1rem'
              }}>
                What is ECOS Mining Game?
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: 'var(--text-color)',
                margin: 0
              }}>
                ECOS Mining Game is an educational project from ECOS company, where you can mine xpBTC, develop your mining skills and build your mining hub together with the city. Players can use various strategies to earn loyalty points, bonuses and get discounts on real company products. The best players and leaders will be given the opportunity to get real BTC
              </p>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          {/* Full-width card above Welcome Bonus, Assets, and Tips & Tricks */}
          <div className="feature-card feature-card-fullwidth glass-container glass-container--rounded">
            <span className="glow"></span>
            <div className="glass-filter"></div>
            <div className="glass-overlay"></div>
            <div className="glass-specular"></div>
            <div className="glass-content">
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.6',
                color: 'var(--text-color)',
                textAlign: 'center',
                margin: 0,
                fontWeight: 500
              }}>
                Build your virtual Bitcoin empire. Develop your mining hub. Unlock the opportunity to receive RWA from ECOS and start mining real BTC.
              </p>
            </div>
          </div>

          {/* Welcome Bonus Card - Large */}
          <div 
            className="feature-card feature-card-large feature-card-bonus" 
            onClick={() => handleCardClick('/welcome')}
          >
            <span className="glow"></span>
            <div className="bonus-content">
              <div className="bonus-text">
                <p className="bonus-subtitle">Start Mining & Get Free</p>
                <h2 className="bonus-title">Welcome<br/>Bonus!</h2>
                <p className="bonus-description">We give you:</p>
                <ul className="bonus-assets">
                  <li>1 ASIC</li>
                  <li>1 Land</li>
                  <li>1 Datacenter</li>
                  <li>1 Energy Station</li>
                </ul>
                <p className="bonus-free">All for free!</p>
                <div className="bonus-button" onClick={(e) => { e.stopPropagation(); handleCardClick('/welcome'); }}>
                  CLAIM NOW
                </div>
              </div>
              <div className="bonus-visual">
                <img src="/images/welcome-icon.png" alt="Welcome Bonus" className="bonus-gift-img"/>
              </div>
            </div>
          </div>

          {/* Assets Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/assets')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-gear icon-image">
              <img src="/images/assets-icon.png" alt="Assets" className="icon-img"/>
            </div>
            <h3 className="card-title">Assets</h3>
            <p className="card-description">Explore all available Game Assets</p>
            <ul className="assets-list">
              <li>xpBTC</li>
              <li>XP</li>
              <li>kWt</li>
              <li>Land</li>
              <li>Datacenter</li>
              <li>Energy Station</li>
              <li>Tickets</li>
            </ul>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/assets'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* Economics Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/economics')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-book icon-image">
              <img src="/images/guides-icon.png" alt="Economics" className="icon-img"/>
            </div>
            <h3 className="card-title">Economics</h3>
            <p className="card-description">Game economy, parameters, and mining calculations</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/economics'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* Visualizer Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/visualizer')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-chart icon-image">
              <img src="/images/visualizer-icon.png" alt="Visualizer" className="icon-img"/>
            </div>
            <h3 className="card-title">Visualizer</h3>
            <p className="card-description">Track your mining progress in real-time</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/visualizer'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* BTC Game Pools Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/pools')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-network icon-image">
              <img src="/images/pools-icon.png" alt="BTC Game Pools" className="icon-img"/>
            </div>
            <h3 className="card-title">BTC Game Pools</h3>
            <p className="card-description">Join mining pools and collaborate with other players</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/pools'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/leaderboard')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-network icon-image">
              <img src="/images/leader-icon.png" alt="Leaderboard" className="icon-img"/>
            </div>
            <h3 className="card-title">Leaderboard</h3>
            <p className="card-description">Compete with top miners and climb the rankings</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/leaderboard'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* City Screen Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/city')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-network icon-image">
              <img src="/images/city-icon.png" alt="City Screen" className="icon-img"/>
            </div>
            <h3 className="card-title">City Screen</h3>
            <p className="card-description">Explore and manage your mining city</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/city'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* Ambassador Program Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/ambassador')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-network icon-image">
              <img src="/images/amba-icon.png" alt="Ambassador Program" className="icon-img"/>
            </div>
            <h3 className="card-title">Ambassador Program</h3>
            <p className="card-description">Become an ambassador and earn exclusive rewards</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/ambassador'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* Tips & Tricks Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/tips')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-lightning icon-image">
              <img src="/images/tips-icon.png" alt="Tips & Tricks" className="icon-img"/>
            </div>
            <h3 className="card-title">Tips & Tricks</h3>
            <p className="card-description">Pro strategies to maximize your mining efficiency</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/tips'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* Events Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/events')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-network icon-image">
              <img src="/images/event-icon.png" alt="Events" className="icon-img"/>
            </div>
            <h3 className="card-title">Events</h3>
            <p className="card-description">Participate in special events and tournaments</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/events'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>

          {/* Community Card */}
          <div 
            className="feature-card" 
            onClick={() => handleCardClick('/community')}
          >
            <span className="glow"></span>
            <div className="card-icon-3d icon-network icon-image">
              <img src="/images/community-icon.png" alt="Community" className="icon-img"/>
            </div>
            <h3 className="card-title">Community</h3>
            <p className="card-description">Join thousands of miners in the ECOS ecosystem</p>
            <div className="card-link" onClick={(e) => { e.stopPropagation(); handleCardClick('/community'); }}>
              <i className="uil uil-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureCards

