import React, { useState } from 'react'
import { useGlowEffect } from '../hooks/useGlowEffect'
import Footer from '../components/Footer'

const EconomicsPage = () => {
  useGlowEffect()
  const [btcRate, setBtcRate] = useState(113000)
  const [asicCount, setAsicCount] = useState(1)
  
  // Расчеты
  const asicTh = 234 // 1 ASIC = 234 TH
  const thPerDay = 0.00000048 // 1 TH / Day в xpBTC
  const totalTh = asicCount * asicTh
  const profitXpBtc = totalTh * thPerDay
  const profitXp = profitXpBtc * btcRate

  const levels = [
    { level: 0, terahash: 234, nextLevel: 936, asicCount: 1 },
    { level: 1, terahash: 936, nextLevel: 4914, asicCount: 4 },
    { level: 2, terahash: 4914, nextLevel: 14976, asicCount: 21 },
    { level: 3, terahash: 14976, nextLevel: 24804, asicCount: 64 },
    { level: 4, terahash: 24804, nextLevel: 49842, asicCount: 106 },
    { level: 5, terahash: 49842, nextLevel: 99918, asicCount: 213 },
    { level: 6, terahash: 99918, nextLevel: 249912, asicCount: 427 },
    { level: 7, terahash: 249912, nextLevel: 499824, asicCount: 1068 },
    { level: 8, terahash: 499824, nextLevel: 999882, asicCount: 2136 },
    { level: 9, terahash: 999882, nextLevel: 7999992, asicCount: 4273 },
    { level: 10, terahash: 7999992, nextLevel: 1000000, asicCount: 34188, isExahash: true }
  ]

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  return (
    <>
      <section className="content-section section" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
        <div className="container">
          <h2 className="section-title" data-heading="Game Economics">Game Economics</h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Game Parameters Card */}
            <div className="feature-card">
              <span className="glow"></span>
              <h3 className="card-title" style={{ marginBottom: '1.5rem', color: 'var(--title-color)' }}>
                Game Parameters
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>1 TH / Day</span>
                  <span style={{ color: 'var(--skin-color)', fontWeight: 'bold' }}>0.00000048 xpBTC</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>ASIC S21Pro</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>234 TH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>ASIC Power</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>3.51 kW</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Energy Station</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>21,060 kWt</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Datacenter</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>50,000 XP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Energy Price</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>0.05 XP/kWt</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>ASIC Price</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>6,250 XP</span>
                </div>
              </div>
            </div>

            {/* Energy System Card */}
            <div className="feature-card">
              <span className="glow"></span>
              <h3 className="card-title" style={{ marginBottom: '1.5rem', color: 'var(--title-color)' }}>
                Energy System
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Starting Energy</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>10,530 kWt</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Energy Station</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>21,060 kWt</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Max Energy Stations</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>137</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Max Total Energy</span>
                  <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>2,885,220 kWt</span>
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: 'rgba(255, 111, 0, 0.1)', 
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 111, 0, 0.2)'
                }}>
                  <p style={{ color: 'var(--text-color)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Energy Consumption:</strong>
                  </p>
                  <p style={{ color: 'var(--text-color)', fontSize: '0.85rem' }}>
                    1 ASIC per 6h session: <strong>21.06 kWt</strong>
                  </p>
                  <p style={{ color: 'var(--text-color)', fontSize: '0.85rem' }}>
                    1 ASIC per 24h (4 sessions): <strong>84.24 kWt</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Mining Calculation Card */}
            <div className="feature-card">
              <span className="glow"></span>
              <h3 className="card-title" style={{ marginBottom: '1.5rem', color: 'var(--title-color)' }}>
                Mining Calculation
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>ASIC Count</span>
                  <input
                    type="number"
                    value={asicCount}
                    onChange={(e) => setAsicCount(parseInt(e.target.value) || 1)}
                    min="1"
                    style={{
                      width: '120px',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 111, 0, 0.3)',
                      background: 'var(--body-color)',
                      color: 'var(--text-color)',
                      fontSize: '0.9rem',
                      textAlign: 'right'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>BTC Rate ($)</span>
                  <input
                    type="number"
                    value={btcRate}
                    onChange={(e) => setBtcRate(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '120px',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 111, 0, 0.3)',
                      background: 'var(--body-color)',
                      color: 'var(--text-color)',
                      fontSize: '0.9rem',
                      textAlign: 'right'
                    }}
                  />
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: 'rgba(255, 111, 0, 0.1)', 
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 111, 0, 0.2)'
                }}>
                  <h4 style={{ color: 'var(--skin-color)', marginBottom: '0.75rem', fontSize: '1rem' }}>
                    Daily Profit (24 hours)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Total TH/s:</span>
                      <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>{formatNumber(totalTh)} TH</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Mining (xpBTC):</span>
                      <span style={{ color: 'var(--skin-color)', fontWeight: 'bold' }}>{profitXpBtc.toFixed(8)} xpBTC</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Mining (XP):</span>
                      <span style={{ color: 'var(--skin-color)', fontWeight: 'bold' }}>${profitXp.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 111, 0, 0.2)' }}>
                      <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>Energy Cost:</span>
                      <span style={{ color: '#ff4444', fontWeight: 'bold' }}>${(asicCount * 4.212).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 111, 0, 0.2)' }}>
                      <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>Net Profit:</span>
                      <span style={{ color: '#4caf50', fontWeight: 'bold' }}>${(profitXp - (asicCount * 4.212)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Levels Table Card */}
          <div className="feature-card" style={{ marginBottom: '3rem' }}>
            <span className="glow"></span>
            <h3 className="card-title" style={{ marginBottom: '2rem', color: 'var(--title-color)', textAlign: 'center' }}>
              Level Progression
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                color: 'var(--text-color)'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255, 111, 0, 0.3)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--title-color)' }}>Level</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--title-color)' }}>Terahash (Th)</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--title-color)' }}>ASIC Count</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--title-color)' }}>Next Level (Th)</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((level, index) => {
                    const displayNext = level.isExahash ? '1 Eh' : `${formatNumber(level.nextLevel)} Th`
                    return (
                      <tr 
                        key={level.level} 
                        style={{ 
                          borderBottom: '1px solid rgba(255, 111, 0, 0.1)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 111, 0, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--skin-color)' }}>
                          {level.level}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {formatNumber(level.terahash)} Th
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {formatNumber(level.asicCount)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {displayNext}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: 'rgba(255, 111, 0, 0.1)', 
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 111, 0, 0.2)'
            }}>
              <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--skin-color)' }}>Level 10 Achievement:</strong> Owning 7,999,992 Th (~1 Eh) means you control <strong>1%</strong> of the total Bitcoin network hashrate (real network: ~970 Eh).
              </p>
            </div>
          </div>

          {/* Game Logic Card */}
          <div className="feature-card">
            <span className="glow"></span>
            <h3 className="card-title" style={{ marginBottom: '1.5rem', color: 'var(--title-color)' }}>
              Game Logic & Starting Assets
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--skin-color)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                  Starting Assets
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--skin-color)' }}>✓</span>
                    <span>1 Land (free)</span>
                  </li>
                  <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--skin-color)' }}>✓</span>
                    <span>1 Datacenter (free)</span>
                  </li>
                  <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--skin-color)' }}>✓</span>
                    <span>1 Energy Station (free)</span>
                  </li>
                  <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--skin-color)' }}>✓</span>
                    <span>10,530 kWt free energy (~526.5 XP value)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'var(--skin-color)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                  Maximum Assets
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <li style={{ color: 'var(--text-color)' }}>
                    <strong>137 Land</strong> (maximum)
                  </li>
                  <li style={{ color: 'var(--text-color)' }}>
                    <strong>137 Datacenter</strong> (maximum)
                  </li>
                  <li style={{ color: 'var(--text-color)' }}>
                    <strong>137 Energy Station</strong> (maximum = 2,885,220 kWt)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default EconomicsPage
