import { useState, useEffect } from 'react'
import { useGlowEffect } from '../hooks/useGlowEffect'

const Wallet = () => {
  useGlowEffect()
  
  const [btcPrice, setBtcPrice] = useState(99000) // Текущий курс BTC в USDT
  const [btcAmount, setBtcAmount] = useState('')
  const [xpAmount, setXpAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [fee, setFee] = useState(0)

  // Расчет XP на основе BTC
  useEffect(() => {
    if (btcAmount && !isNaN(parseFloat(btcAmount))) {
      const btc = parseFloat(btcAmount)
      // 1 BTC = текущий курс BTC в USDT = количество XP
      const calculatedXp = btc * btcPrice
      const calculatedFee = calculatedXp * 0.0023 // 0.23%
      setXpAmount(calculatedXp.toFixed(2))
      setFee(calculatedFee.toFixed(2))
    } else {
      setXpAmount('')
      setFee(0)
    }
  }, [btcAmount, btcPrice])

  // Загрузка текущего курса BTC (можно заменить на реальный API)
  useEffect(() => {
    // Здесь можно добавить запрос к API для получения реального курса
    // Например: fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    // .then(res => res.json())
    // .then(data => setBtcPrice(parseFloat(data.price)))
  }, [])

  const handleSwap = () => {
    if (!btcAmount || parseFloat(btcAmount) <= 0) {
      alert('Пожалуйста, введите количество BTC для обмена')
      return
    }
    setShowModal(true)
  }

  const handleConfirmSwap = () => {
    // Здесь должна быть логика обмена (запрос к API)
    alert(`Обмен выполнен! Вы получили ${xpAmount} XP за ${btcAmount} BTC`)
    setBtcAmount('')
    setXpAmount('')
    setShowModal(false)
  }

  const handleCancelSwap = () => {
    setShowModal(false)
  }

  return (
    <section className="content-section section" id="wallet">
      <div className="container">
        <h2 className="section-title" data-heading="Wallet">Wallet</h2>
        <div className="content-wrapper">
          {/* Карточка с изображением */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <div className="feature-card" style={{ maxWidth: '600px', width: '100%' }}>
              <span className="glow"></span>
              <div style={{ width: '100%', height: 'auto', marginBottom: '1rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <img 
                  src="/images/wallet.png" 
                  alt="Wallet" 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block',
                    objectFit: 'contain'
                  }} 
                />
              </div>
              <h3 className="card-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                SWAP BTC на XP
              </h3>
              <p style={{ textAlign: 'center', color: 'var(--text-color)', fontSize: '0.9rem', marginBottom: '0' }}>
                (изменить на XP в BTC нельзя)
              </p>
            </div>
          </div>

          {/* Форма обмена */}
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="feature-card">
              <span className="glow"></span>
              <div style={{ padding: '1.5rem' }}>
                {/* Текущий курс BTC */}
                <div style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--body-color)', 
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 111, 0, 0.3)'
                }}>
                  <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '0.9rem' }}>
                    <strong>Bitcoin price:</strong> ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* You Pay */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--text-color)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    You pay
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '1rem',
                    backgroundColor: 'var(--body-color)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 111, 0, 0.3)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>₿</span>
                    <input
                      type="number"
                      value={btcAmount}
                      onChange={(e) => setBtcAmount(e.target.value)}
                      placeholder="0.00000000"
                      step="0.00000001"
                      min="0"
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-color)',
                        fontSize: '1.2rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <p style={{ 
                    marginTop: '0.5rem', 
                    marginBottom: 0, 
                    color: 'var(--text-color)', 
                    fontSize: '0.75rem',
                    opacity: 0.7
                  }}>
                    Minimum purchase amount - from 0.0000001 BTC
                  </p>
                </div>

                {/* You Receive */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--text-color)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    You receive (estimate)
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '1rem',
                    backgroundColor: 'var(--body-color)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 111, 0, 0.3)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>XP</span>
                    <input
                      type="text"
                      value={xpAmount || '0'}
                      readOnly
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-color)',
                        fontSize: '1.2rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Fee */}
                {fee > 0 && (
                  <div style={{ 
                    marginBottom: '1.5rem',
                    color: 'var(--text-color)',
                    fontSize: '0.85rem'
                  }}>
                    <strong>Fee:</strong> 0.23% : {fee} XP
                  </div>
                )}

                {/* Кнопка SWAP */}
                <button
                  onClick={handleSwap}
                  disabled={!btcAmount || parseFloat(btcAmount) <= 0}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: !btcAmount || parseFloat(btcAmount) <= 0 ? 'not-allowed' : 'pointer',
                    opacity: !btcAmount || parseFloat(btcAmount) <= 0 ? 0.5 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  SWAP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '1rem'
        }}
        onClick={handleCancelSwap}
        >
          <div 
            className="feature-card"
            style={{
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="glow"></span>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: '1.5rem', 
              color: 'var(--title-color)',
              textAlign: 'center'
            }}>
              Подтверждение обмена
            </h3>
            <p style={{ 
              marginBottom: '1rem', 
              color: 'var(--text-color)',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}>
              Вы точно хотите обменять <strong>{btcAmount} BTC</strong> на <strong>{xpAmount} XP</strong>?
            </p>
            <p style={{ 
              marginBottom: '1.5rem', 
              color: 'var(--text-color)',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              Fee: 0.23% : <strong>{fee} XP</strong>
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleConfirmSwap}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Yes
              </button>
              <button
                onClick={handleCancelSwap}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Wallet

