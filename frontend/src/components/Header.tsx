import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import "../styles/layout/_header.scss"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { toggleAccessible } = useTheme()

  return (
    <header className="header">
      <div className="header__container">

        <div className="header__logo">
          Социальный фонд РФ
        </div>

        <nav className={`header__nav ${isOpen ? "active" : ""}`}>
          <Link to="/">Главная</Link>
          <Link to="/services">Услуги</Link>
          <Link to="/contacts">Контакты</Link>
        </nav>

        <div className="header__controls">
          <button
            className="header__accessible-btn"
            onClick={toggleAccessible}
          >
            Версия для слабовидящих
          </button>

          <button
            className="header__burger"
            onClick={() => setIsOpen(prev => !prev)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header