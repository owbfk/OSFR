import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useInformation } from '../api/informationApi'
import { useInformationMeta } from '../api/siteContentApi'
import styles from '../styles/pages/_information.module.scss'

export const InformationPage = () => {
  const { data, isLoading, isError } = useInformation()
  const { data: informationMeta } = useInformationMeta()
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const hasQuery = normalizedQuery.length > 0

  const categories = useMemo(() => {
    if (informationMeta?.categories?.length) {
      return informationMeta.categories
    }

    return Array.from(new Set((data ?? []).map((item) => item.category)))
  }, [data, informationMeta])

  const grouped = useMemo(() => {
    const prepared = categories.map((category) => {
      const items = data?.filter((item) => item.category === category) ?? []

      if (!hasQuery) {
        return { category, items, total: items.length }
      }

      const categoryMatch = category.toLowerCase().includes(normalizedQuery)
      const filteredItems = categoryMatch
        ? items
        : items.filter((item) =>
            [item.title, item.summary, item.content].some((field) =>
              field.toLowerCase().includes(normalizedQuery),
            ),
          )

      return { category, items: filteredItems, total: items.length }
    })

    return hasQuery ? prepared.filter((group) => group.items.length > 0) : prepared
  }, [categories, data, hasQuery, normalizedQuery])

  const totalMatches = useMemo(
    () => grouped.reduce((sum, group) => sum + group.items.length, 0),
    [grouped],
  )

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

        <div className={styles.toolbar}>
          <div className={styles.search}>
            <label className={styles.searchLabel} htmlFor="information-search">
              Поиск по разделам
            </label>
            <input
              id="information-search"
              className={styles.searchInput}
              type="search"
              placeholder="Поиск по темам, заголовкам и категориям"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button className={styles.clearButton} type="button" onClick={() => setQuery('')}>
                Очистить
              </button>
            )}
          </div>
          <div className={styles.resultMeta}>
            {hasQuery ? `Найдено материалов: ${totalMatches}` : `Всего материалов: ${data?.length ?? 0}`}
          </div>
        </div>

        {isLoading && <p className={styles.status}>Загрузка информации...</p>}
        {isError && <p className={styles.status}>Не удалось загрузить информацию.</p>}

        {!isLoading && !isError && (
          <>
            {hasQuery && totalMatches === 0 ? (
              <div className={styles.emptyState}>
                <h2>Ничего не найдено</h2>
                <p>Попробуйте изменить запрос или выбрать другой раздел.</p>
              </div>
            ) : (
              <div className={styles.sections}>
                {grouped.map((group) => (
                  <section key={group.category} className={styles.section}>
                    <div className={styles.sectionHead}>
                      <h2 className={styles.sectionTitle}>{group.category}</h2>
                      <span className={styles.count}>
                        Материалов: {group.items.length}
                        {hasQuery && group.total > group.items.length && ` из ${group.total}`}
                      </span>
                    </div>

                    <div className={styles.list}>
                      {group.items.map((item) => (
                        <Link key={item.id} to={`/information/${item.id}`} className={styles.item}>
                          <div className={styles.itemMain}>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemSummary}>{item.summary}</p>
                          </div>
                          <div className={styles.itemMeta}>
                            <span className={styles.itemDate}>{item.updatedAt}</span>
                            <span className={styles.itemAction}>Подробнее</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  )
}
