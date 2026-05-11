import { useNews } from '../api/newsApi'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { NewsCard } from '../components/NewsCard'
import styles from '../styles/pages/_news.module.scss'

export const NewsPage = () => {
  const { data, isLoading, isError } = useNews()

  return (
    <>
      <Header />

      <main className={styles.page}>
        <h1 className={styles.title}>Новости</h1>

        {isLoading && <p className={styles.status}>Загрузка новостей...</p>}
        {isError && <p className={styles.status}>Не получилось загрузить новости</p>}

        {!isLoading && !isError && (
          <div className={styles.grid}>
            {data?.map((news, index) => (
              <NewsCard
                key={news.id}
                news={news}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
