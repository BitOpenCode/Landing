import { useEffect, useRef } from 'react'

const Events = () => {
  const canvasRef = useRef(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Загружаем zdog-events.js скрипт
    const loadZdogEventsScript = () => {
      if (scriptLoadedRef.current) return
      
      const script = document.createElement('script')
      script.src = '/zdog-events.js'
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
        console.log('zdog-events.js loaded')
        // Инициализируем после загрузки скрипта
        setTimeout(() => {
          if (window.initZdogEvents) {
            window.initZdogEvents()
          }
        }, 100)
      }
      script.onerror = () => {
        console.error('Failed to load zdog-events.js')
      }
      document.body.appendChild(script)
    }

    // Проверяем, загружен ли zdog
    const initZdog = () => {
      if (window.Zdog && window.ZdogSpookyHouse && canvasRef.current) {
        // Загружаем zdog-events.js если еще не загружен
        if (!scriptLoadedRef.current) {
          loadZdogEventsScript()
        } else if (window.initZdogEvents) {
          // Если скрипт уже загружен, просто инициализируем
          window.initZdogEvents()
        }
      }
    }

    // Проверяем загрузку zdog
    if (window.Zdog) {
      initZdog()
    } else {
      const checkZdog = setInterval(() => {
        if (window.Zdog) {
          clearInterval(checkZdog)
          initZdog()
        }
      }, 100)

      // Очистка через 10 секунд
      setTimeout(() => clearInterval(checkZdog), 10000)
    }

    return () => {
      // Cleanup если нужно
    }
  }, [])

  return (
    <section className="content-section section" id="events">
      <div className="container">
        <h2 className="section-title" data-heading="Events">Events</h2>
        <div className="content-wrapper events-wrapper">
          <canvas ref={canvasRef} className="zdog-canvas" width="750" height="750"></canvas>
        </div>
      </div>
    </section>
  )
}

export default Events
