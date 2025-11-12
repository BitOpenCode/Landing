import { useEffect, useRef } from 'react'

const ThemeToggle = ({ theme, toggleTheme }) => {
  const centerRef = useRef(null)
  const cloudRef = useRef(null)
  const outerRef = useRef(null)

  useEffect(() => {
    const isDark = theme === 'dark'
    
    if (centerRef.current) {
      if (isDark) {
        centerRef.current.classList.add('toggle-active')
      } else {
        centerRef.current.classList.remove('toggle-active')
      }
    }
    
    if (cloudRef.current) {
      if (isDark) {
        cloudRef.current.classList.add('clouds-active')
      } else {
        cloudRef.current.classList.remove('clouds-active')
      }
    }
    
    if (outerRef.current) {
      if (isDark) {
        outerRef.current.classList.add('outer-active')
      } else {
        outerRef.current.classList.remove('outer-active')
      }
    }
  }, [theme])

  const handleClick = () => {
    toggleTheme()
  }

  return (
    <div className="theme-toggle-wrapper">
      <div ref={outerRef} className="outerBorder">
        <div 
          className="toggle-outer" 
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Toggle theme"
        >
          <div id="center">
            <div ref={centerRef} className="toggle-inner">
              <div className="toggle-inner-overlay">
                <div className="spot1"></div>
                <div className="spot2"></div>
                <div className="spot3"></div>
              </div>
            </div>
            <div className="halo1"></div>
            <div className="halo2"></div>
            <div className="halo3"></div>
          </div>

          <div ref={cloudRef} className="clouds">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 170 60" width="170" height="60">
              <title>Clouds</title>
              <style>
                {`.s0 { fill: #e1e1e1 } .s1 { fill: #ffffff }`}
              </style>
              <g id="Folder 1">
                <path id="Shape 2 copy" className="s0" d="m141 42.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 24" className="s0" d="m127 52.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 16" className="s0" d="m26 74.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 17" className="s0" d="m49 63.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 18" className="s0" d="m71 62.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 19" className="s0" d="m155 41.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 20" className="s0" d="m123 57.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 21" className="s0" d="m162 31.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 22" className="s0" d="m149 55.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
                <path id="Shape 3 copy 23" className="s0" d="m99 53.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              </g>
              <path id="Shape 2" className="s1" d="m153 65.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 11" className="s1" d="m143 72.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 10" className="s1" d="m159 73.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 9" className="s1" d="m141 70.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 8" className="s1" d="m30 85.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 7" className="s1" d="m55 82.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 6" className="s1" d="m78 81.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 5" className="s1" d="m163 56.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 4" className="s1" d="m119 73.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 3" className="s1" d="m166 45.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy 2" className="s1" d="m157 70.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
              <path id="Shape 3 copy" className="s1" d="m98 72.5c-9.7 0-17.5-7.8-17.5-17.5 0-9.7 7.8-17.5 17.5-17.5 9.7 0 17.5 7.8 17.5 17.5 0 9.7-7.8 17.5-17.5 17.5z" />
            </svg>
          </div>
          
          <div className="stars">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 170 60" width="170" height="60">
              <title>Stars</title>
              <style>
                {`.stars .s0 { fill: #ffffff }`}
              </style>
              <g id="Folder 1">
                <path id="Layer 2" className="s0" d="m57 20l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z" />
                <path id="Shape 2" className="s0" d="m65 39l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z" />
                <path id="Shape 3" className="s0" d="m89 11l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z" />
                <path id="Shape 4" className="s0" d="m90 44l0.7 4.3 4.3 0.7-4.3 0.7-0.7 4.3-0.7-4.3-4.3-0.7 4.3-0.7z" />
                <path id="Shape 5" className="s0" d="m34 30l0.7 4.3 4.3 0.7-4.3 0.7-0.7 4.3-0.7-4.3-4.3-0.7 4.3-0.7z" />
                <path id="Shape 6" className="s0" d="m61 12l0.4 2.6 2.6 0.4-2.6 0.4-0.4 2.6-0.4-2.6-2.6-0.4 2.6-0.4z" />
                <path id="Shape 7" className="s0" d="m28 36l0.4 2.6 2.6 0.4-2.6 0.4-0.4 2.6-0.4-2.6-2.6-0.4 2.6-0.4z" />
                <path id="Shape 8" className="s0" d="m46 39l0.4 2.6 2.6 0.4-2.6 0.4-0.4 2.6-0.4-2.6-2.6-0.4 2.6-0.4z" />
                <path id="Shape 9" className="s0" d="m19 54l0.4 2.6 2.6 0.4-2.6 0.4-0.4 2.6-0.4-2.6-2.6-0.4 2.6-0.4z" />
                <path id="Shape 10" className="s0" d="m16 14l0.4 2.6 2.6 0.4-2.6 0.4-0.4 2.6-0.4-2.6-2.6-0.4 2.6-0.4z" />
                <path id="Shape 11" className="s0" d="m44 15l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 12" className="s0" d="m50 56l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 13" className="s0" d="m78 25l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 14" className="s0" d="m80 50l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 15" className="s0" d="m29 62l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 16" className="s0" d="m15 47l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 17" className="s0" d="m115 51l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 18" className="s0" d="m107 59l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 19" className="s0" d="m108 8l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 20" className="s0" d="m95 32l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 21" className="s0" d="m92 38l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
                <path id="Shape 22" className="s0" d="m100 37l0.3 1.7 1.7 0.3-1.7 0.3-0.3 1.7-0.3-1.7-1.7-0.3 1.7-0.3z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeToggle

