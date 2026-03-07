import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Logo_SFR.png'
import maxLogo from '../assets/Max.png'
import rutubeLogo from '../assets/rutube.png'
import vkLogo from '../assets/VK.png'
import telegramLogo from '../assets/Telegram.png'
import okLogo from '../assets/Odnoklassniki.png'
import { useTheme } from '../context/ThemeContext'
import '../styles/layout/_header.scss'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { toggleAccessible } = useTheme()

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__brand" onClick={closeMenu}>
          <img className="header__logo-image" src={logo} alt="Логотип Социального фонда РФ" />
          <span className="header__logo-text">Социальный фонд РФ</span>
        </Link>

        <nav className={`header__nav ${isOpen ? 'active' : ''}`}>
          <Link to="/services" onClick={closeMenu}>Услуги</Link>
          <Link to="/news" onClick={closeMenu}>Новости</Link>
          <Link to="/contacts" onClick={closeMenu}>Контакты</Link>
        </nav>

        <div className="header__controls">
          <div className="header__socials" aria-label="Социальные сети">
            <a href="https://vk.com/sfr" aria-label="VK">
              <img src={vkLogo} alt="VK" />
            </a>
            <a href="https://t.me/sfr_gov" aria-label="Telegram">
              <img src={telegramLogo} alt="Telegram" />
            </a>
            <a href="https://ok.ru/sfr" aria-label="Одноклассники">
              <img src={okLogo} alt="Одноклассники" />
            </a>
            <a href="https://max.ru/sfr" aria-label="Max">
              <img src={maxLogo} alt="Max" />
            </a>
            <a href="https://rutube.ru/channel/24630635/" aria-label="Rutube">
              <img src={rutubeLogo} alt="Rutube" />
            </a>
          </div>

          <button type="button" className="header__login-btn">
            Войти
          </button>

          <button type="button" className="header__accessible-btn" onClick={toggleAccessible}>
            Версия для слабовидящих
          </button>

          <button type="button" className="header__burger" onClick={() => setIsOpen((prev) => !prev)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header