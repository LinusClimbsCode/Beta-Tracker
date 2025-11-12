import { useTheme } from "../context";

export const ToggleThemeButton = () => {
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
      {theme}
    </button>
  )
}
