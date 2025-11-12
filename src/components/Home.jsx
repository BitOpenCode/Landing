const Home = () => {
  return (
    <>
      {/* Иконки соцсетей - сразу под navbar */}
      <div className="home-social">
        <div className="home-social-links">
          <a href="https://www.facebook.com" target="_blank" className="home-social-link" rel="noreferrer">
            <i className="uil uil-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" className="home-social-link" rel="noreferrer">
            <i className="uil uil-instagram"></i>
          </a>
          <a href="https://telegram.org" target="_blank" className="home-social-link" rel="noreferrer">
            <i className="uil uil-telegram-alt"></i>
          </a>
          <a href="#" target="_blank" className="home-social-link" rel="noreferrer">
            <i className="uil uil-discord"></i>
          </a>
          <a href="#" target="_blank" className="home-social-link" rel="noreferrer">
            <i className="uil uil-twitter"></i>
          </a>
        </div>
      </div>

      <section className="home" id="home">
        <div className="home-container container grid">

        <div className="home-data" style={{ overflow: 'visible' }}>
          <h1 className="home-title">ECOS BTC Mining Game</h1>
          <h3 className="home-subtitle">The first mining simulator connected to the real Bitcoin mining ecosystem.</h3>
          <p className="home-description">Start playing, master mining, earn real Bitcoin. Your journey from simulator to real mining starts here</p>
        </div>

        {/* 3D Keypad */}
        <div className="keypad">
          <div className="keypad__base">
            <img src="https://assets.codepen.io/605876/keypad-base.png?format=auto&quality=86" alt="" />
          </div>
          <button id="key-one" className="key keypad__single keypad__single--left">
            <span className="key__mask">
              <span className="key__content">
                <span className="key__text"></span>
                <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
                <span className="key__text key__text-2"></span>
                <img src="/images/btc_1.png" alt="" className="key__img key__text-2"/>
              </span>
            </span>
          </button>
          <button id="key-two" className="key keypad__single">
            <span className="key__mask">
              <span className="key__content">
                <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
              </span>
            </span>
          </button>
          <button id="key-three" className="key keypad__double">
            <span className="key__mask">
              <span className="key__content">
                <span className="key__text"></span>
                <img src="https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86" alt="" />
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
    </>
  )
}

export default Home

