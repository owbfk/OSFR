export type ContactIntro = {
  title: string
  hotlineTitle: string
  hotlineValue: string
  regionalTitle: string
  regionalPhone: string
  addressTitle: string
  addressValue: string
  scheduleTitle: string
  scheduleValue: string
  receptionTitle: string
  receptionPhone: string
  emailTitle: string
  emailValue: string
  appointmentTitle: string
  appointmentText: string
  pressTitle: string
  pressEmailTitle: string
  pressEmail: string
  appealsTitle: string
  appealsPostTitle: string
  appealsPostAddress: string
  appealsOnlineTitle: string
  appealsOnlineText: string
}

export type SupportPhoneInfo = {
  title: string
  subtitle: string
  phone: string
  center: string
  requestText: string
}

export type InformationMeta = {
  categories: string[]
  categoryDescriptions: Record<string, string>
}
