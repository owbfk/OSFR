import '../styles/layout/_footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        © {new Date().getFullYear()} Социальный фонд Российской Федерации  
        Демонстрационная версия клиентской части
      </div>
    </footer>
  )
}

export default Footer