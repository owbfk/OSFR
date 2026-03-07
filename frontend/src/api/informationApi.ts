import { useQuery } from '@tanstack/react-query'
import type { InformationItem } from '../types/information'

const MOCK_INFORMATION: InformationItem[] = [
  {
    id: 101,
    category: 'Гражданам',
    title: 'Подача заявления на выплату',
    summary: 'Порядок подачи заявления и перечень документов.',
    content: 'Заглушка: подробное описание процедуры подачи заявления на выплату.',
    updatedAt: '2026-03-01',
  },
  {
    id: 102,
    category: 'Гражданам',
    title: 'Проверка статуса обращения',
    summary: 'Как отследить этап рассмотрения заявления.',
    content: 'Заглушка: детальная инструкция по проверке статуса обращения.',
    updatedAt: '2026-03-01',
  },
  {
    id: 201,
    category: 'Страхователям',
    title: 'Отчетность страхователя',
    summary: 'Сроки и формат передачи отчетности.',
    content: 'Заглушка: правила подготовки и отправки отчетности страхователя.',
    updatedAt: '2026-03-02',
  },
  {
    id: 202,
    category: 'Страхователям',
    title: 'Электронный документооборот',
    summary: 'Основные шаги подключения и работы.',
    content: 'Заглушка: подробности по электронному документообороту.',
    updatedAt: '2026-03-02',
  },
  {
    id: 301,
    category: 'Медицинским организациям',
    title: 'Взаимодействие по реестрам',
    summary: 'Требования к реестрам и срокам передачи.',
    content: 'Заглушка: описание работы медицинских организаций с реестрами.',
    updatedAt: '2026-03-03',
  },
  {
    id: 302,
    category: 'Медицинским организациям',
    title: 'Компенсационные выплаты',
    summary: 'Общие условия назначения и сопровождения.',
    content: 'Заглушка: информация о компенсационных выплатах для медорганизаций.',
    updatedAt: '2026-03-03',
  },
  {
    id: 401,
    category: 'Центры общения для людей старшего поколения',
    title: 'Программы мероприятий',
    summary: 'Форматы активности и способы участия.',
    content: 'Заглушка: описание программ центров общения.',
    updatedAt: '2026-03-04',
  },
  {
    id: 402,
    category: 'Центры общения для людей старшего поколения',
    title: 'Запись и консультации',
    summary: 'Как записаться и получить консультацию.',
    content: 'Заглушка: порядок записи в центры общения.',
    updatedAt: '2026-03-04',
  },
  {
    id: 501,
    category: 'Прочее',
    title: 'Часто задаваемые вопросы',
    summary: 'Подборка ответов по популярным темам.',
    content: 'Заглушка: расширенный список часто задаваемых вопросов.',
    updatedAt: '2026-03-05',
  },
  {
    id: 502,
    category: 'Прочее',
    title: 'Общие справочные материалы',
    summary: 'Полезные ссылки и разъяснения.',
    content: 'Заглушка: дополнительные справочные материалы.',
    updatedAt: '2026-03-05',
  },
]

export const fetchInformation = async (): Promise<InformationItem[]> => {
  const response = await new Promise<{ data: InformationItem[] }>((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_INFORMATION })
    }, 900)
  })

  return response.data
}

export const fetchInformationById = async (id: string): Promise<InformationItem> => {
  const list = await fetchInformation()
  const item = list.find((entry) => entry.id === Number(id))

  if (!item) {
    throw new Error(`Information item with id "${id}" not found`)
  }

  return item
}

export const useInformation = () => {
  return useQuery({
    queryKey: ['information'],
    queryFn: fetchInformation,
  })
}

export const useInformationById = (id: string) => {
  return useQuery({
    queryKey: ['information', id],
    queryFn: () => fetchInformationById(id),
    enabled: Boolean(id),
  })
}
