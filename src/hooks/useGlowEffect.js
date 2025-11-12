import { useEffect } from 'react'

export const useGlowEffect = (selector = '.feature-card') => {
  useEffect(() => {
    const cards = document.querySelectorAll(selector)
    
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
  }, [selector])
}

