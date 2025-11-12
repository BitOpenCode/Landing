import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ThemeToggle from './components/ThemeToggle'
import { useScripts } from './hooks/useScripts'

// Pages
import HomePage from './pages/HomePage'
import WelcomePage from './pages/WelcomePage'
import AssetsPage from './pages/AssetsPage'
import TipsPage from './pages/TipsPage'
import GuidesPage from './pages/GuidesPage'
import CommunityPage from './pages/CommunityPage'
import VisualizerPage from './pages/VisualizerPage'
import PoolsPage from './pages/PoolsPage'
import AmbassadorPage from './pages/AmbassadorPage'
import LeaderboardPage from './pages/LeaderboardPage'
import EventsPage from './pages/EventsPage'
import CityPage from './pages/CityPage'
import EconomicsPage from './pages/EconomicsPage'
import WalletPage from './pages/WalletPage'

// Компонент-обертка для инициализации keypad с доступом к navigate
function AppContent() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Сохраняем navigate в window для useScripts
    window.__navigate = navigate
    return () => {
      delete window.__navigate
    }
  }, [navigate])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/visualizer" element={<VisualizerPage />} />
        <Route path="/pools" element={<PoolsPage />} />
        <Route path="/ambassador" element={<AmbassadorPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/city" element={<CityPage />} />
        <Route path="/economics" element={<EconomicsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        {/* Обработчик для несуществующих маршрутов - перенаправляет на главную */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  )
}

function App() {
  const [theme, setTheme] = useState('dark')

  // Инициализация скриптов (keypad, zdog и т.д.)
  useScripts()

  useEffect(() => {
    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Navbar />

      <main className="main">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <AppContent />
      </main>
    </>
  )
}

export default App

