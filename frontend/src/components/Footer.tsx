import { useSupportPhoneInfo } from '../api/siteContentApi'
import '../styles/layout/_footer.scss'

const FOOTER_FALLBACK = {
  title: 'Не нашли ответ на свой вопрос?',
  subtitle: 'Свяжитесь с нами.',
  phone: '8 (800) 100-00-01',
  center: 'Региональный контакт-центр СФР',
  requestText: 'Оставить электронное обращение',
} as const

const Footer = () => {
  const { data } = useSupportPhoneInfo()
  const supportPhoneInfo = data ?? FOOTER_FALLBACK

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__meta">
          <p>© {new Date().getFullYear()} Социальный фонд Российской Федерации</p>
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
