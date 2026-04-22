export type InformationCategory = string

export interface InformationItem {
  id: number
  category: InformationCategory
  title: string
  summary: string
  content: string
  updatedAt: string
}
