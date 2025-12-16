import React, { useEffect, useState } from 'react'

export default function Nav() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function handleNavLinkClick() {
    // close mobile menu after a link clicked
    setMobileOpen(false)
  }

  return (
    <nav>
      <div className="logo">La Bella Italia</div>

      {/* Desktop nav + Mobile (auto-hidden with CSS; mobile open toggled) */}
      <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`} id="main-nav" role="navigation" aria-label="Main">
        <a href="#inicio" onClick={handleNavLinkClick}>Início</a>
        <a href="#sobre" onClick={handleNavLinkClick}>Sobre</a>
        <a href="#cardapio" onClick={handleNavLinkClick}>Cardápio</a>
        <a href="#galeria" onClick={handleNavLinkClick}>Galeria</a>
        <a href="#reserva" onClick={handleNavLinkClick}>Reserve</a>
        <a href="#contato" onClick={handleNavLinkClick}>Contato</a>
      </div>

      {/* Hamburger (mobile only) */}
      <button
        className={`hamburger ${mobileOpen ? 'open' : ''}`}
        aria-expanded={mobileOpen}
        aria-controls="main-nav"
        aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setMobileOpen(prev => !prev)}
      >
        <span className="bar" aria-hidden="true" />
        <span className="bar" aria-hidden="true" />
        <span className="bar" aria-hidden="true" />
      </button>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
    </nav>
  )
}