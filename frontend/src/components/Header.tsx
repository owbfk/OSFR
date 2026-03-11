import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Logo_SFR.png'
import maxLogo from '../assets/Max.png'
import rutubeLogo from '../assets/rutube.png'
import vkLogo from '../assets/VK.png'
import telegramLogo from '../assets/Telegram.png'
import okLogo from '../assets/Odnoklassniki.png'
import eyeImg from '../assets/eye.png'
import { useTheme } from '../context/useTheme'
import '../styles/layout/_header.scss'

const HIDE_SCROLL_OFFSET = 140
const DIRECTION_THRESHOLD = 6
const AUTH_TOKEN_KEY = 'sfr_auth_token'

type AuthMode = 'login' | 'register'
type AuthFields = {
  name: string
  email: string
  password: string
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authFields, setAuthFields] = useState<AuthFields>({
    name: '',
    email: '',
    password: '',
  })
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

  const getStoredToken = () => {
    if (typeof window === 'undefined') return null
    try {
      return window.localStorage.getItem(AUTH_TOKEN_KEY)
    } catch {
      return null
    }
  }

  const setStoredToken = (token: string) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token)
    } catch {
      return
    }
  }

  const clearStoredToken = () => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(AUTH_TOKEN_KEY)
    } catch {
      return
    }
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
    const token = getStoredToken()
    setIsAuthenticated(Boolean(token))
  }, [])

  useEffect(() => {
    if (!isAuthOpen || typeof window === 'undefined') return

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAuthOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [isAuthOpen])

  const openAuthDialog = (mode: AuthMode) => {
    setIsAuthOpen(true)
    setAuthMode(mode)
    setIsOpen(false)
    setIsHeaderHidden(false)
    setAuthFields({ name: '', email: '', password: '' })
  }

  const handleAuthTrigger = () => {
    if (isAuthenticated) {
      clearStoredToken()
      setIsAuthenticated(false)
      return
    }

    openAuthDialog('login')
  }

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const token = `sfr_${authMode}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    setStoredToken(token)
    setIsAuthenticated(true)
    setIsAuthOpen(false)
  }

  const handleAuthFieldChange = (field: keyof AuthFields) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setAuthFields((prev) => ({ ...prev, [field]: value }))
  }

  const headerClass = `header ${isHeaderHidden && !isAccessibilityOpen ? 'header--hidden' : ''}`

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

          <button
            type="button"
            className="header__mobile-login-btn"
            onClick={() => {
              closeMenu()
              handleAuthTrigger()
            }}
            aria-expanded={isAuthOpen}
            aria-haspopup="dialog"
          >
            {isAuthenticated ? 'Выйти' : 'Войти'}
          </button>

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

          <button
            type="button"
            className="header__login-btn"
            onClick={handleAuthTrigger}
            aria-expanded={isAuthOpen}
            aria-haspopup="dialog"
          >
            {isAuthenticated ? 'Выйти' : 'Войти'}
          </button>

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

      {isAuthOpen && (
        <div
          className="header__auth-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-dialog-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsAuthOpen(false)
            }
          }}
        >
          <div className="header__auth-dialog">
            <div className="header__auth-header">
              <h2 id="auth-dialog-title" className="header__auth-title">
                {authMode === 'login' ? 'Вход' : 'Регистрация'}
              </h2>
              <button
                type="button"
                className="header__auth-close"
                onClick={() => setIsAuthOpen(false)}
                aria-label="Закрыть"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="header__auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                className={`header__auth-tab ${authMode === 'login' ? 'active' : ''}`}
                aria-selected={authMode === 'login'}
                onClick={() => setAuthMode('login')}
              >
                Вход
              </button>
              <button
                type="button"
                role="tab"
                className={`header__auth-tab ${authMode === 'register' ? 'active' : ''}`}
                aria-selected={authMode === 'register'}
                onClick={() => setAuthMode('register')}
              >
                Регистрация
              </button>
            </div>

            <form className="header__auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <label className="header__auth-field">
                  <span>Имя</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={authFields.name}
                    onChange={handleAuthFieldChange('name')}
                    required
                  />
                </label>
              )}
              <label className="header__auth-field">
                <span>Эл. почта</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={authFields.email}
                  onChange={handleAuthFieldChange('email')}
                  required
                />
              </label>
              <label className="header__auth-field">
                <span>Пароль</span>
                <input
                  type="password"
                  name="password"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  value={authFields.password}
                  onChange={handleAuthFieldChange('password')}
                  required
                  minLength={6}
                />
              </label>
              <div className="header__auth-actions">
                <button type="submit" className="header__auth-submit">
                  {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </button>
              </div>
            </form>

            <p className="header__auth-note">
              После входа мы сохраняем токен в localStorage, чтобы запомнить сессию.
            </p>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header