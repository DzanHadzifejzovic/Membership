import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/contexts/LanguageContext'
import { LANGUAGES, type Locale } from '@/i18n/translations'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <Select value={locale} onValueChange={(v) => v && setLocale(v as Locale)}>
      <SelectTrigger className="w-auto" aria-label="Language">
        <SelectValue>
          {(value: Locale) => {
            const lang = LANGUAGES.find((l) => l.locale === value)
            return lang ? `${lang.flag} ${lang.label}` : value
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.locale} value={lang.locale}>
            {lang.flag} {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
