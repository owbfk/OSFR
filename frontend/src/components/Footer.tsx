import { supportPhoneInfo } from '../data/contactsData'
import '../styles/layout/_footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__meta">
          <p>© {new Date().getFullYear()} Социальный фонд Российской Федерации</p>
          <p>Демонстрационная версия клиентской части</p>
        </div>

        <div className="footer__contacts">
          <p className="footer__contacts-title">{supportPhoneInfo.title}</p>
          <p>{supportPhoneInfo.subtitle}</p>
          <p className="footer__phone">{supportPhoneInfo.phone}</p>
          <p>{supportPhoneInfo.center}</p>
          <p>{supportPhoneInfo.requestText}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
