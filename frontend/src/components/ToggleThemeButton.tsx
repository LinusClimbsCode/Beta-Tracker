import { useTheme } from "../context";
import { useTranslation } from "react-i18next";

export const ToggleThemeButton = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const onClick = () => {
    if (theme === 'system') {
      setTheme('light')
    }
    else if (theme === 'light') {
      setTheme('dark')
    }
    else {
      setTheme('system')
    }
  }

  return (
    <button type="button" onClick={onClick}>
      {t(`theme.${theme}`)}
    </button>
  )
}
