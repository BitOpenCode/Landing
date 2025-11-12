import { useState, useEffect } from 'react'
import { useGlowEffect } from '../hooks/useGlowEffect'

const Leaderboard = () => {
  useGlowEffect()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Форматирование чисел с разделителями
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Получение данных лидерборда через вебхук
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://n8n-p.blc.am/webhook/game-leaders', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          },
          cache: 'no-cache'
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('📊 Получены данные лидерборда:', data)

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
        } else {
          console.warn('⚠️ Неизвестный формат данных:', data)
        }

        console.log('✅ Обработанный лидерборд:', leaderboardData.length, 'игроков')
        if (leaderboardData.length === 0) {
          console.warn('⚠️ Лидерборд пустой! Проверьте формат данных.')
        }
        setLeaderboard(leaderboardData)
      } catch (err) {
        console.error('❌ Ошибка при получении лидерборда:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <section className="content-section section" id="leaderboard">
      <div className="container">
        <h2 className="section-title" data-heading="Leaderboard">Leaderboard</h2>
        <div className="content-wrapper">
          <h3>Compete with Top Miners and Climb the Rankings</h3>
          <p>See where you stand among the best players in the game and compete for monthly rewards.</p>
          
          {/* Таблица лидерборда */}
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: 'var(--text-color)',
              opacity: 0.7
            }}>
              Loading leaderboard...
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
                    {leaderboard.map((player, index) => (
                      <tr 
                        key={index}
                        style={{ 
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 111, 0, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--skin-color)' }}>
                          #{player.rank}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {player.username || 'Unknown'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {formatNumber(player.asic_count || 0)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--skin-color)' }}>
                          {formatNumber(player.th || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
