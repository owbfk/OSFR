import { ThemeProvider } from "./context/ThemeContext"
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { NewsPage } from "./pages/NewsPage"
import { NewsDetailPage } from "./pages/NewsDetailPage"

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
