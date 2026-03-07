import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {
  contactIntro,
  leadershipMembers,
  regionContacts,
} from '../data/contactsData'
import '../styles/pages/_contacts.scss'

const ContactsPage = () => {
  const [openRegionIndex, setOpenRegionIndex] = useState<number | null>(null)
  const [openLeaderIndex, setOpenLeaderIndex] = useState<number | null>(null)

  return (
    <>
      <Header />

      <main className="contacts">
        <section className="section contacts__primary">
          <div className="container">
            <div className="contacts__hero-block">
              <h1>{contactIntro.title}</h1>
              <p>{contactIntro.hotlineTitle}</p>
              <p className="contacts__hero-phone">{contactIntro.hotlineValue}</p>
            </div>

            <div className="contacts__overview">
              <article className="contacts__overview-card contacts__overview-card--wide">
                <h2>Быстрая связь</h2>
                <div className="contacts__pairs">
                  <p><strong>{contactIntro.regionalTitle}:</strong> {contactIntro.regionalPhone}</p>
                  <p><strong>{contactIntro.receptionTitle}:</strong> {contactIntro.receptionPhone}</p>
                  <p><strong>{contactIntro.emailTitle}:</strong> {contactIntro.emailValue}</p>
                  <p><strong>{contactIntro.pressTitle}:</strong> press@45.sfr.gov.ru</p>
                </div>
                <div className="contacts__actions">
                  <a href="tel:88001000001">Позвонить 8 (800) 100-00-01</a>
                </div>
              </article>

              <article className="contacts__overview-card">
                <h2>Адрес и режим</h2>
                <p><strong>{contactIntro.addressTitle}:</strong> {contactIntro.addressValue}</p>
                <p><strong>{contactIntro.scheduleTitle}:</strong> {contactIntro.scheduleValue}</p>
              </article>

              <article className="contacts__overview-card">
                <h2>Запись и обращения</h2>
                <p>{contactIntro.appointmentTitle}</p>
                <p>{contactIntro.appealsTitle}</p>
                <div className="contacts__actions contacts__actions--column">
                  <a href="https://www.gosuslugi.ru/671331/1/form" target="_blank" rel="noreferrer">
                    Предварительная запись
                  </a>
                  <a href="https://social-insurance.sfr.gov.ru/reception_desk/request/" target="_blank" rel="noreferrer">
                    Электронное обращение
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>Клиентские службы по регионам</h2>

            <div className="contacts__list contacts__list--regions">
              {regionContacts.map((region, index) => {
                const isOpen = openRegionIndex === index

                return (
                  <article key={region.name} className={`contacts__item ${isOpen ? 'active' : ''}`}>
                    <button
                      type="button"
                      className="contacts__item-toggle"
                      onClick={() => setOpenRegionIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{region.name}</span>
                      <span className="contacts__item-icon">{isOpen ? '-' : '+'}</span>
                    </button>

                    {isOpen && (
                      <div className="contacts__item-extra contacts__item-extra--region">
                        <p><strong>Адрес:</strong> {region.address}</p>
                        <p><strong>Телефон:</strong> {region.phone}</p>
                        <p><strong>График приема:</strong> {region.schedule}</p>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>Руководство</h2>

            <div className="contacts__list contacts__list--leaders">
              {leadershipMembers.map((person, index) => {
                const isOpen = openLeaderIndex === index

                return (
                  <article key={person.name} className={`contacts__item ${isOpen ? 'active' : ''}`}>
                    <button
                      type="button"
                      className="contacts__item-toggle"
                      onClick={() => setOpenLeaderIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{person.name}</span>
                      <span className="contacts__item-icon">{isOpen ? '-' : '+'}</span>
                    </button>

                    <div className="contacts__item-main">
                      <p>{person.role}</p>
                    </div>

                    {isOpen && <div className="contacts__item-extra" />}
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default ContactsPage
