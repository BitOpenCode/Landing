import { useState, useEffect } from 'react'
import { useGlowEffect } from '../hooks/useGlowEffect'

const Leaderboard = () => {
  useGlowEffect()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Форматирование чисел с разделителями
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Получение данных лидерборда через вебхук
  useEffect(() => {
    let isMounted = true // Флаг для проверки, что компонент еще смонтирован
    
    const fetchLeaderboard = async () => {
      try {
        if (!isMounted) return
        
        setLoading(true)
        setError(null)
        console.log('🔄 Начинаю загрузку лидерборда...')
        
        // Создаем AbortController для таймаута (30 секунд)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
          console.warn('⏱️ Таймаут запроса к вебхуку game-leaders (30 секунд)')
        }, 30000)
        
        const response = await fetch('https://n8n-p.blc.am/webhook/game-leaders', {
          signal: controller.signal,
          method: 'GET',
          cache: 'no-cache'
        })
        
        clearTimeout(timeoutId)
        
        if (!isMounted) return
        
        console.log('📡 Ответ получен, статус:', response.status, response.statusText)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('📊 Получены данные лидерборда:', data)
        console.log('📊 Тип данных:', typeof data, 'Является массивом:', Array.isArray(data))

        // Обработка разных форматов ответа
        let leaderboardData = []
        
        // Если ответ - объект с полем leaderboard (основной формат)
        if (data && data.leaderboard && Array.isArray(data.leaderboard)) {
          leaderboardData = data.leaderboard
          console.log('✅ Формат: объект с полем leaderboard')
        }
        // Если ответ - массив, берем первый элемент
        else if (Array.isArray(data)) {
          if (data.length > 0 && data[0] && data[0].leaderboard && Array.isArray(data[0].leaderboard)) {
            leaderboardData = data[0].leaderboard
            console.log('✅ Формат: массив с объектом, содержащим leaderboard')
          } else if (data.length > 0 && Array.isArray(data[0])) {
            leaderboardData = data[0]
            console.log('✅ Формат: массив массивов')
          } else {
            // Если весь массив - это массив игроков
            leaderboardData = data
            console.log('✅ Формат: массив игроков напрямую')
          }
        } else if (data && typeof data === 'object') {
          // Попробуем найти leaderboard в любом месте объекта
          if (data.json && data.json.leaderboard && Array.isArray(data.json.leaderboard)) {
            leaderboardData = data.json.leaderboard
            console.log('✅ Формат: data.json.leaderboard')
          } else {
            console.warn('⚠️ Неизвестный формат данных:', data)
          }
        } else {
          console.warn('⚠️ Неизвестный формат данных:', data)
        }

        console.log('✅ Обработанный лидерборд:', leaderboardData.length, 'игроков')
        if (leaderboardData.length === 0) {
          console.warn('⚠️ Лидерборд пустой! Проверьте формат данных.')
        }
        setLeaderboard(leaderboardData)
        setLastUpdate(new Date())
      } catch (err) {
        console.error('❌ Ошибка при получении лидерборда:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Выполняем запрос только один раз при монтировании компонента
    fetchLeaderboard()
    
    // Cleanup функция - отменяем запрос при размонтировании
    return () => {
      isMounted = false
    }
  }, []) // Пустой массив зависимостей = выполняется только один раз при монтировании

  return (
    <section className="content-section section" id="leaderboard">
      <div className="container">
        <h2 className="section-title" data-heading="Leaderboard">Leaderboard</h2>
        <div className="content-wrapper">
          <h3>Compete with Top Miners and Climb the Rankings</h3>
          <p>See where you stand among the best players in the game and compete for monthly rewards.</p>
          
          {/* Статистика */}
          {!loading && !error && leaderboard.length > 0 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem', 
              marginBottom: '2rem',
              marginTop: '2rem'
            }}>
              <div className="feature-card" style={{ padding: '1.5rem' }}>
                <span className="glow"></span>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--skin-color)', marginBottom: '0.5rem' }}>
                  {leaderboard.length}
                </div>
                <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Top Miners</div>
              </div>
              <div className="feature-card" style={{ padding: '1.5rem' }}>
                <span className="glow"></span>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--skin-color)', marginBottom: '0.5rem' }}>
                  {formatNumber(leaderboard.reduce((sum, p) => sum + (p.asic_count || 0), 0))}
                </div>
                <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Total ASICs</div>
              </div>
              <div className="feature-card" style={{ padding: '1.5rem' }}>
                <span className="glow"></span>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--skin-color)', marginBottom: '0.5rem' }}>
                  {formatNumber(Math.round(leaderboard.reduce((sum, p) => sum + (p.th || 0), 0) / leaderboard.length))}
                </div>
                <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Avg Hashrate (Th/s)</div>
              </div>
            </div>
          )}
          
          {/* Скелетоны загрузки */}
          {loading && (
            <div style={{ marginTop: '2rem' }}>
              <div className="feature-card">
                <span className="glow"></span>
                <h4 className="card-title" style={{ marginBottom: '1.5rem' }}>
                  TOP 10 Miners by Hashrate
                </h4>
                <div style={{ padding: '1rem' }}>
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 120px 120px',
                        gap: '1rem',
                        padding: '1rem',
                        marginBottom: '0.5rem',
                        borderRadius: '0.5rem',
                        background: 'linear-gradient(90deg, rgba(255, 111, 0, 0.1) 0%, rgba(255, 111, 0, 0.05) 50%, rgba(255, 111, 0, 0.1) 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeleton-loading 1.5s ease-in-out infinite'
                      }}
                    >
                      <div style={{ height: '24px', background: 'rgba(255, 111, 0, 0.2)', borderRadius: '4px' }}></div>
                      <div style={{ height: '24px', background: 'rgba(255, 111, 0, 0.2)', borderRadius: '4px' }}></div>
                      <div style={{ height: '24px', background: 'rgba(255, 111, 0, 0.2)', borderRadius: '4px' }}></div>
                      <div style={{ height: '24px', background: 'rgba(255, 111, 0, 0.2)', borderRadius: '4px' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#ff4444',
              background: 'rgba(255, 68, 68, 0.1)',
              borderRadius: '0.5rem',
              margin: '2rem 0'
            }}>
              Error loading leaderboard: {error}
            </div>
          )}

          {!loading && !error && leaderboard.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <div className="feature-card">
                <span className="glow"></span>
                <h4 className="card-title" style={{ 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <img 
                    src="/images/leaderboard.png" 
                    alt="Leaderboard" 
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain'
                    }}
                  />
                  TOP 10 Miners by Hashrate
                </h4>
                {lastUpdate && (
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--text-color)', 
                    opacity: 0.7,
                    marginTop: '0.5rem'
                  }}>
                    Updated: {lastUpdate.toLocaleString()}
                  </div>
                )}
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  color: 'var(--text-color)'
                }}>
                  <thead>
                    <tr style={{ 
                      borderBottom: '2px solid rgba(255, 111, 0, 0.3)',
                      textAlign: 'left'
                    }}>
                      <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--title-color)' }}>Rank</th>
                      <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--title-color)' }}>Username</th>
                      <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--title-color)', textAlign: 'right' }}>ASIC</th>
                      <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--title-color)', textAlign: 'right' }}>Th/s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((player, index) => {
                      // Определяем цвет медали для топ-3
                      const getMedalColor = (rank) => {
                        if (rank === 1) return '#FFD700' // Золото
                        if (rank === 2) return '#C0C0C0' // Серебро
                        if (rank === 3) return '#CD7F32' // Бронза
                        return null
                      }
                      
                      const medalColor = getMedalColor(player.rank)
                      const isTopThree = player.rank <= 3
                      
                      // Вычисляем процент от лидера для прогресс-бара
                      const topPlayerTh = leaderboard[0]?.th || 1
                      const playerTh = player.th || 0
                      const percentageFromTop = Math.round((playerTh / topPlayerTh) * 100)
                      
                      // Градиенты для топ-3
                      const getGradient = (rank) => {
                        if (rank === 1) return 'linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(255, 215, 0, 0.05) 100%)'
                        if (rank === 2) return 'linear-gradient(135deg, rgba(192, 192, 192, 0.25) 0%, rgba(192, 192, 192, 0.1) 50%, rgba(192, 192, 192, 0.05) 100%)'
                        if (rank === 3) return 'linear-gradient(135deg, rgba(205, 127, 50, 0.25) 0%, rgba(205, 127, 50, 0.1) 50%, rgba(205, 127, 50, 0.05) 100%)'
                        return 'transparent'
                      }
                      
                      return (
                        <tr 
                          key={index}
                          style={{ 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.3s ease',
                            background: getGradient(player.rank),
                            boxShadow: isTopThree ? `0 0 20px ${medalColor}20` : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (isTopThree) {
                              e.currentTarget.style.background = `linear-gradient(135deg, ${medalColor}35 0%, ${medalColor}15 50%, rgba(255, 111, 0, 0.1) 100%)`
                              e.currentTarget.style.transform = 'scale(1.01)'
                              e.currentTarget.style.boxShadow = `0 0 30px ${medalColor}40`
                            } else {
                              e.currentTarget.style.background = 'rgba(255, 111, 0, 0.08)'
                              e.currentTarget.style.transform = 'scale(1.005)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = getGradient(player.rank)
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.boxShadow = isTopThree ? `0 0 20px ${medalColor}20` : 'none'
                          }}
                        >
                          <td style={{ padding: '1rem', fontWeight: 'bold', color: medalColor || 'var(--skin-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {isTopThree && (
                                <span style={{ fontSize: '1.2rem', animation: 'pulse 2s ease-in-out infinite' }}>
                                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                                </span>
                              )}
                              #{player.rank}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {player.avatar_url ? (
                                <img 
                                  src={player.avatar_url} 
                                  alt={player.username}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: isTopThree ? `2px solid ${medalColor}` : '2px solid rgba(255, 111, 0, 0.3)',
                                    boxShadow: isTopThree ? `0 0 10px ${medalColor}50` : 'none'
                                  }}
                                />
                              ) : (
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isTopThree ? `${medalColor}30` : 'rgba(255, 111, 0, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.9rem',
                                  fontWeight: 'bold',
                                  color: isTopThree ? medalColor : 'var(--skin-color)',
                                  border: isTopThree ? `2px solid ${medalColor}` : '2px solid rgba(255, 111, 0, 0.3)',
                                  boxShadow: isTopThree ? `0 0 10px ${medalColor}50` : 'none'
                                }}>
                                  {(player.username || 'U')[0].toUpperCase()}
                                </div>
                              )}
                              <span style={{ fontWeight: isTopThree ? 'bold' : 'normal' }}>
                                {player.username || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            {formatNumber(player.asic_count || 0)}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                              <span style={{ fontWeight: 'bold', color: medalColor || 'var(--skin-color)' }}>
                                {formatNumber(player.th || 0)}
                              </span>
                              {/* Прогресс-бар */}
                              <div style={{
                                width: '100px',
                                height: '4px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                position: 'relative'
                              }}>
                                <div style={{
                                  width: `${percentageFromTop}%`,
                                  height: '100%',
                                  background: isTopThree 
                                    ? `linear-gradient(90deg, ${medalColor}, ${medalColor}80)`
                                    : 'linear-gradient(90deg, var(--skin-color), rgba(255, 111, 0, 0.6))',
                                  borderRadius: '2px',
                                  transition: 'width 0.5s ease',
                                  boxShadow: isTopThree ? `0 0 8px ${medalColor}60` : '0 0 4px rgba(255, 111, 0, 0.4)'
                                }}></div>
                              </div>
                              <span style={{ fontSize: '0.75rem', opacity: 0.7, color: 'var(--text-color)' }}>
                                {percentageFromTop}% от лидера
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Информационные карточки - под лидербордом */}
          {!loading && !error && leaderboard.length > 0 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem', 
              marginTop: '2rem'
            }}>
              <div className="feature-card" style={{ padding: '1rem' }}>
                <span className="glow"></span>
                <h4 className="card-title" style={{ 
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🎯 How to Join
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  color: 'var(--text-color)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '0.4rem' }}>• Acquire ASIC miners in the game</li>
                  <li style={{ marginBottom: '0.4rem' }}>• Build your mining infrastructure</li>
                  <li style={{ marginBottom: '0.4rem' }}>• Increase your total hashrate (Th/s)</li>
                  <li>• Top 10 miners by hashrate appear here</li>
                </ul>
              </div>
              
              <div className="feature-card" style={{ padding: '1rem' }}>
                <span className="glow"></span>
                <h4 className="card-title" style={{ 
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏆 Rewards
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  color: 'var(--text-color)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '0.4rem' }}>
                    <span style={{ color: '#FFD700', fontWeight: 'bold' }}>🥇 1st:</span> Exclusive rewards
                  </li>
                  <li style={{ marginBottom: '0.4rem' }}>
                    <span style={{ color: '#C0C0C0', fontWeight: 'bold' }}>🥈 2nd:</span> Premium bonuses
                  </li>
                  <li style={{ marginBottom: '0.4rem' }}>
                    <span style={{ color: '#CD7F32', fontWeight: 'bold' }}>🥉 3rd:</span> Special prizes
                  </li>
                  <li>Monthly leaderboard resets</li>
                </ul>
              </div>
              
              <div className="feature-card" style={{ padding: '1rem' }}>
                <span className="glow"></span>
                <h4 className="card-title" style={{ 
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📊 Rankings
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  color: 'var(--text-color)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '0.4rem' }}>• Rankings update in real-time</li>
                  <li style={{ marginBottom: '0.4rem' }}>• Based on total hashrate (Th/s)</li>
                  <li style={{ marginBottom: '0.4rem' }}>• Hashrate = ASIC × 234 Th</li>
                  <li>• Compete to climb the leaderboard!</li>
                </ul>
              </div>
            </div>
          )}

          {!loading && !error && leaderboard.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: 'var(--text-color)',
              opacity: 0.7
            }}>
              No leaderboard data available
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Leaderboard
