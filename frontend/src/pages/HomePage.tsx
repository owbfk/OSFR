import '../styles/pages/_home.scss'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNews } from '../hooks/useNews'

const HomePage = () => {
  const { data: news, isLoading, isError } = useNews()
  return (
    <>
      <Header />

      <main className="home">

        {/* HERO */}
        <section className="home__hero">
          <div className="home__hero-content">
            <h1 className="home__title">
              Региональное отделение Социального фонда Российской Федерации
            </h1>
            <p className="home__description">
              Официальный информационный ресурс для получения сведений
              о социальных выплатах, услугах и порядке обращения граждан.
            </p>
          </div>
        </section>

        {/* УСЛУГИ */}
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

        {/* НОВОСТИ */}
        <section className="section">
          <div className="container">
            <h2>Новости</h2>

            {isLoading && <p>Загрузка данных...</p>}

            {isError && <p>Ошибка загрузки данных.</p>}

            {!isLoading && !isError && (
              <div className="home__grid">
                {news?.map(item => (
                  <div key={item.id} className="home__card">
                    <div className="home__card-title">{item.title}</div>
                    <p>{item.description}</p>
                    <small>{item.date}</small>
                  </div>
                ))}
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