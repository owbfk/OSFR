import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useRegionContacts } from '../hooks/useRegionContacts'
import { useLeadershipMembers } from '../hooks/useLeadershipMembers'
import { useContactIntro } from '../api/siteContentApi'
import type { RegionContact } from '../types/contacts'
import '../styles/pages/_contacts.scss'

const CONTACT_INTRO_FALLBACK = {
  title: 'Контакты отделения',
  hotlineTitle: 'Горячая линия',
  hotlineValue: '8 (800) 100-00-01',
  regionalTitle: 'Региональный контакт-центр для страхователей',
  regionalPhone: '8 (3522) 49-16-16',
  receptionTitle: 'Приемная руководителя',
  receptionPhone: '8 (3522) 48-80-37',
  emailTitle: 'Электронный адрес',
  emailValue: 'info@45.sfr.gov.ru',
  pressTitle: 'Для прессы',
  addressTitle: 'Адрес',
  addressValue: '640022, Курганская область, г. Курган, ул. Гоголя, 153',
  scheduleTitle: 'График работы',
  scheduleValue: 'Пн-Пт: 08:00-17:00, перерыв 12:00-13:00',
  appointmentTitle: 'Оформить предварительную запись на прием в СФР',
  appealsTitle: 'Обращения граждан принимаются:',
} as const

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-а-яё]+/gi, '')
    .replace(/\-+/g, '-')

const ContactsPage = () => {
  const [openRegionId, setOpenRegionId] = useState<string | null>(null)
  const [openLeaderIndex, setOpenLeaderIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showAllRegions, setShowAllRegions] = useState<boolean>(false)

  const { data: regionContacts = [], isLoading, isError } = useRegionContacts()
  const {
    data: leadershipMembers = [],
    isLoading: isLeadersLoading,
    isError: isLeadersError,
  } = useLeadershipMembers()

  const { data: contactIntroData } = useContactIntro()
  const contactIntro = contactIntroData ?? CONTACT_INTRO_FALLBACK

  const term = searchTerm.trim().toLowerCase()

  const filteredRegions = term
    ? regionContacts.filter((r) => r.name.toLowerCase().includes(term))
    : regionContacts

  const visibleRegions =
    term !== ''
      ? filteredRegions
      : showAllRegions
      ? regionContacts
      : regionContacts.slice(0, 2)

  type RWithCid = RegionContact & { __cid: string }
  const idCounts = new Map<string, number>()
  const visibleWithId: RWithCid[] = visibleRegions.map((r) => {
    const base = r.id ? String(r.id) : slugify(r.name)
    const count = idCounts.get(base) ?? 0
    idCounts.set(base, count + 1)
    const cid = count === 0 ? base : `${base}-${count}`
    return { ...r, __cid: cid }
  })

  useEffect(() => {
    if (openRegionId && !visibleWithId.some((r) => r.__cid === openRegionId)) {
      setOpenRegionId(null)
    }
  }, [visibleWithId, openRegionId])

  useEffect(() => {
    if (openLeaderIndex !== null && openLeaderIndex >= leadershipMembers.length) {
      setOpenLeaderIndex(null)
    }
  }, [leadershipMembers, openLeaderIndex])

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

            <div className="contacts__list-controls">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  const v = e.target.value
                  setSearchTerm(v)
                  if (v.trim() === '') {
                    setShowAllRegions(false)
                  }
                }}
                placeholder="Поиск региона"
                aria-label="Поиск региона"
                className="contacts__search-input"
              />

              {!isLoading && !isError && term === '' && regionContacts.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllRegions((s) => !s)}
                  className="contacts__toggle-btn"
                >
                  {showAllRegions ? 'Скрыть' : `Показать ещё ${regionContacts.length - 2}`}
                </button>
              )}
            </div>

            <div className="contacts__list contacts__list--regions">
              {isLoading && <p>Загрузка списка регионов...</p>}
              {isError && <p>Не удалось загрузить список регионов. Попробуйте позже.</p>}
              {!isLoading && !isError && visibleWithId.length === 0 && <p>Регион не найден.</p>}

              {!isLoading && !isError && visibleWithId.map((region) => {
                const isOpen = openRegionId === region.__cid

                return (
                  <article key={region.__cid} className={`contacts__item ${isOpen ? 'active' : ''}`}>
                    <button
                      type="button"
                      className="contacts__item-toggle"
                      onClick={() => setOpenRegionId(isOpen ? null : region.__cid)}
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
              {isLeadersLoading && <p>Загрузка списка руководства...</p>}
              {isLeadersError && <p>Не удалось загрузить список руководства. Попробуйте позже.</p>}
              {!isLeadersLoading && !isLeadersError && leadershipMembers.length === 0 && (
                <p>Список руководства пока пуст.</p>
              )}

              {!isLeadersLoading && !isLeadersError && leadershipMembers.map((person, index) => {
                const isOpen = openLeaderIndex === index
                const key = person.id ?? person.name

                return (
                  <article key={key} className={`contacts__item ${isOpen ? 'active' : ''}`}>
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

                    {isOpen && (
                      <div className="contacts__item-extra">
                        <p>
                          <strong>Дополнительная информация:</strong>{' '}
                          {person.details?.trim() ? person.details : 'Дополнительная информация отсутствует.'}
                        </p>
                      </div>
                    )}
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
