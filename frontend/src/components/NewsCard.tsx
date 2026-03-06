import { Link } from 'react-router-dom'
import type { NewsItem } from '../types/news'
import styles from '../styles/components/_newsCard.module.scss'

type Props = {
  news: NewsItem
}

export const NewsCard = ({ news }: Props) => {
  return (
    <Link to={`/news/${news.id}`} className={styles.card}>
      <img src={news.image} alt={news.title} />

      <div className={styles.content}>
        <h3>{news.title}</h3>
        <p>{news.description}</p>
        <span>{news.date}</span>
      </div>
    </Link>
  )
}