import { ToggleThemeButton } from "./components"

function App() {
  return (
    <div className="min-h-screen bg-blue-500 dark:bg-gray-900 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Tailwind funktioniert! 🎉
      </h1>
      <ToggleThemeButton />
    </div>
  )
}
export default App
