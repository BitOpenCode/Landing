import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const IPhoneAnimation = () => {
  const sectionRef = useRef(null)
  const iphoneRef = useRef(null)
  const masterTimelineRef = useRef(null)
  const isAnimatingRef = useRef(false)
  const isInFinalPositionRef = useRef(false) // Начинаем с начального положения (скрыт за экраном)

  useEffect(() => {
    if (!sectionRef.current || !iphoneRef.current) {
      return
    }

    const iphone = iphoneRef.current
    const widgets = Array.from(sectionRef.current.querySelectorAll('.widgets'))

    // Сбрасываем все анимации и состояния при монтировании компонента
    // Останавливаем все активные анимации GSAP
    gsap.killTweensOf([iphone, ...widgets])
    
    // Сбрасываем состояние
    isAnimatingRef.current = false
    isInFinalPositionRef.current = false // iPhone скрыт за экраном при загрузке
    
    // Останавливаем и удаляем старый timeline если он был запущен
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill()
      masterTimelineRef.current.clear()
      masterTimelineRef.current = null
    }

    // Устанавливаем начальные значения - iPhone скрыт за экраном (x: -450, rotation: 90), виджеты скрыты
    // Позиционируем iPhone в центре через GSAP, затем сдвигаем влево
    // Используем immediateRender: true и clearProps для гарантии правильного начального состояния
    gsap.set(iphone, { 
      x: -450,  // Сдвигаем влево за экран
      y: '-50%', // Центрируем по вертикали
      rotation: 90, 
      scale: 1, 
      opacity: 1,
      transformOrigin: "center center",
      immediateRender: true, // Применяем немедленно
      force3D: false // Отключаем 3D для стабильности
    })
    gsap.set(widgets, { 
      opacity: 0, 
      scale: 0,
      x: 0,
      y: 0
    })
    
    // Принудительно показываем iPhone через CSS (он будет виден, но за экраном из-за x: -450)
    iphone.style.display = 'block'
    iphone.style.visibility = 'visible'
    iphone.style.opacity = '1'
    
    // Очищаем любые inline стили transform, которые могут конфликтовать
    iphone.style.transform = ''
    
    // Дополнительная проверка - убеждаемся что значения установлены после рендера
    // Используем requestAnimationFrame для гарантии применения после рендера
    requestAnimationFrame(() => {
      gsap.set(iphone, { 
        x: -450, 
        y: '-50%', // Сохраняем центрирование по вертикали
        rotation: 90, 
        scale: 1,
        opacity: 1,
        immediateRender: true,
        force3D: false
      })
      
      // Дополнительная проверка через небольшую задержку
      setTimeout(() => {
        const currentX = gsap.getProperty(iphone, 'x')
        if (currentX !== -450) {
          console.warn('⚠️ iPhone не в начальном положении, исправляем...', currentX)
          gsap.set(iphone, { 
            x: -450, 
            y: '-50%',
            rotation: 90,
            immediateRender: true
          })
        }
      }, 100)
    })

    // Функция анимации iPhone
    function iPhoneAnimation() {
      const tl = gsap.timeline({ defaults: { duration: 1 } })
      // Сохраняем translateY(-50%) для центрирования при анимации
      tl.to(iphone, { x: 0, y: '-50%' })
        .to(iphone, { rotation: 0, scale: 0.9, y: '-50%' })
        .to(iphone, { duration: 3, scale: 1, y: '-50%' })
      return tl
    }

    // Функция анимации виджетов
    function widgetAnimation() {
      const tl = gsap.timeline()
      tl.to(widgets, { duration: 0, opacity: 1 })
      return tl
    }

    // Конфигурация анимаций виджетов
    // Каждый виджет - это карточка с текстом и изображением, которая разлетается вокруг iPhone
    // Вы можете настроить позицию (x, y), масштаб (scale) и скорость (duration, ease) для каждого виджета
    // Координаты настроены так, чтобы карточки были на достаточном расстоянии друг от друга и от iPhone
    const animations = [
      { selector: "#widget-asic", duration: 3, scale: 0.9, x: 300, y: 150, ease: "power4.out" }, // Справа от iPhone, ниже центра (увеличено y для большего расстояния от Datacenter)
      { selector: "#widget-land", duration: 3, scale: 0.9, x: -450, y: 60, ease: "power2.out" }, // Слева от iPhone, выше центра, дальше от центра
      { selector: "#widget-energy", duration: 3, scale: 1.0, x: -280, y: 250, ease: "power4.out" }, // Слева от iPhone, ниже центра (опущен ниже)
      { selector: "#widget-datacenter", duration: 3, scale: 0.9, x: 380, y: -100, ease: "power4.out" }, // Справа от iPhone, выше центра, дальше от ASIC
      { selector: "#widget-kwt", duration: 3, scale: 0.85, x: -260, y: -120, ease: "power2.out" } // Слева от iPhone, выше центра (уменьшен scale и поднят выше)
    ]

    // Создаем новый timeline каждый раз при монтировании
    const startTime = 2
    const masterTimeline = gsap.timeline({ paused: true, onComplete: () => {
      // После завершения анимации сбрасываем флаг
      isAnimatingRef.current = false
    }})
    masterTimeline.add(iPhoneAnimation()).add(widgetAnimation(), startTime)

    animations.forEach((animation, index) => {
      const { selector, duration, scale, x, y, ease } = animation
      const element = sectionRef.current.querySelector(selector)
      if (element) {
        masterTimeline.add(
          gsap.to(element, { duration, scale, x, y, ease }),
          startTime + (index % 3) / 2
        )
      }
    })

    // Сохраняем новый timeline
    masterTimelineRef.current = masterTimeline

    // Обработчик клика на iPhone
    const handleiPhoneClick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (isAnimatingRef.current) {
        console.log('⏸️ Анимация уже выполняется, пропускаем клик')
        return // Предотвращаем повторный клик во время анимации
      }

      console.log('🖱️ Клик на iPhone, текущее состояние:', {
        isInFinalPosition: isInFinalPositionRef.current,
        isAnimating: isAnimatingRef.current
      })

      isAnimatingRef.current = true

      if (isInFinalPositionRef.current) {
        // iPhone в финальном положении - возвращаем в начальное
        console.log('↩️ Возвращаем iPhone в начальное положение')
        const reverseTL = gsap.timeline({
          onComplete: () => {
            console.log('✅ Возврат завершен')
            isAnimatingRef.current = false
            isInFinalPositionRef.current = false
          }
        })
        
        // Возвращаем виджеты в начальные позиции и скрываем
        animations.forEach((animation) => {
          const { selector } = animation
          const element = sectionRef.current.querySelector(selector)
          if (element) {
            reverseTL.to(element, { 
              scale: 0, 
              x: 0, 
              y: 0, 
              opacity: 0, 
              duration: 0.5 
            }, 0)
          } else {
            console.warn('⚠️ Виджет не найден:', selector)
          }
        })
        
        // Анимация возврата iPhone
        reverseTL
          .to(iphone, { scale: 0.9, y: '-50%', duration: 0.5 }, 0)
          .to(iphone, { rotation: 90, scale: 1, y: '-50%', duration: 1 }, 0.5)
          .to(iphone, { x: -450, y: '-50%', duration: 1 }, 1.5)
      } else {
        // iPhone в начальном положении - запускаем анимацию входа
        console.log('▶️ Запускаем анимацию входа')
        
        // Проверяем, что все виджеты найдены
        const allWidgetsFound = animations.every(animation => {
          const element = sectionRef.current.querySelector(animation.selector)
          if (!element) {
            console.warn('⚠️ Виджет не найден:', animation.selector)
          }
          return element !== null
        })
        
        if (!allWidgetsFound) {
          console.error('❌ Не все виджеты найдены, пропускаем анимацию')
          isAnimatingRef.current = false
          return
        }
        
        // Сбрасываем все в начальное состояние
        gsap.set(iphone, { 
          x: -450, 
          rotation: 90, 
          scale: 1, 
          y: '-50%',
          immediateRender: true,
          force3D: false
        })
        gsap.set(widgets, { 
          opacity: 0, 
          scale: 0, 
          x: 0, 
          y: 0,
          immediateRender: true
        })
        
        // Сбрасываем анимацию в начало
        if (masterTimelineRef.current) {
          masterTimelineRef.current.progress(0)
          masterTimelineRef.current.kill()
          masterTimelineRef.current.clear()
        }
        
        // Создаем новый timeline
        const startTime = 2
        const newMasterTimeline = gsap.timeline({ 
          paused: false,
          onComplete: () => {
            console.log('✅ Анимация завершена')
            isAnimatingRef.current = false
            isInFinalPositionRef.current = true
          }
        })
        
        newMasterTimeline.add(iPhoneAnimation()).add(widgetAnimation(), startTime)
        
        animations.forEach((animation, index) => {
          const { selector, duration, scale, x, y, ease } = animation
          const element = sectionRef.current.querySelector(selector)
          if (element) {
            newMasterTimeline.add(
              gsap.to(element, { duration, scale, x, y, ease }),
              startTime + (index % 3) / 2
            )
          }
        })
        
        masterTimelineRef.current = newMasterTimeline
      }
    }

    iphone.addEventListener('click', handleiPhoneClick)
    iphone.style.cursor = 'pointer'

    // Инициализация glow эффекта для виджетов (как на главной странице)
    const widgetCards = Array.from(sectionRef.current.querySelectorAll('.widget-card'))
    
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

    widgetCards.forEach($card => {
      const updateHandler = cardUpdate($card)
      $card.addEventListener('pointermove', updateHandler)
      $card.addEventListener('pointerleave', () => {
        $card.style.setProperty('--pointer-d', '0')
      })
    })

    return () => {
      // Очистка при размонтировании компонента
      iphone.removeEventListener('click', handleiPhoneClick)
      
      // Удаляем обработчики glow эффекта для виджетов
      widgetCards.forEach($card => {
        $card.removeEventListener('pointermove', cardUpdate($card))
        $card.removeEventListener('pointerleave', () => {})
      })
      
      // Останавливаем все анимации
      gsap.killTweensOf([iphone, ...widgets])
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill()
      }
      
      // Очищаем ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      
      // Сбрасываем состояние
      isAnimatingRef.current = false
      isInFinalPositionRef.current = false // iPhone скрыт за экраном
    }
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="animation" 
      style={{ 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0d0d0d',
        margin: 0,
        padding: 0
      }}
    >
      <img 
        ref={iphoneRef} 
        className="iphone" 
        src="https://assets.codepen.io/8292695/iphone-14.svg" 
        alt="iPhone"
      />
      
      {/* Виджеты - карточки с текстом и изображениями, которые разлетаются вокруг iPhone при клике */}
      {/* Вы можете заменить src на свои изображения и настроить анимацию в массиве animations выше */}
      
      <div id="widget-asic" className="widgets widget-card">
        <span className="glow"></span>
        <div className="widget-card-image">
          <img src="/images/asics21pro.png" alt="ASIC S21 Pro" />
        </div>
        <div className="widget-card-content">
          <h4 className="widget-card-title">ASIC S21 Pro</h4>
          <p className="widget-card-subtitle">234 Th/s</p>
        </div>
      </div>

      <div id="widget-land" className="widgets widget-card">
        <span className="glow"></span>
        <div className="widget-card-image">
          <img src="/images/land.png" alt="Land" />
        </div>
        <div className="widget-card-content">
          <h4 className="widget-card-title">Land</h4>
        </div>
      </div>

      <div id="widget-energy" className="widgets widget-card">
        <span className="glow"></span>
        <div className="widget-card-image">
          <img src="/images/energystation.png" alt="Energy Station" />
        </div>
        <div className="widget-card-content">
          <h4 className="widget-card-title">Energy Station</h4>
        </div>
      </div>

      <div id="widget-datacenter" className="widgets widget-card">
        <span className="glow"></span>
        <div className="widget-card-image">
          <img src="/images/datacenter.png" alt="Datacenter" />
        </div>
        <div className="widget-card-content">
          <h4 className="widget-card-title">Datacenter</h4>
        </div>
      </div>

      <div id="widget-kwt" className="widgets widget-card">
        <span className="glow"></span>
        <div className="widget-card-image">
          <img src="/images/kWt.png" alt="kWt" />
        </div>
        <div className="widget-card-content">
          <h4 className="widget-card-title">kWt</h4>
        </div>
      </div>
    </section>
  )
}

export default IPhoneAnimation