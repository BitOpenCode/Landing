import { useEffect, useState } from 'react'

const WidgetCardsDescription = () => {
  const [selectedCard, setSelectedCard] = useState('asic')

  // Инициализация glow эффекта для карточек
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

  const cards = [
    {
      id: 'asic',
      title: 'ASIC S21 Pro',
      image: '/images/asics21pro.png',
      description: 'ASIC S21 Pro is a powerful mining device with a performance of 234 Th/s. Use it for efficient xpBTC mining and maximum profit generation.'
    },
    {
      id: 'land',
      title: 'Land',
      image: '/images/land.png',
      description: 'Land is a plot of land where you can place your mining facilities. Expand your territory and increase energy production.'
    },
    {
      id: 'energy',
      title: 'Energy Station',
      image: '/images/energystation.png',
      description: 'Energy Station is a facility that generates energy for your mining operations. Provides stable power supply for all your facilities.'
    },
    {
      id: 'datacenter',
      title: 'Datacenter',
      image: '/images/datacenter.png',
      description: 'Datacenter is a data processing center that increases the efficiency of your mining operations. Allows processing more transactions and earning more rewards.'
    },
    {
      id: 'kwt',
      title: 'kWt',
      image: '/images/kWt.png',
      description: 'kWt is a unit of energy measurement in the game. Use energy to power your mining devices and increase their performance.'
    }
  ]

  return (
    <section className="widget-cards-description section">
      <div className="container">
        <div className="widget-description-layout">
          {/* Пары карточек: изображение + текст */}
          {cards.map(card => (
            <div key={card.id} className="widget-card-pair">
              {/* Карточка с изображением */}
              <div
                className={`widget-description-card feature-card ${selectedCard === card.id ? 'active' : ''}`}
                onClick={() => setSelectedCard(card.id)}
              >
                <span className="glow"></span>
                <div className="widget-card-icon">
                  <img src={card.image} alt={card.title} />
                </div>
                <h3 className="card-title">{card.title}</h3>
              </div>

              {/* Текстовая карточка */}
              <div
                className={`widget-text-card feature-card ${selectedCard === card.id ? 'active' : ''}`}
                onClick={() => setSelectedCard(card.id)}
              >
                <span className="glow"></span>
                <h2 className="widget-text-card-title">{card.title}</h2>
                <p className="widget-text-card-description">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WidgetCardsDescription

