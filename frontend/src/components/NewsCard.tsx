import { Link } from 'react-router-dom'
import type { NewsItem } from '../types/news'
import styles from '../styles/components/_newsCard.module.scss'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23eef4f8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23607080' font-size='24' font-family='Arial,sans-serif'%3ENo image%3C/text%3E%3C/svg%3E"

type Props = {
  news: NewsItem
}

export const NewsCard = ({ news }: Props) => {
  const title = news.title?.trim() || 'Новость без заголовка'
  const description = news.description?.trim() || 'Описание временно недоступно.'
  const date = news.date?.trim() || 'Дата не указана'
  const image = news.image?.trim() || PLACEHOLDER_IMAGE

  return (
    <Link to={`/news/${news.id}`} className={styles.card}>
      <img className={styles.image} src={image} alt={title} />

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.date}>{date}</span>
      </div>
    </Link>
  )
}
