// i18n configuration for FormCoach
const translations = {
    en: { appName: 'FormCoach', description: 'Upload exercise form for posture grading and corrections' },
    de: { appName: 'FormCoach', description: 'Upload exercise form for posture grading and corrections (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
