import { ThemeProvider } from "./context/ThemeContext"
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { NewsPage } from "./pages/NewsPage"
import { NewsDetailPage } from "./pages/NewsDetailPage"
import ContactsPage from './pages/ContactsPage'
import { InformationPage } from './pages/InformationPage'
import { InformationDetailPage } from './pages/InformationDetailPage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/information/:id" element={<InformationDetailPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
