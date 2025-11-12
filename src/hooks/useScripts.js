import { useEffect } from 'react'

// Хук для загрузки и инициализации внешних скриптов
export const useScripts = () => {
  // Инициализация keypad анимации
  const initKeypad = (navigate) => {
    const keyOne = document.getElementById('key-one')
    const keyTwo = document.getElementById('key-two')
    const keyThree = document.getElementById('key-three')

    // Массив для хранения обработчиков для последующей очистки
    const handlers = []

    if (keyOne) {
      const handlePointerDown1 = () => {
        keyOne.dataset.pressed = 'true'
      }
      const handlePointerUp1 = () => {
        keyOne.dataset.pressed = 'false'
      }
      const handleClick1 = () => {
        // Используем React Router для навигации
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById('feature-cards')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }

      keyOne.addEventListener('pointerdown', handlePointerDown1)
      keyOne.addEventListener('pointerup', handlePointerUp1)
      keyOne.addEventListener('click', handleClick1)
      
      handlers.push(
        { element: keyOne, event: 'pointerdown', handler: handlePointerDown1 },
        { element: keyOne, event: 'pointerup', handler: handlePointerUp1 },
        { element: keyOne, event: 'click', handler: handleClick1 }
      )
    }

    if (keyTwo) {
      const handlePointerDown2 = () => {
        keyTwo.dataset.pressed = 'true'
      }
      const handlePointerUp2 = () => {
        keyTwo.dataset.pressed = 'false'
      }
      const handleClick2 = () => {
        navigate('/welcome')
      }

      keyTwo.addEventListener('pointerdown', handlePointerDown2)
      keyTwo.addEventListener('pointerup', handlePointerUp2)
      keyTwo.addEventListener('click', handleClick2)
      
      handlers.push(
        { element: keyTwo, event: 'pointerdown', handler: handlePointerDown2 },
        { element: keyTwo, event: 'pointerup', handler: handlePointerUp2 },
        { element: keyTwo, event: 'click', handler: handleClick2 }
      )
    }

    if (keyThree) {
      const handlePointerDown3 = () => {
        keyThree.dataset.pressed = 'true'
      }
      const handlePointerUp3 = () => {
        keyThree.dataset.pressed = 'false'
      }
      const handleClick3 = () => {
        navigate('/about')
      }

      keyThree.addEventListener('pointerdown', handlePointerDown3)
      keyThree.addEventListener('pointerup', handlePointerUp3)
      keyThree.addEventListener('click', handleClick3)
      
      handlers.push(
        { element: keyThree, event: 'pointerdown', handler: handlePointerDown3 },
        { element: keyThree, event: 'pointerup', handler: handlePointerUp3 },
        { element: keyThree, event: 'click', handler: handleClick3 }
      )
    }

    // Поддержка клавиатуры (клавиши o, g, Enter)
    const handleKeyDown = (event) => {
      if (event.key === 'o' && keyOne) {
        keyOne.dataset.pressed = 'true'
        keyOne.click()
      } else if (event.key === 'g' && keyTwo) {
        keyTwo.dataset.pressed = 'true'
        keyTwo.click()
      } else if (event.key === 'Enter' && keyThree) {
        keyThree.dataset.pressed = 'true'
        keyThree.click()
      }
    }

    const handleKeyUp = (event) => {
      if (event.key === 'o' && keyOne) {
        keyOne.dataset.pressed = 'false'
      } else if (event.key === 'g' && keyTwo) {
        keyTwo.dataset.pressed = 'false'
      } else if (event.key === 'Enter' && keyThree) {
        keyThree.dataset.pressed = 'false'
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    handlers.push(
      { element: window, event: 'keydown', handler: handleKeyDown },
      { element: window, event: 'keyup', handler: handleKeyUp }
    )

    // Возвращаем функцию очистки
    return () => {
      handlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler)
      })
    }
  }

  useEffect(() => {
    // Получаем navigate из window (будет установлен в App.jsx)
    const navigate = window.__navigate || ((path) => {
      // Fallback: используем window.location если navigate недоступен
      if (path === '/') {
        window.location.hash = ''
        window.scrollTo(0, 0)
      } else {
        window.location.href = path
      }
    })

    // Функция для повторной попытки инициализации
    const tryInitKeypad = (attempts = 0) => {
      const keyOne = document.getElementById('key-one')
      const keyTwo = document.getElementById('key-two')
      const keyThree = document.getElementById('key-three')

      if (keyOne && keyTwo && keyThree) {
        // Все элементы найдены, инициализируем
        const cleanup = initKeypad(navigate)
        return cleanup
      } else if (attempts < 20) {
        // Пробуем еще раз через 100ms
        return setTimeout(() => tryInitKeypad(attempts + 1), 100)
      } else {
        console.warn('Keypad elements not found after 2 seconds')
        return null
      }
    }

    // Инициализация zdog для Events секции
    const initZdog = () => {
      if (window.Zdog && window.ZdogSpookyHouse) {
        const canvas = document.querySelector('.zdog-canvas')
        if (canvas) {
          console.log('Zdog initialized')
        }
      }
    }

    // Запускаем инициализацию
    const cleanupKeypad = tryInitKeypad()
    
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
      
      // Очистка через 10 секунд если не загрузился
      setTimeout(() => clearInterval(checkZdog), 10000)
    }

    return () => {
      if (cleanupKeypad && typeof cleanupKeypad === 'function') {
        cleanupKeypad()
      } else if (cleanupKeypad) {
        clearTimeout(cleanupKeypad)
      }
    }
  }, []) // Пустой массив зависимостей, так как мы используем window.__navigate
}

