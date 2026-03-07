import { Link } from 'react-router-dom'
import { NewsCard } from '../components/NewsCard'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useNews } from '../hooks/useNews'
import { useInformation } from '../api/informationApi'
import type { InformationCategory } from '../types/information'
import { contactIntro, supportPhoneInfo } from '../data/contactsData'
import '../styles/pages/_home.scss'

const INFO_CATEGORIES: InformationCategory[] = [
  'Гражданам',
  'Страхователям',
  'Медицинским организациям',
  'Центры общения для людей старшего поколения',
  'Прочее',
]

const CATEGORY_DESCRIPTIONS: Record<InformationCategory, string> = {
  'Гражданам': 'Базовые сервисы, обращения и разъяснения по выплатам.',
  'Страхователям': 'Отчетность, взаимодействие и организационные материалы.',
  'Медицинским организациям': 'Рабочая информация для медучреждений и партнеров.',
  'Центры общения для людей старшего поколения': 'Активности, консультации и сервисы центров общения.',
  'Прочее': 'Дополнительные справочные материалы и популярные вопросы.',
}

const HomePage = () => {
  const { data: news, isLoading, isError } = useNews()
  const { data: information, isLoading: isInfoLoading, isError: isInfoError } = useInformation()

  const groupedInfo = INFO_CATEGORIES.map((category) => {
    const items = information?.filter((entry) => entry.category === category) ?? []

    return {
      category,
      count: items.length,
      previewTopics: items.slice(0, 2).map((item) => item.title).join(' • '),
    }
  })

  return (
    <>
      <Header />

      <main className="home">
        <section className="home__hero">
          <div className="home__hero-content">
            <h1 className="home__title">Региональное отделение Социального фонда Российской Федерации</h1>
            <p className="home__description">
              Официальный информационный ресурс для получения сведений о социальных выплатах,
              услугах и порядке обращения граждан.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="home__contacts-redesign">
              <article className="home__contacts-main">
                <header className="home__contacts-head">
                  <h2>Контакты отделения</h2>
                  <p>{supportPhoneInfo.center}</p>
                </header>

                <p className="home__contacts-phone">{supportPhoneInfo.phone}</p>

                <div className="home__contacts-meta">
                  <p><strong>Адрес:</strong> {contactIntro.addressValue}</p>
                  <p><strong>График:</strong> {contactIntro.scheduleValue}</p>
                </div>

                <div className="home__contacts-actions">
                  <a href="tel:88001000001">Позвонить</a>
                  <a href="mailto:info@45.sfr.gov.ru">Написать на email</a>
                  <a href="https://social-insurance.sfr.gov.ru/reception_desk/" target="_blank" rel="noreferrer">
                    Электронное обращение
                  </a>
                </div>
              </article>

              <aside className="home__contacts-side">
                <h3>{supportPhoneInfo.title}</h3>
                <p>{supportPhoneInfo.subtitle}</p>
                <p>{contactIntro.hotlineTitle}</p>
                <p>{contactIntro.hotlineValue}</p>

                <div className="home__contacts-side-links">
                  <a href="https://www.gosuslugi.ru/671331/1/form" target="_blank" rel="noreferrer">
                    Предварительная запись
                  </a>
                  <Link to="/contacts">Вся контактная информация</Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="home__section-head">
              <h2>Информация</h2>
              <Link className="home__news-link" to="/information">
                Все разделы
              </Link>
            </div>

            {isInfoLoading && <p>Загрузка информации...</p>}
            {isInfoError && <p>Ошибка загрузки информации.</p>}

            {!isInfoLoading && !isInfoError && (
              <div className="home__info-grid">
                {groupedInfo.map((group) => (
                  <article key={group.category} className="home__info-card">
                    <div className="home__info-card-head">
                      <h3>{group.category}</h3>
                      <span>{group.count}</span>
                    </div>
                    <p>{CATEGORY_DESCRIPTIONS[group.category]}</p>
                    <div className="home__info-preview">
                      {group.previewTopics || 'Темы скоро будут опубликованы.'}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="home__section-head">
              <h2>Новости</h2>
              <Link className="home__news-link" to="/news">
                Все новости
              </Link>
            </div>

            {isLoading && <p>Загрузка данных...</p>}
            {isError && <p>Ошибка загрузки данных.</p>}

            {!isLoading && !isError && (
              <div className="home__news-layout">
                <div className="home__news-grid">
                  {news?.slice(0, 3).map((item) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>

                <aside className="home__news-aside">
                  <h3>Раздел новостей</h3>
                  <p>
                    Все публикации, изменения и объявления доступны на отдельной странице.
                  </p>
                  <Link className="home__news-link home__news-link--aside" to="/news">
                    Перейти к новостям
                  </Link>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default HomePage
