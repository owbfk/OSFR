export type InformationCategory =
  | 'Гражданам'
  | 'Страхователям'
  | 'Медицинским организациям'
  | 'Центры общения для людей старшего поколения'
  | 'Прочее'

export interface InformationItem {
  id: number
  category: InformationCategory
  title: string
  summary: string
  content: string
  updatedAt: string
}
