import { useNews } from '../api/newsApi'
import { NewsCard } from '../components/NewsCard'
import styles from '../styles/pages/_news.module.scss'

export const NewsPage = () => {
  const { data, isLoading, isError } = useNews()

  if (isLoading) return <p>Загрузка...</p>
  if (isError) return <p>Ошибка загрузки</p>

  return (
    <div className={styles.page}>
      <h1>Новости</h1>

      <div className={styles.grid}>
        {data?.map(news => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  )
}