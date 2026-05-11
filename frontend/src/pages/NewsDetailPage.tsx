import { Link, useParams } from 'react-router-dom'
import { useNewsById } from '../api/newsApi'
import Footer from '../components/Footer'
import Header from '../components/Header'
import styles from '../styles/pages/_newsDetail.module.scss'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'%3E%3Crect width='1200' height='630' fill='%23eef4f8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23607080' font-size='44' font-family='Arial,sans-serif'%3ENo image available%3C/text%3E%3C/svg%3E"

export const NewsDetailPage = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useNewsById(id!)

  const title = data?.title?.trim() || 'Новость недоступна'
  const date = data?.date?.trim() || 'Дата не указана'
  const image = data?.image?.trim() || PLACEHOLDER_IMAGE
  const content =
    data?.content?.trim() ||
    data?.description?.trim() ||
    'Текст новости временно недоступен. Попробуйте открыть материал позже.'

  return (
    <>
      <Header />

      <main className={styles.page}>
        {isLoading ? (
          <p className={styles.status}>Загрузка новости...</p>
        ) : (
          <article className={styles.article}>
            <div className={styles.topBar}>
              <Link to="/news" className={styles.backLink}>
                Назад к новостям
              </Link>
            </div>

            {(isError || !data) && (
              <p className={styles.notice}>Материал не найден. Показаны данные-заглушки.</p>
            )}

            <h1 className={styles.title}>{title}</h1>

            <img
              className={styles.image}
              src={image}
              alt={title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={1200}
              height={630}
            />

            <span className={styles.date}>{date}</span>

            <p className={styles.content}>{content}</p>
          </article>
        )}
      </main>

      <Footer />
    </>
  )
}
