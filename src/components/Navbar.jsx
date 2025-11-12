import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const [activeLink, setActiveLink] = useState(location.pathname === '/' ? 'home' : location.pathname.slice(1))
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const moreMenuRef = useRef(null)
  const moreButtonRef = useRef(null)

  const moreMenuItems = [
    { path: '/tips', id: 'tips', label: 'Tips & Tricks' },
    { path: '/guides', id: 'guides', label: 'Guides' },
    { path: '/events', id: 'events', label: 'Events' },
    { path: '/community', id: 'community', label: 'Community' },
    { path: '/ambassador', id: 'ambassador', label: 'Ambassador Program' },
  ]

  // Вычисляем позицию выпадающего меню при открытии
  useEffect(() => {
    if (isMoreMenuOpen && moreButtonRef.current) {
      const buttonRect = moreButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: buttonRect.bottom + 8, // 8px отступ от кнопки
        left: buttonRect.left
      })
      console.log('📍 Dropdown position calculated:', {
        top: buttonRect.bottom + 8,
        left: buttonRect.left,
        buttonRect
      })
    }
  }, [isMoreMenuOpen])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Принудительно показываем navbar
    const showNavbar = () => {
    const navbar = document.getElementById('navbar')
    if (navbar) {
        console.log('✅ Navbar found in DOM')
        // Принудительно применяем стили
        navbar.style.setProperty('display', 'flex', 'important')
        navbar.style.setProperty('visibility', 'visible', 'important')
        navbar.style.setProperty('opacity', '1', 'important')
        navbar.style.setProperty('z-index', '10000', 'important')
        navbar.style.setProperty('position', 'fixed', 'important')
        navbar.style.setProperty('top', '0', 'important')
        navbar.style.setProperty('left', '0', 'important')
        navbar.style.setProperty('right', '0', 'important')
        navbar.style.setProperty('width', '100%', 'important')
        navbar.style.setProperty('height', '70px', 'important')
        navbar.style.setProperty('background-color', '#1a1a2e', 'important')
        navbar.style.setProperty('border-bottom', '3px solid #ff6f00', 'important')
      } else {
        console.error('❌ Navbar element NOT found in DOM!')
      }
    }
    
    // Вызываем сразу и через небольшую задержку
    showNavbar()
    setTimeout(showNavbar, 100)
    setTimeout(showNavbar, 500)
  }, [])

  // Обновляем activeLink при изменении маршрута
  useEffect(() => {
    const path = location.pathname
    if (path === '/') {
      setActiveLink('home')
    } else {
      setActiveLink(path.slice(1))
    }
  }, [location])

  // Блокируем скролл body и html когда мобильное меню открыто
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY
      const html = document.documentElement
      const body = document.body
      
      // Блокируем скролл для body
      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.width = '100%'
      body.style.overflow = 'hidden'
      
      // Блокируем скролл для html
      html.style.overflow = 'hidden'
      
      return () => {
        // Восстанавливаем скролл при закрытии меню
        const savedScrollY = body.style.top
        body.style.position = ''
        body.style.top = ''
        body.style.width = ''
        body.style.overflow = ''
        html.style.overflow = ''
        
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY || '0') * -1)
        }
      }
    }
  }, [isMobile, isMobileMenuOpen])

  const handleLinkClick = (path) => {
    setActiveLink(path === '/' ? 'home' : path.slice(1))
    setIsMobileMenuOpen(false) // Закрываем мобильное меню при клике
    setIsMoreMenuOpen(false) // Закрываем меню More при клике
  }

  const toggleMoreMenu = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log('🔄 Toggle More menu, current state:', isMoreMenuOpen)
    const newState = !isMoreMenuOpen
    console.log('✅ Setting More menu state to:', newState)
    setIsMoreMenuOpen(newState)
  }

  // Закрываем меню More при клике вне его
  useEffect(() => {
    if (!isMoreMenuOpen) {
      return
    }

    const handleClickOutside = (event) => {
      // Проверяем, что клик был не на кнопке More и не внутри выпадающего меню
      const moreButton = document.querySelector('.nav-more-button')
      const isClickOnButton = moreButton && (moreButton.contains(event.target) || moreButton === event.target)
      const isClickInsideMenu = moreMenuRef.current && moreMenuRef.current.contains(event.target)
      
      if (!isClickOnButton && !isClickInsideMenu) {
        console.log('🔄 Closing More menu - click outside', event.target)
        setIsMoreMenuOpen(false)
      } else {
        console.log('✅ Click was on button or inside menu, keeping it open')
      }
    }

    // Добавляем обработчик с большой задержкой, чтобы клик на кнопку успел обработаться
    // Используем 'click' вместо 'mousedown' для более надежной работы
    const timeoutId = setTimeout(() => {
      console.log('📌 Adding click outside listener after 500ms')
      document.addEventListener('click', handleClickOutside, true) // Используем capture phase
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      console.log('📌 Removing click outside listener')
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isMoreMenuOpen])

  const toggleMobileMenu = () => {
    console.log('🔄 Toggle mobile menu, current state:', isMobileMenuOpen)
    setIsMobileMenuOpen(prev => {
      const newState = !prev
      console.log('✅ New menu state:', newState)
      return newState
    })
  }

  const navItems = [
    { path: '/', id: 'home', label: 'Home' },
    { path: '/welcome', id: 'welcome', label: 'Welcome Bonus' },
    { path: '/economics', id: 'economics', label: 'Economics' },
    { path: '/assets', id: 'assets', label: 'Assets' },
    { path: '/visualizer', id: 'visualizer', label: 'Visualizer' },
    { path: '/pools', id: 'pools', label: 'BTC Game Pools' },
    { path: '/leaderboard', id: 'leaderboard', label: 'Leaderboard' },
    { path: '/city', id: 'city', label: 'City Screen' },
  ]

  return (
    <header 
      className="navbar" 
      id="navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: isMobile ? '50px' : '70px',
        minHeight: isMobile ? '50px' : '70px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        // Используем CSS переменные для фона, чтобы соответствовать теме
        visibility: 'visible',
        opacity: 1,
        margin: 0,
        padding: 0,
        overflow: 'visible'
      }}
    >
      <nav className="nav" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <div 
          className="nav-container"
          style={{
            maxWidth: '1250px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            height: '100%',
            gap: '2rem',
            width: '100%',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          <Link
            to="/"
            className="nav-logo"
            style={{
              width: isMobile ? '35px' : '50px',
              height: isMobile ? '35px' : '50px',
              borderRadius: '50%',
              background: 'transparent', // Убираем градиентный фон, так как используем изображение
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              overflow: 'hidden', // Обрезаем изображение по границам
              textDecoration: 'none',
              ...(isMobile && {
                marginRight: 'auto' // Логотип слева, кнопка меню справа
              })
            }}
            onClick={() => handleLinkClick('/')}
          >
            <img 
              src="/images/logo.png" 
              alt="ECOS Logo" 
              className="nav-logo-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain', // Сохраняем пропорции без обрезки
                borderRadius: '50%',
                padding: '3px' // Небольшой отступ для лучшего отображения
              }}
            />
          </Link>
          
          {/* Кнопка для мобильного меню - справа в углу */}
          {isMobile && (
          <button 
            className="nav-toggle" 
            id="nav-toggle"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleMobileMenu()
            }}
            aria-label="Toggle menu"
            style={{
                height: isMobile ? '35px' : '40px',
                width: isMobile ? '35px' : '40px',
              cursor: 'pointer',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
              borderRadius: '0.25rem',
              backgroundColor: 'hsl(28, 92%, 50%)',
              color: 'hsl(242, 8%, 95%)',
                display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10002,
              border: 'none',
              outline: 'none',
              transition: 'all 0.3s ease',
              position: 'absolute',
              right: '1rem',
              top: '50%',
                transform: 'translateY(-50%)',
                marginLeft: 'auto'
            }}
          >
            <i className={`uil ${isMobileMenuOpen ? 'uil-times' : 'uil-bars'}`}></i>
          </button>
          )}
          
          {/* Десктопное меню - скрыто на мобильных */}
          {!isMobile && (
          <div 
              className="nav-menu"
            style={{
                flex: 1,
              height: '100%',
              overflowX: 'auto',
              overflowY: 'visible',
                display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10000
            }}
          >
            <ul 
              className="nav-list"
              style={{
                display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '0.25rem',
                  height: '100%',
                margin: 0,
                padding: 0,
                listStyle: 'none',
                  width: 'auto'
              }}
            >
              {navItems.map(item => (
                <li 
                  key={item.id} 
                  className="nav-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                      height: '100%',
                      width: 'auto'
                    }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${activeLink === item.id ? 'active-link' : ''}`}
                      onClick={() => handleLinkClick(item.path)}
                      style={{
                        height: '100%',
                        lineHeight: '70px',
                        padding: '0 1rem',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        width: 'auto',
                        borderBottom: 'none',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.outline = 'none'
                      }}
                      onBlur={(e) => {
                        e.target.style.outline = 'none'
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* More Menu */}
                <li 
                  ref={moreMenuRef}
                  className="nav-item nav-more-menu"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    width: 'auto',
                    position: 'relative',
                    zIndex: 10001,
                    overflow: 'visible'
                  }}
                >
                  <button
                    ref={moreButtonRef}
                    className={`nav-link nav-more-button ${isMoreMenuOpen ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('🔘 More button clicked! Current state:', isMoreMenuOpen)
                      setIsMoreMenuOpen(prev => {
                        const newState = !prev
                        console.log('✅ Setting state to:', newState)
                        return newState
                      })
                    }}
                    type="button"
                    style={{
                      height: '100%',
                      lineHeight: '70px',
                      padding: '0 1rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease',
                      width: 'auto',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: 'inherit',
                      fontFamily: 'inherit'
                    }}
                  >
                    More <i className={`uil ${isMoreMenuOpen ? 'uil-angle-up' : 'uil-angle-down'}`} style={{ marginLeft: '0.25rem', fontSize: '0.7rem' }}></i>
                  </button>
                  {isMoreMenuOpen && (
                    <ul 
                      className="nav-more-dropdown"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation()
                      }}
                      style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        backgroundColor: 'var(--body-color)',
                        border: '2px solid rgba(255, 111, 0, 0.5)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        listStyle: 'none',
                        margin: 0,
                        padding: '0.5rem 0',
                        minWidth: '200px',
                        zIndex: 99999,
                        display: 'block',
                        visibility: 'visible',
                        opacity: 1,
                        pointerEvents: 'auto',
                        transform: 'none',
                        overflow: 'visible'
                      }}
                    >
                      {moreMenuItems.map(item => (
                        <li key={item.id} style={{ margin: 0, padding: 0 }}>
                          <Link
                            to={item.path}
                            className={`nav-link ${activeLink === item.id ? 'active-link' : ''}`}
                            onClick={() => handleLinkClick(item.path)}
                            style={{
                              display: 'block',
                              padding: '0.75rem 1.5rem',
                              textDecoration: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              transition: 'all 0.3s ease',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          )}
          
          {/* Мобильное меню - выпадающее */}
          {isMobile && (
            <div 
              className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-open' : ''}`}
              style={{
                // Стили управляются через CSS классы, inline стили только для критичных свойств
                display: 'flex'
              }}
            >
              <ul 
                className="nav-list"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: '0',
                  height: 'auto',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  width: '100%'
                }}
              >
                {navItems.map(item => (
                  <li 
                    key={item.id} 
                    className="nav-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 'auto',
                      width: '100%'
                    }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${activeLink === item.id ? 'active-link' : ''}`}
                      onClick={() => handleLinkClick(item.path)}
                      style={{
                        height: 'auto',
                        lineHeight: '1.5',
                        padding: '1rem 1.5rem',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.outline = 'none'
                      }}
                      onBlur={(e) => {
                        e.target.style.outline = 'none'
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* More Menu для мобильных */}
                <li 
                  className="nav-item"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    height: 'auto',
                    width: '100%'
                  }}
                >
                  <button
                    className={`nav-link nav-more-button ${isMoreMenuOpen ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsMoreMenuOpen(prev => !prev)
                    }}
                    style={{
                      height: 'auto',
                      lineHeight: '1.5',
                      padding: '1rem 1.5rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      textAlign: 'left'
                    }}
                  >
                    More <i className={`uil ${isMoreMenuOpen ? 'uil-angle-up' : 'uil-angle-down'}`} style={{ fontSize: '0.8rem' }}></i>
                  </button>
                  {isMoreMenuOpen && (
                    <ul 
                      style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        width: '100%'
                      }}
                    >
                      {moreMenuItems.map(item => (
                        <li key={item.id} style={{ margin: 0, padding: 0 }}>
                          <Link
                            to={item.path}
                            className={`nav-link ${activeLink === item.id ? 'active-link' : ''}`}
                            onClick={() => handleLinkClick(item.path)}
                            style={{
                              display: 'block',
                              padding: '1rem 1.5rem 1rem 3rem',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              transition: 'all 0.3s ease',
                              whiteSpace: 'nowrap',
                              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                              outline: 'none'
                            }}
                            onFocus={(e) => {
                              e.target.style.outline = 'none'
                            }}
                            onBlur={(e) => {
                              e.target.style.outline = 'none'
                    }}
                  >
                    {item.label}
                          </Link>
                </li>
              ))}
                    </ul>
                  )}
                </li>
            </ul>
          </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar

