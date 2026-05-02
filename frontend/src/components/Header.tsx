import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Logo_SFR.png'
import maxLogo from '../assets/Max.png'
import rutubeLogo from '../assets/rutube.png'
import vkLogo from '../assets/VK.png'
import telegramLogo from '../assets/Telegram.png'
import okLogo from '../assets/Odnoklassniki.png'
import eyeImg from '../assets/eye.png'
import { useTheme } from '../context/useTheme'
import {
  AUTH_EVENT_NAME,
  AUTH_TOKEN_KEY,
  clearAuthSession,
  getStoredToken,
  isStoredTokenExpired,
} from '../auth/session'
import '../styles/layout/_header.scss'

const HIDE_SCROLL_OFFSET = 140
const DIRECTION_THRESHOLD = 6

const readAuthState = (): boolean => {
  const token = getStoredToken()

  if (!token) {
    return false
  }

  if (isStoredTokenExpired()) {
    clearAuthSession()
    return false
  }

  return true
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthState)
  const lastScrollY = useRef(0)

  const {
    enabled,
    scheme,
    fontSize,
    hideImages,
    setEnabled,
    setScheme,
    setFontSize,
    setHideImages,
  } = useTheme()

  const closeMenu = () => setIsOpen(false)

  const syncAuthState = () => {
    const token = getStoredToken()

    if (!token) {
      setIsAuthenticated(false)
      return
    }

    if (isStoredTokenExpired()) {
      clearAuthSession()
      setIsAuthenticated(false)
      return
    }

    setIsAuthenticated(true)
  }

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (currentY <= 20) {
        setIsHeaderHidden(false)
      } else if (delta < -DIRECTION_THRESHOLD) {
        setIsHeaderHidden(false)
      } else if (delta > DIRECTION_THRESHOLD && currentY > HIDE_SCROLL_OFFSET && !isAccessibilityOpen) {
        setIsHeaderHidden(true)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isAccessibilityOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleAuthChange = () => syncAuthState()
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY) {
        syncAuthState()
      }
    }

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const headerClass = `header ${isHeaderHidden && !isAccessibilityOpen ? 'header--hidden' : ''}`
  const authLabel = isAuthenticated ? 'Задать вопрос' : 'Войти'

  return (
    <header className={headerClass}>
      <div className="header__container">
        <Link to="/" className="header__brand" onClick={closeMenu}>
          <img className="header__logo-image" src={logo} alt="Логотип Социального фонда РФ" />
          <span className="header__logo-text">Социальный фонд РФ</span>
        </Link>

        <nav id="header-mobile-menu" className={`header__nav ${isOpen ? 'active' : ''}`}>
          <Link to="/information" onClick={closeMenu}>
            Информация
          </Link>
          <Link to="/news" onClick={closeMenu}>
            Новости
          </Link>
          <Link to="/contacts" onClick={closeMenu}>
            Контакты
          </Link>

          <Link to="/auth" className="header__mobile-login-btn" onClick={closeMenu}>
            {authLabel}
          </Link>

          <div className="header__mobile-socials" aria-label="Социальные сети">
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

          <Link to="/auth" className="header__login-btn">
            {authLabel}
          </Link>

          <button
            type="button"
            className="header__accessible-btn"
            onClick={() => {
              setIsHeaderHidden(false)
              setIsAccessibilityOpen((prev) => !prev)
            }}
            aria-expanded={isAccessibilityOpen}
            aria-controls="accessibility-panel"
          >
            <img className="header__accessible-icon" src={eyeImg} alt="" aria-hidden="true" />
            <span>Версия для слабовидящих</span>
          </button>

          <button
            type="button"
            className={`header__burger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="header-mobile-menu"
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {isAccessibilityOpen && (
        <div id="accessibility-panel" className="header__accessibility-panel">
          <div className="header__accessibility-inner">
            <div className="header__accessibility-group">
              <span className="header__accessibility-label">Режим</span>
              <div className="header__accessibility-controls">
                <button type="button" className={enabled ? 'active' : ''} onClick={() => setEnabled(!enabled)}>
                  {enabled ? 'Выключить' : 'Включить'}
                </button>
              </div>
            </div>

            <div className="header__accessibility-group">
              <span className="header__accessibility-label">Цветовая схема</span>
              <div className="header__accessibility-controls">
                <button
                  type="button"
                  className={scheme === 'default' ? 'active' : ''}
                  onClick={() => {
                    setEnabled(true)
                    setScheme('default')
                  }}
                >
                  Стандартная
                </button>
                <button
                  type="button"
                  className={scheme === 'black-white' ? 'active' : ''}
                  onClick={() => {
                    setEnabled(true)
                    setScheme('black-white')
                  }}
                >
                  Черный на белом
                </button>
                <button
                  type="button"
                  className={scheme === 'white-black' ? 'active' : ''}
                  onClick={() => {
                    setEnabled(true)
                    setScheme('white-black')
                  }}
                >
                  Белый на черном
                </button>
              </div>
            </div>

            <div className="header__accessibility-group">
              <span className="header__accessibility-label">Шрифт</span>
              <div className="header__accessibility-controls">
                <button
                  type="button"
                  className={fontSize === 'normal' ? 'active' : ''}
                  onClick={() => {
                    setEnabled(true)
                    setFontSize('normal')
                  }}
                >
                  Стандартный
                </button>
                <button
                  type="button"
                  className={fontSize === 'large' ? 'active' : ''}
                  onClick={() => {
                    setEnabled(true)
                    setFontSize('large')
                  }}
                >
                  Увеличенный
                </button>
              </div>
            </div>

            <div className="header__accessibility-group">
              <span className="header__accessibility-label">Изображения</span>
              <div className="header__accessibility-controls">
                <button
                  type="button"
                  className={!hideImages ? 'active' : ''}
                  onClick={() => {
                    setEnabled(true)
                    setHideImages(false)
                  }}
                >
                  Показать
                </button>
                <button
                  type="button"
                  className={hideImages ? 'active' : ''}
                  onClick={() => {
                    setEnabled(true)
                    setHideImages(true)
                  }}
                >
                  Отключить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
