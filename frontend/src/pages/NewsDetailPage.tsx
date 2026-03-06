import { useParams } from 'react-router-dom'
import { useNewsById } from '../api/newsApi'
import styles from '../styles/pages/_newsDetail.module.scss'

export const NewsDetailPage = () => {
  const { id } = useParams()

  const { data, isLoading, isError } = useNewsById(id!)

  if (isLoading) return <p>Загрузка...</p>
  if (isError || !data) return <p>Новость не найдена</p>

  return (
    <div className={styles.page}>
      <h1>{data.title}</h1>

      <img src={data.image} alt={data.title} />

      <span>{data.date}</span>

      <p>{data.content}</p>
    </div>
  )
}