import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { loginUser, registerUser } from '../api/authApi'
import { createAppeal } from '../api/appealsApi'
import {
  AUTH_EVENT_NAME,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  isStoredTokenExpired,
  setAuthSession,
  type AuthUser,
} from '../auth/session'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/pages/_auth.scss'

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
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [isAuthPending, setIsAuthPending] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [requestFields, setRequestFields] = useState<RequestFields>({
    subject: '',
    message: '',
    phone: '',
    email: '',
    preferredContact: 'email',
  })
  const [requestSent, setRequestSent] = useState(false)
  const [isRequestPending, setIsRequestPending] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  const syncAuthState = () => {
    const token = getStoredToken()

    if (!token) {
      setIsAuthenticated(false)
      setAuthUser(null)
      return
    }

    if (isStoredTokenExpired()) {
      clearAuthSession()
      setIsAuthenticated(false)
      setAuthUser(null)
      return
    }

    setIsAuthenticated(true)
    setAuthUser(getStoredUser())
  }

  useEffect(() => {
    syncAuthState()

    if (typeof window === 'undefined') return

    const handleAuthChange = () => syncAuthState()
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY || event.key === AUTH_USER_KEY || event.key === null) {
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
    setAuthError(null)
    setAuthFields((prev) => ({ ...prev, [field]: value }))
  }

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = authFields.email.trim().toLowerCase()
    const password = authFields.password
    const name = authFields.name.trim()

    if (authMode === 'register' && !name) {
      setAuthError('Укажите имя для регистрации.')
      return
    }

    setIsAuthPending(true)
    setAuthError(null)

    try {
      const authResult =
        authMode === 'register'
          ? await registerUser({ email, password, name })
          : await loginUser({ email, password })

      setAuthSession(authResult.accessToken, authResult.user)
      setIsAuthenticated(true)
      setAuthUser(authResult.user)
      setRequestSent(false)
      setRequestError(null)
      setRequestFields((prev) => ({
        ...prev,
        email: email || prev.email,
      }))
      setAuthFields((prev) => ({
        ...prev,
        password: '',
        name: authMode === 'register' ? '' : prev.name,
      }))
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Не удалось выполнить авторизацию.')
    } finally {
      setIsAuthPending(false)
    }
  }

  const handleRequestChange =
    (field: keyof RequestFields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value } = event.target
      if (requestError) {
        setRequestError(null)
      }
      setRequestFields((prev) => ({ ...prev, [field]: value }))
    }

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authUser) {
      setRequestError('Пользователь не определен. Выполните вход повторно.')
      return
    }

    setIsRequestPending(true)
    setRequestError(null)

    try {
      await createAppeal({
        userId: authUser.id,
        userEmail: authUser.email,
        userName: authUser.name,
        subject: requestFields.subject.trim(),
        message: requestFields.message.trim(),
        phone: requestFields.phone.trim(),
        email: requestFields.email.trim().toLowerCase(),
        preferredContact: requestFields.preferredContact,
        status: 'new',
        createdAt: new Date().toISOString(),
      })

      setRequestSent(true)
      setRequestFields((prev) => ({
        ...prev,
        subject: '',
        message: '',
        phone: '',
      }))
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Не удалось отправить обращение.')
    } finally {
      setIsRequestPending(false)
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    setIsAuthenticated(false)
    setAuthUser(null)
    setAuthError(null)
    setRequestError(null)
    setRequestSent(false)
    setRequestFields({
      subject: '',
      message: '',
      phone: '',
      email: '',
      preferredContact: 'email',
    })
  }

  const submitLabel =
    authMode === 'login'
      ? isAuthPending
        ? 'Входим...'
        : 'Войти'
      : isAuthPending
        ? 'Создаём аккаунт...'
        : 'Создать аккаунт'

  const authSubtitle = authUser?.name
    ? `Вы вошли как ${authUser.name}${authUser.email ? ` (${authUser.email})` : ''}.`
    : authUser?.email
      ? `Вы вошли как ${authUser.email}.`
      : 'Вы вошли в систему.'

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
                        disabled={isRequestPending}
                        required
                      />
                    </label>
                    <label className="auth__field">
                      <span>Сообщение</span>
                      <textarea
                        name="message"
                        value={requestFields.message}
                        onChange={handleRequestChange('message')}
                        disabled={isRequestPending}
                        required
                      />
                    </label>
                    <label className="auth__field">
                      <span>Способ связи</span>
                      <select
                        name="preferredContact"
                        value={requestFields.preferredContact}
                        onChange={handleRequestChange('preferredContact')}
                        disabled={isRequestPending}
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
                        disabled={isRequestPending}
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
                        disabled={isRequestPending}
                        required
                      />
                    </label>
                    {requestError && (
                      <p className="auth__error" role="alert">
                        {requestError}
                      </p>
                    )}
                    <div className="auth__actions">
                      <button type="submit" className="auth__submit" disabled={isRequestPending}>
                        {isRequestPending ? 'Отправляем обращение...' : 'Отправить обращение'}
                      </button>
                    </div>
                  </form>
                )}

                <p className="auth__note">
                  Обращения обрабатываются в рабочее время. Отправленные заявки сохраняются в системе.
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
                  <span>Отправка обращений</span>
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
                  <p>{authSubtitle}</p>
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
                      disabled={isAuthPending}
                    >
                      Вход
                    </button>
                    <button
                      type="button"
                      role="tab"
                      className={`auth__tab ${authMode === 'register' ? 'active' : ''}`}
                      aria-selected={authMode === 'register'}
                      onClick={() => setAuthMode('register')}
                      disabled={isAuthPending}
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
                    {authError && (
                      <p className="auth__error" role="alert">
                        {authError}
                      </p>
                    )}
                    <div className="auth__actions">
                      <button type="submit" className="auth__submit" disabled={isAuthPending}>
                        {submitLabel}
                      </button>
                      <Link className="auth__ghost" to="/">
                        На главную
                      </Link>
                    </div>
                  </form>

                  <p className="auth__note">
                    После входа мы сохраняем данные, чтобы запомнить сессию.
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
