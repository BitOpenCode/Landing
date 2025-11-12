import { useState, useEffect, useRef } from 'react'
import { useGlowEffect } from '../hooks/useGlowEffect'
import { gsap } from 'gsap'

const PoolsVisualization = () => {
  useGlowEffect()
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [calculatorInput, setCalculatorInput] = useState({ th: 1000, level: 1 })
  const [comparisonMode, setComparisonMode] = useState(false)
  const levelRefs = useRef([])
  const pyramidRef = useRef(null)

  const poolLevels = [
    {
      level: 1,
      name: 'Local Pool',
      powerRange: { min: 0, max: 1000000 },
      bonus: 5,
      farms: { base: 30, boosted: 60 },
      boostCards: 3,
      fee: { min: 1, max: 1, fixed: true },
      additionalIncome: 0.000000024,
      color: '#ff6f00',
      icon: '🏠'
    },
    {
      level: 2,
      name: 'Regional Pool',
      powerRange: { min: 1000000, max: 100000000 },
      bonus: 10,
      farms: { base: 50, boosted: 100 },
      boostCards: 5,
      fee: { min: 0, max: 3 },
      additionalIncome: 0.000000048,
      color: '#ff8f00',
      icon: '🌍'
    },
    {
      level: 3,
      name: 'International Pool',
      powerRange: { min: 100000000, max: 1000000000 },
      bonus: 15,
      farms: { base: 80, boosted: 160 },
      boostCards: 8,
      fee: { min: 0, max: 10 },
      additionalIncome: 0.000000072,
      color: '#ffaa00',
      icon: '🌐'
    },
    {
      level: 4,
      name: 'Continental Pool',
      powerRange: { min: 1000000000, max: 3000000000 },
      bonus: 20,
      farms: { base: 100, boosted: 200 },
      boostCards: 10,
      fee: { min: 0, max: 15 },
      additionalIncome: 0.000000096,
      color: '#ffcc00',
      icon: '🌎'
    },
    {
      level: 5,
      name: 'Global Pool',
      powerRange: { min: 3000000000, max: Infinity },
      bonus: 25,
      farms: { base: 120, boosted: 240 },
      boostCards: 12,
      fee: { min: 0, max: 20 },
      additionalIncome: 0.00000012,
      color: '#ffdd00',
      icon: '🚀'
    }
  ]

  // Анимация пирамиды уровней
  useEffect(() => {
    if (pyramidRef.current && levelRefs.current.length > 0) {
      levelRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(ref, 
            { opacity: 0, y: 50, scale: 0.8 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 0.6, 
              delay: index * 0.1,
              ease: 'back.out(1.7)'
            }
          )
        }
      })
    }
  }, [])

  // Расчет доходности
  const calculateIncome = (th, level) => {
    const baseIncome = 0.00000048
    const poolData = poolLevels[level - 1]
    const bonusIncome = baseIncome * (poolData.bonus / 100)
    const totalIncome = baseIncome + bonusIncome
    const dailyIncome = totalIncome * th * 24
    const monthlyIncome = dailyIncome * 30
    
    return {
      base: baseIncome * th,
      bonus: bonusIncome * th,
      total: totalIncome * th,
      daily: dailyIncome,
      monthly: monthlyIncome
    }
  }

  const income = calculateIncome(calculatorInput.th, calculatorInput.level)

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K'
    return num.toFixed(2)
  }

  const formatPower = (th) => {
    if (th >= 1000000000) return (th / 1000000000).toFixed(2) + 'B Th/s'
    if (th >= 1000000) return (th / 1000000).toFixed(2) + 'M Th/s'
    if (th >= 1000) return (th / 1000).toFixed(2) + 'K Th/s'
    return th + ' Th/s'
  }

  return (
    <section className="pools-visualization section" id="pools">
      <div className="container">
        <h2 className="section-title" data-heading="BTC Game Pools">BTC Game Pools</h2>
        
        {/* Hero Section - Interactive Pyramid */}
        <div className="pools-hero" style={{ marginBottom: '4rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Pool Levels Hierarchy</h3>
          <div 
            ref={pyramidRef}
            className="pools-pyramid"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              margin: '2rem 0'
            }}
          >
            {poolLevels.map((pool, index) => {
              const width = 100 - (index * 15) // Уменьшаем ширину для каждого уровня
              const isSelected = selectedLevel === pool.level
              
              return (
                <div
                  key={pool.level}
                  ref={el => levelRefs.current[index] = el}
                  className={`feature-card pool-level-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedLevel(isSelected ? null : pool.level)}
                  style={{
                    width: `${width}%`,
                    maxWidth: '600px',
                    cursor: 'pointer',
                    border: `3px solid ${pool.color}`,
                    background: isSelected 
                      ? `linear-gradient(135deg, ${pool.color}20 0%, ${pool.color}10 100%)`
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    transition: 'all 0.3s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <span className="glow"></span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 className="card-title" style={{ margin: 0, fontSize: '1.5rem' }}>
                      {pool.icon} Level {pool.level} - {pool.name}
                    </h4>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold',
                      color: pool.color 
                    }}>
                      +{pool.bonus}%
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="pool-details" style={{ 
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: `1px solid ${pool.color}40`
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                          <strong>Power Range:</strong>
                          <p>{formatPower(pool.powerRange.min)} - {pool.powerRange.max === Infinity ? '∞' : formatPower(pool.powerRange.max)}</p>
                        </div>
                        <div>
                          <strong>Farms:</strong>
                          <p>{pool.farms.base} (base) / {pool.farms.boosted} (boosted)</p>
                        </div>
                        <div>
                          <strong>Fee:</strong>
                          <p>{pool.fee.fixed ? '1% (fixed)' : `${pool.fee.min}-${pool.fee.max}%`}</p>
                        </div>
                        <div>
                          <strong>Boost Cards:</strong>
                          <p>{pool.boostCards} × 10 people</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Interactive Calculator */}
        <div className="pools-calculator feature-card" style={{ marginBottom: '4rem', padding: '2rem' }}>
          <span className="glow"></span>
          <h3 className="card-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            💰 Income Calculator
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Your Hashrate (Th/s):
              </label>
              <input
                type="number"
                value={calculatorInput.th}
                onChange={(e) => setCalculatorInput({ ...calculatorInput, th: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid rgba(255, 111, 0, 0.3)',
                  background: 'var(--body-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem'
                }}
                min="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Pool Level:
              </label>
              <select
                value={calculatorInput.level}
                onChange={(e) => setCalculatorInput({ ...calculatorInput, level: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid rgba(255, 111, 0, 0.3)',
                  background: 'var(--body-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem'
                }}
              >
                {poolLevels.map(pool => (
                  <option key={pool.level} value={pool.level}>
                    Level {pool.level} - {pool.name} (+{pool.bonus}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(255, 111, 0, 0.1)',
            borderRadius: '1rem',
            border: '2px solid rgba(255, 111, 0, 0.3)'
          }}>
            <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>Estimated Income</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Base Income</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--skin-color)' }}>
                  {income.base.toFixed(8)} xpBTC/h
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Bonus Income</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff88' }}>
                  +{income.bonus.toFixed(8)} xpBTC/h
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Daily Income</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--skin-color)' }}>
                  {income.daily.toFixed(6)} xpBTC
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Monthly Income</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--skin-color)' }}>
                  {income.monthly.toFixed(4)} xpBTC
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Comparison */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>Level Comparison</h3>
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: '2px solid var(--skin-color)',
                background: comparisonMode ? 'var(--skin-color)' : 'transparent',
                color: comparisonMode ? 'var(--body-color)' : 'var(--skin-color)',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {comparisonMode ? 'Exit Comparison' : 'Compare Levels'}
            </button>
          </div>

          {comparisonMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {poolLevels.map(pool => (
                <div key={pool.level} className="feature-card" style={{ textAlign: 'center' }}>
                  <span className="glow"></span>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{pool.icon}</div>
                  <h4 className="card-title">Level {pool.level}</h4>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold',
                    color: pool.color,
                    margin: '0.5rem 0'
                  }}>
                    +{pool.bonus}%
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    {pool.farms.base} → {pool.farms.boosted} farms
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                    Fee: {pool.fee.fixed ? '1%' : `${pool.fee.min}-${pool.fee.max}%`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {poolLevels.map(pool => (
                <div key={pool.level} className="feature-card">
                  <span className="glow"></span>
                  <h4 className="card-title">{pool.icon} {pool.name}</h4>
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Power Range:</strong> {formatPower(pool.powerRange.min)} - {pool.powerRange.max === Infinity ? '∞' : formatPower(pool.powerRange.max)}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Bonus:</strong> <span style={{ color: pool.color, fontWeight: 'bold' }}>+{pool.bonus}%</span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Farms:</strong> {pool.farms.base} (base) / {pool.farms.boosted} (boosted)
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Fee:</strong> {pool.fee.fixed ? '1% (fixed)' : `${pool.fee.min}-${pool.fee.max}%`}
                    </div>
                    <div>
                      <strong>Additional Income:</strong> +{pool.additionalIncome.toFixed(11)} xpBTC per 1 TH
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pool Creation & Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="feature-card">
            <span className="glow"></span>
            <h4 className="card-title">💰 Creating a Pool</h4>
            <ul>
              <li><strong>Cost:</strong> 500,000 XP</li>
              <li>Choose pool name</li>
              <li>Select minimum entry level</li>
              <li>XP deducted upon confirmation</li>
            </ul>
          </div>

          <div className="feature-card">
            <span className="glow"></span>
            <h4 className="card-title">📊 Leveling Logic</h4>
            <p><strong>1000 Th = 1 Ph</strong></p>
            <ul>
              <li>Level 2: 1,000 PH required</li>
              <li>No level rollback</li>
              <li>Level persists even if PH drops</li>
            </ul>
          </div>

          <div className="feature-card">
            <span className="glow"></span>
            <h4 className="card-title">⚙️ Owner Features</h4>
            <ul>
              <li>Adjust commission (Level 2+)</li>
              <li>Change pool name</li>
              <li>Change entry requirements</li>
              <li>Boost pool capacity</li>
              <li>Gift XP to members</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PoolsVisualization

