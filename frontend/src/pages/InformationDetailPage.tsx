import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useInformationById } from '../api/informationApi'
import styles from '../styles/pages/_informationDetail.module.scss'

export const InformationDetailPage = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useInformationById(id!)

  return (
    <>
      <Header />

      <main className={styles.page}>
        {isLoading ? (
          <p className={styles.status}>Загрузка раздела...</p>
        ) : (
          <article className={styles.article}>
            <Link to="/information" className={styles.backLink}>
              Назад к информации
            </Link>

            {(isError || !data) && (
              <p className={styles.notice}>Материал не найден. Показана временная заглушка.</p>
            )}

            <span className={styles.category}>{data?.category ?? 'Раздел информации'}</span>
            <h1 className={styles.title}>{data?.title ?? 'Материал недоступен'}</h1>
            <span className={styles.date}>{data?.updatedAt ?? 'Дата не указана'}</span>
            <p className={styles.content}>{data?.content ?? 'Текст появится позже.'}</p>
          </article>
        )}
      </main>

      <Footer />
    </>
  )
}
