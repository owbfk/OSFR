import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/pages/_auth.scss'

const AUTH_TOKEN_KEY = 'sfr_auth_token'
const AUTH_EVENT_NAME = 'auth:changed'

type AuthMode = 'login' | 'register'
type AuthFields = {
  name: string
  email: string
  password: string
}

type RequestFields = {
  subject: string
  message: string
  phone: string
  email: string
  preferredContact: 'email' | 'phone'
}

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authFields, setAuthFields] = useState<AuthFields>({
    name: '',
    email: '',
    password: '',
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [requestFields, setRequestFields] = useState<RequestFields>({
    subject: '',
    message: '',
    phone: '',
    email: '',
    preferredContact: 'email',
  })
  const [requestSent, setRequestSent] = useState(false)

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

  const dispatchAuthChange = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event(AUTH_EVENT_NAME))
  }

  const syncAuthState = () => {
    setIsAuthenticated(Boolean(getStoredToken()))
  }

  useEffect(() => {
    syncAuthState()

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

  const handleAuthFieldChange = (field: keyof AuthFields) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setAuthFields((prev) => ({ ...prev, [field]: value }))
  }

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const token = `sfr_${authMode}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    setStoredToken(token)
    setIsAuthenticated(true)
    setRequestSent(false)
    setRequestFields((prev) => ({
      ...prev,
      email: authFields.email || prev.email,
    }))
    dispatchAuthChange()
  }

  const handleRequestChange =
    (field: keyof RequestFields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value } = event.target
      setRequestFields((prev) => ({ ...prev, [field]: value }))
    }

  const handleRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRequestSent(true)
  }

  const handleLogout = () => {
    clearStoredToken()
    setIsAuthenticated(false)
    setRequestSent(false)
    setRequestFields({
      subject: '',
      message: '',
      phone: '',
      email: '',
      preferredContact: 'email',
    })
    dispatchAuthChange()
  }

  return (
    <>
      <Header />

      <main className="auth">
        <section className="section auth__section">
          <div className="container auth__grid">
            {isAuthenticated ? (
              <div className="auth__request">
                <div className="auth__request-head">
                  <h2>Обращение в контактный центр</h2>
                  <p>Опишите вопрос, и мы свяжемся удобным для вас способом.</p>
                </div>

                {requestSent ? (
                  <div className="auth__success">
                    <h2>Обращение отправлено</h2>
                    <p>Мы зарегистрировали запрос и вернемся с ответом в ближайшее время.</p>
                    <div className="auth__actions">
                      <button
                        type="button"
                        className="auth__submit"
                        onClick={() => setRequestSent(false)}
                      >
                        Новое обращение
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="auth__form" onSubmit={handleRequestSubmit}>
                    <label className="auth__field">
                      <span>Тема обращения</span>
                      <input
                        type="text"
                        name="subject"
                        value={requestFields.subject}
                        onChange={handleRequestChange('subject')}
                        required
                      />
                    </label>
                    <label className="auth__field">
                      <span>Сообщение</span>
                      <textarea
                        name="message"
                        value={requestFields.message}
                        onChange={handleRequestChange('message')}
                        required
                      />
                    </label>
                    <label className="auth__field">
                      <span>Способ связи</span>
                      <select
                        name="preferredContact"
                        value={requestFields.preferredContact}
                        onChange={handleRequestChange('preferredContact')}
                      >
                        <option value="email">Эл. почта</option>
                        <option value="phone">Телефон</option>
                      </select>
                    </label>
                    <label className="auth__field">
                      <span>Телефон</span>
                      <input
                        type="tel"
                        name="phone"
                        value={requestFields.phone}
                        onChange={handleRequestChange('phone')}
                        required={requestFields.preferredContact === 'phone'}
                        placeholder="+7"
                      />
                    </label>
                    <label className="auth__field">
                      <span>Эл. почта</span>
                      <input
                        type="email"
                        name="requestEmail"
                        value={requestFields.email}
                        onChange={handleRequestChange('email')}
                        required
                      />
                    </label>
                    <div className="auth__actions">
                      <button type="submit" className="auth__submit">
                        Отправить обращение
                      </button>
                    </div>
                  </form>
                )}

                <p className="auth__note">
                  Обращения обрабатываются в рабочее время. Это демонстрационная форма без отправки на сервер.
                </p>
              </div>
            ) : (
              <div className="auth__intro">
                <h1>Личный кабинет СФР</h1>
                <p>
                  Войдите или создайте учетную запись, чтобы быстрее получать справки,
                  отслеживать обращения и управлять сервисами отделения.
                </p>
                <div className="auth__pill-row">
                  <span>Единый вход</span>
                  <span>Уведомления по обращениям</span>
                  <span>Сохранение заявок</span>
                </div>
                <ul className="auth__features">
                  <li>История обращений и статусов</li>
                  <li>Повторная запись на прием в два клика</li>
                  <li>Персональные напоминания по выплатам</li>
                </ul>
              </div>
            )}

            <div className="auth__card">
              {isAuthenticated ? (
                <div className="auth__success">
                  <h2>Вы уже вошли</h2>
                  <p>Токен хранится в localStorage — сессия будет восстановлена автоматически.</p>
                  <div className="auth__actions">
                    <Link className="auth__ghost" to="/">
                      На главную
                    </Link>
                    <button type="button" className="auth__submit" onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="auth__tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      className={`auth__tab ${authMode === 'login' ? 'active' : ''}`}
                      aria-selected={authMode === 'login'}
                      onClick={() => setAuthMode('login')}
                    >
                      Вход
                    </button>
                    <button
                      type="button"
                      role="tab"
                      className={`auth__tab ${authMode === 'register' ? 'active' : ''}`}
                      aria-selected={authMode === 'register'}
                      onClick={() => setAuthMode('register')}
                    >
                      Регистрация
                    </button>
                  </div>

                  <form className="auth__form" onSubmit={handleAuthSubmit}>
                    {authMode === 'register' && (
                      <label className="auth__field">
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
                    <label className="auth__field">
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
                    <label className="auth__field">
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
                    <div className="auth__actions">
                      <button type="submit" className="auth__submit">
                        {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
                      </button>
                      <Link className="auth__ghost" to="/">
                        На главную
                      </Link>
                    </div>
                  </form>

                  <p className="auth__note">
                    После входа мы сохраняем токен в localStorage, чтобы запомнить сессию.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default AuthPage