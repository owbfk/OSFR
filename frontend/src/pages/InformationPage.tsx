import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useInformation } from '../api/informationApi'
import type { InformationCategory } from '../types/information'
import styles from '../styles/pages/_information.module.scss'

const CATEGORY_ORDER: InformationCategory[] = [
  'Гражданам',
  'Страхователям',
  'Медицинским организациям',
  'Центры общения для людей старшего поколения',
  'Прочее',
]

export const InformationPage = () => {
  const { data, isLoading, isError } = useInformation()

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: data?.filter((item) => item.category === category) ?? [],
  }))

  const categoryClassMap: Record<InformationCategory, string> = {
    'Гражданам': styles.citizens,
    'Страхователям': styles.insurers,
    'Медицинским организациям': styles.medical,
    'Центры общения для людей старшего поколения': styles.senior,
    'Прочее': styles.misc,
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Информация</h1>
          <p className={styles.subtitle}>
            Разделы для граждан, страхователей, медицинских организаций и других групп пользователей.
          </p>
        </section>

        {isLoading && <p className={styles.status}>Загрузка информации...</p>}
        {isError && <p className={styles.status}>Не удалось загрузить информацию.</p>}

        {!isLoading && !isError && (
          <div className={styles.sections}>
            {grouped.map((group) => (
              <section key={group.category} className={`${styles.section} ${categoryClassMap[group.category]}`}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>{group.category}</h2>
                  <span className={styles.count}>Материалов: {group.items.length}</span>
                </div>

                <div className={styles.grid}>
                  {group.items.map((item) => (
                    <article key={item.id} className={styles.card}>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <Link to={`/information/${item.id}`} className={styles.link}>
                        Подробнее
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
