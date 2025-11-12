import { useState, useEffect, useMemo } from 'react'
import { useGlowEffect } from '../hooks/useGlowEffect'

const Visualizer = () => {
  useGlowEffect()
  const [expandedCard, setExpandedCard] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  
  // Utility functions для glow эффекта
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

  // Блокировка скролла при открытии модального окна
  useEffect(() => {
    if (expandedCard) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY
      
      // Блокируем скролл
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.documentElement.style.overflow = 'hidden'
      
      return () => {
        // Разблокируем скролл
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.documentElement.style.overflow = ''
        
        // Восстанавливаем позицию скролла
        window.scrollTo(0, scrollY)
      }
    }
  }, [expandedCard])

  // Инициализация glow эффекта для увеличенной карточки
  useEffect(() => {
    if (expandedCard) {
      let handlePointerMove = null
      let handlePointerLeave = null
      let expandedCardElement = null
      
      // Небольшая задержка для гарантии, что элемент уже в DOM
      const timer = setTimeout(() => {
        expandedCardElement = document.querySelector('.visualizer-expanded-card')
        if (expandedCardElement) {
          handlePointerMove = cardUpdate(expandedCardElement)
          handlePointerLeave = () => {
            expandedCardElement.style.setProperty('--pointer-d', '0')
          }
          
          expandedCardElement.addEventListener('pointermove', handlePointerMove)
          expandedCardElement.addEventListener('pointerleave', handlePointerLeave)
        }
      }, 100)

      return () => {
        clearTimeout(timer)
        if (expandedCardElement && handlePointerMove && handlePointerLeave) {
          expandedCardElement.removeEventListener('pointermove', handlePointerMove)
          expandedCardElement.removeEventListener('pointerleave', handlePointerLeave)
          expandedCardElement.style.setProperty('--pointer-d', '0')
        }
      }
    }
  }, [expandedCard])
  
  // Данные для карточек
  const cardsData = [
    { id: 'level2', title: 'Level 2', image: '/images/level2.png', description: 'Level 2 represents an intermediate stage in your mining journey. At this level, you gain access to more advanced features and can start optimizing your mining operations.', features: ['Unlock additional mining capabilities', 'Access to more efficient ASIC miners', 'Improved energy management options'], category: 'levels' },
    { id: 'level10', title: 'Level 10', image: '/images/level10.png', description: 'Level 10 is the pinnacle of your mining progression. At this advanced level, you have access to the most powerful mining equipment and can maximize your xpBTC earnings.', features: ['Maximum mining efficiency unlocked', 'Access to premium ASIC miners', 'Advanced energy optimization systems', 'Priority access to pool features'], category: 'levels' },
    { id: 'wallet', title: 'Wallet', image: '/images/wallet.png', description: 'The Wallet feature allows you to manage your in-game currencies and exchange xpBTC for XP points. Monitor your balances and perform swaps with ease.', features: ['View XP and xpBTC balances', 'Swap xpBTC to XP (one-way exchange)', 'Real-time exchange rate display', 'Low transaction fees (0.2%)'], category: 'features' },
    ...Array.from({ length: 7 }, (_, i) => ({
      id: `screen-${i + 4}`,
      title: `Screen ${i + 4}`,
      image: null,
      description: `This is a placeholder for Screen ${i + 4} information. Detailed description about this screen's features and functionality will be displayed here.`,
      features: [`Feature 1 for Screen ${i + 4}`, `Feature 2 for Screen ${i + 4}`, `Feature 3 for Screen ${i + 4}`],
      category: 'tools'
    }))
  ]

  // Категории для фильтрации
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'levels', label: 'Levels' },
    { value: 'features', label: 'Features' },
    { value: 'tools', label: 'Tools' }
  ]

  // Фильтрация и сортировка карточек
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cardsData.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (selectedCategory === 'all') {
        return matchesSearch
      }
      
      return matchesSearch && card.category === selectedCategory
    })

    // Сортировка
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy])
  
  const currentCard = expandedCard ? cardsData.find(card => card.id === expandedCard) : null

  return (
    <section className="content-section section visualizer-section" id="visualizer">
      <div className="container">
        <h2 className="section-title" data-heading="Visualizer">Visualizer</h2>
        
        {/* Фильтры */}
        <div className="assets-filters">
          <div className="assets-search">
            <input
              type="text"
              placeholder="Search screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="assets-search-input"
            />
          </div>
          <div className="assets-filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="assets-filter-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="assets-filter-select"
            >
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

          {/* Expanded view - изображение слева, текст справа */}
          {expandedCard && currentCard && (
            <div 
              className="visualizer-expanded-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                animation: 'fadeIn 0.3s ease'
              }}
              onClick={() => setExpandedCard(null)}
            >
              <div 
                className="visualizer-expanded-card feature-card"
                style={{
                  display: 'flex',
                  gap: '2rem',
                  maxWidth: '900px',
                  width: '100%',
                  backgroundColor: 'var(--box-color)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  position: 'relative',
                  animation: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  overflow: 'visible'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="glow"></span>
                {/* Изображение слева */}
                <div style={{
                  width: '350px',
                  minWidth: '350px',
                  height: '500px',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  backgroundColor: 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}>
                  {currentCard.image ? (
                    <img 
                      src={currentCard.image} 
                      alt={currentCard.title} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        height: 'auto',
                        width: 'auto',
                        display: 'block',
                        objectFit: 'contain'
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed rgba(255, 111, 0, 0.3)',
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ color: 'var(--text-color)', opacity: 0.5 }}>
                        Placeholder
                      </span>
                    </div>
                  )}
                </div>
                {/* Текст справа */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1rem 0'
                }}>
                  <h4 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                    {currentCard.title}
                  </h4>
                  <p style={{ 
                    color: 'var(--text-color)', 
                    marginBottom: '1rem', 
                    fontSize: '1rem', 
                    lineHeight: '1.6' 
                  }}>
                    {currentCard.description}
                  </p>
                  <ul style={{ 
                    color: 'var(--text-color)', 
                    paddingLeft: '1.5rem', 
                    margin: 0, 
                    fontSize: '0.9rem', 
                    lineHeight: '1.8' 
                  }}>
                    {currentCard.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                {/* Кнопка Close в правом нижнем углу */}
                <button
                  type="button"
                  className="glass-button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Close button clicked, closing modal')
                    setExpandedCard(null)
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    width: 'auto',
                    height: 'auto',
                    minWidth: '120px',
                    zIndex: 10001
                  }}
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          )}

        {/* Карточки */}
        <div 
          className="assets-shelves"
          style={{
            opacity: expandedCard ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: expandedCard ? 'none' : 'auto'
          }}
        >
          <div className="assets-shelf">
            <div className="assets-cards-grid">
              {filteredAndSortedCards.map((card) => (
              <div 
                key={card.id}
                className={`visualizer-card feature-card ${expandedCard === card.id ? 'expanded' : ''}`}
                onClick={() => setExpandedCard(card.id)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  transform: expandedCard === card.id ? 'scale(0.95)' : 'scale(1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <span className="glow"></span>
                {/* Изображение сверху */}
                <div style={{ 
                  width: '100%', 
                  height: '380px', 
                  borderRadius: '0.75rem 0.75rem 0 0', 
                  overflow: 'hidden', 
                  backgroundColor: 'transparent',
                  position: 'relative',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  {card.image ? (
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        height: 'auto',
                        width: 'auto',
                        display: 'block',
                        objectFit: 'contain'
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed rgba(255, 111, 0, 0.3)',
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ color: 'var(--text-color)', opacity: 0.5, fontSize: '0.8rem' }}>
                        Placeholder for {card.title}
                      </span>
                    </div>
                  )}
                </div>
                {/* Текст снизу */}
                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h4 className="card-title" style={{ fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {card.title}
                  </h4>
                  <p style={{ color: 'var(--text-color)', marginBottom: '0.5rem', fontSize: '0.75rem', lineHeight: '1.4' }}>
                    {card.description}
                  </p>
                  <ul style={{ color: 'var(--text-color)', paddingLeft: '1rem', margin: 0, fontSize: '0.7rem', lineHeight: '1.5' }}>
                    {card.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <button 
                  className="glass-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedCard(card.id)
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    width: '70px',
                    height: '35px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.borderColor = 'rgba(255, 111, 0, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span style={{
                    fontFamily: '"Orbitron", sans-serif',
                    color: 'var(--title-color)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>View</span>
                </button>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Visualizer
