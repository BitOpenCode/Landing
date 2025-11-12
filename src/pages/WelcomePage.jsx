import { useLocation } from 'react-router-dom'
import IPhoneAnimation from '../components/IPhoneAnimation'
import WidgetCardsDescription from '../components/WidgetCardsDescription'
import Footer from '../components/Footer'

const WelcomePage = () => {
  const location = useLocation()
  
  // Используем key для принудительного пересоздания компонента при каждом открытии страницы
  return (
    <>
      <div className="welcome-page">
        <IPhoneAnimation key={`welcome-${location.pathname}`} />
      </div>
      <WidgetCardsDescription />
      <Footer />
    </>
  )
}

export default WelcomePage
