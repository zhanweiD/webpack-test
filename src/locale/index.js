import cn from './cn.json'
import en from './en.json'

export const LOCALES = {
  CHINESE: 'zh-CN',
  ENGLISH: 'en-US',
}

export const messages = {
  [LOCALES.CHINESE]: cn,
  [LOCALES.ENGLISH]: en,
}

export const glangToLocale = lang => {
  return (
    {
      en: LOCALES.ENGLISH,
      cn: LOCALES.CHINESE,
    }[lang] || LOCALES.ENGLISH
  )
}
