import { lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

const NewsPage = lazy(() =>
  import('./pages/NewsPage').then((module) => ({ default: module.NewsPage })),
)
const NewsDetailPage = lazy(() =>
  import('./pages/NewsDetailPage').then((module) => ({ default: module.NewsDetailPage })),
)
const InformationPage = lazy(() =>
  import('./pages/InformationPage').then((module) => ({ default: module.InformationPage })),
)
const InformationDetailPage = lazy(() =>
  import('./pages/InformationDetailPage').then((module) => ({
    default: module.InformationDetailPage,
  })),
)
const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))

const RouteLoader = () => (
  <main
    style={{
      minHeight: '40vh',
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
    }}
  >
    <p>Loading...</p>
  </main>
)

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/information" element={<InformationPage />} />
          <Route path="/information/:id" element={<InformationDetailPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
