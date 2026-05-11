import { Link } from 'react-router-dom'
import { NewsCard } from '../components/NewsCard'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useNews } from '../hooks/useNews'
import { useInformation } from '../api/informationApi'
import { useContactIntro, useInformationMeta, useSupportPhoneInfo } from '../api/siteContentApi'
import '../styles/pages/_home.scss'
import backImg from '../assets/back.jpg'
import orderImg from '../assets/order-icon.svg'
import openDataImg from '../assets/open-data-icon.svg'
import antiCorruptionImg from '../assets/anti_corruption-icon.svg'
import linksImg from '../assets/links-icon.svg'

const HomePage = () => {
  const { data: news, isLoading, isError } = useNews()
  const { data: information, isLoading: isInfoLoading, isError: isInfoError } = useInformation()
  const { data: contactIntro } = useContactIntro()
  const { data: supportPhoneInfo } = useSupportPhoneInfo()
  const { data: informationMeta } = useInformationMeta()

  const categories = informationMeta?.categories?.length
    ? informationMeta.categories
    : Array.from(new Set((information ?? []).map((entry) => entry.category)))

  const categoryDescriptions = informationMeta?.categoryDescriptions ?? {}

  const groupedInfo = categories.map((category) => {
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
          <img
            className="home__hero-image"
            src={backImg}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="home__hero-overlay" aria-hidden="true" />
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
                  <p>{supportPhoneInfo?.center ?? 'Региональный контакт-центр СФР'}</p>
                </header>

                <p className="home__contacts-phone">{supportPhoneInfo?.phone ?? '8 (800) 100-00-01'}</p>

                <div className="home__contacts-meta">
                  <p><strong>Адрес:</strong> {contactIntro?.addressValue ?? 'Адрес уточняется'}</p>
                  <p><strong>График:</strong> {contactIntro?.scheduleValue ?? 'График уточняется'}</p>
                </div>

                <div className="home__contacts-actions">
                  <a href="tel:88001000001">Позвонить</a>
                </div>
              </article>

              <aside className="home__contacts-side">
                <h3>{supportPhoneInfo?.title ?? 'Не нашли ответ на свой вопрос?'}</h3>
                <p>{supportPhoneInfo?.subtitle ?? 'Свяжитесь с нами.'}</p>
                <p>{contactIntro?.hotlineTitle ?? 'Горячая линия'}</p>
                <p>{contactIntro?.hotlineValue ?? '8 (800) 100-00-01'}</p>

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
                  <Link key={group.category} className="home__info-item" to="/information">
                    <div className="home__info-item-head">
                      <h3>{group.category}</h3>
                      <span className="home__info-item-count">{group.count}</span>
                    </div>
                    <p className="home__info-item-desc">
                      {categoryDescriptions[group.category] ?? 'Описание раздела скоро будет добавлено.'}
                    </p>
                    <div className="home__info-item-preview">
                      {group.previewTopics || 'Темы скоро будут опубликованы.'}
                    </div>
                  </Link>
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

        <section className="section home__extras-section">
          <div className="container">
            <div className="home__section-head">
              <h2>Дополнительные ссылки</h2>
            </div>

            <div className="home__extras-grid">
              <a className="home__extras-card" href="https://sfr.gov.ru/order/" target="_blank" rel="noreferrer">
                <span className="home__extras-image-placeholder" aria-hidden="true">
                  <img
                    className="home__extras-image-placeholder"
                    src={orderImg}
                    alt="Законодательство"
                    loading="lazy"
                    decoding="async"
                    width={28}
                    height={28}
                  />
                </span>
                <span>Законодательство</span>
              </a>

              <a className="home__extras-card" href="https://sfr.gov.ru/opendata/" target="_blank" rel="noreferrer">
                <span className="home__extras-image-placeholder" aria-hidden="true">
                  <img
                    className="home__extras-image-placeholder"
                    src={openDataImg}
                    alt="Открытые данные"
                    loading="lazy"
                    decoding="async"
                    width={28}
                    height={28}
                  />
                </span>
                <span>Открытые данные</span>
              </a>

              <a className="home__extras-card" href="https://sfr.gov.ru/anti_corruption/" target="_blank" rel="noreferrer">
                <span className="home__extras-image-placeholder" aria-hidden="true">
                  <img
                    className="home__extras-image-placeholder"
                    src={antiCorruptionImg}
                    alt="Противодействие коррупции"
                    loading="lazy"
                    decoding="async"
                    width={28}
                    height={28}
                  />
                </span>
                <span>Противодействие коррупции</span>
              </a>

              <a className="home__extras-card" href="https://sfr.gov.ru/links/" target="_blank" rel="noreferrer">
                <span className="home__extras-image-placeholder" aria-hidden="true">
                  <img
                    className="home__extras-image-placeholder"
                    src={linksImg}
                    alt="Полезные ссылки"
                    loading="lazy"
                    decoding="async"
                    width={28}
                    height={28}
                  />
                </span>
                <span>Полезные ссылки</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default HomePage
