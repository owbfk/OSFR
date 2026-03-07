import { Link } from 'react-router-dom'
import { NewsCard } from '../components/NewsCard'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useNews } from '../hooks/useNews'
import '../styles/pages/_home.scss'

const HomePage = () => {
  const { data: news, isLoading, isError } = useNews()

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
            <h2>Популярные услуги</h2>

            <div className="home__grid">
              <div className="home__card">
                <div className="home__card-title">Назначение пенсии</div>
                <p>Информация о порядке оформления и перечне документов.</p>
              </div>

              <div className="home__card">
                <div className="home__card-title">Социальные выплаты</div>
                <p>Перечень действующих мер социальной поддержки.</p>
              </div>

              <div className="home__card">
                <div className="home__card-title">Запись на приём</div>
                <p>Онлайн-запись в территориальные подразделения.</p>
              </div>
            </div>
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