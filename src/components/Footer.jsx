const Footer = () => {
  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const footerLinks = [
    { id: 'welcome', label: 'Welcome Bonus' },
    { id: 'assets', label: 'Assets' },
    { id: 'tips', label: 'Tips & Tricks' },
    { id: 'guides', label: 'Guides' },
    { id: 'community', label: 'Community' },
    { id: 'visualizer', label: 'Visualizer' },
    { id: 'pools', label: 'BTC Game Pools' },
    { id: 'ambassador', label: 'Ambassador Program' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'events', label: 'Events' },
    { id: 'city', label: 'City Screen' },
  ]

  return (
    <footer className="footer">
      <div className="footer-bg">
        <div className="footer-container container grid">
          <div>
            <h1 className="footer-title">ECOS</h1>
            <span className="footer-subtitle">Mining Game</span>
          </div>

          <ul className="footer-links">
            {footerLinks.map(link => (
              <li key={link.id}>
                <a 
                  href={`#${link.id}`} 
                  className="footer-links"
                  onClick={(e) => { e.preventDefault(); handleScroll(link.id); }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="footer-socials">
            <a href="#" target="_blank" className="footer-social" rel="noreferrer">
              <i className="uil uil-discord"></i>
            </a>

            <a href="#" target="_blank" className="footer-social" rel="noreferrer">
              <i className="uil uil-twitter"></i>
            </a>

            <a href="#" target="_blank" className="footer-social" rel="noreferrer">
              <i className="uil uil-telegram"></i>
            </a>
          </div>
        </div>

        <p className="footer-copy">&#169; <a href="#">ECOS Gaming</a>. All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer

