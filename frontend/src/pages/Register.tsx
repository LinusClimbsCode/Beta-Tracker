import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, FormError } from '@/components'
import { ROUTES } from '@/constants'

export function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await register({ email, username, name, city, password })
      navigate(ROUTES.HOME)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.register.errorFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          {t('auth.register.title')}
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <FormError message={error} />}

          <div className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label={t('auth.register.email')}
              value={email}
              onChange={setEmail}
              placeholder={t('auth.register.emailPlaceholder')}
              required
            />

            <Input
              id="username"
              name="username"
              type="text"
              label={t('auth.register.username')}
              value={username}
              onChange={setUsername}
              placeholder={t('auth.register.usernamePlaceholder')}
              maxLength={20}
              required
            />

            <Input
              id="name"
              name="name"
              type="text"
              label={t('auth.register.name')}
              value={name}
              onChange={setName}
              placeholder={t('auth.register.namePlaceholder')}
              maxLength={20}
              required
            />

            <Input
              id="city"
              name="city"
              type="text"
              label={t('auth.register.city')}
              value={city}
              onChange={setCity}
              placeholder={t('auth.register.cityPlaceholder')}
              maxLength={20}
              required
            />

            <div>
              <Input
                id="password"
                name="password"
                type="password"
                label={t('auth.register.password')}
                value={password}
                onChange={setPassword}
                placeholder={t('auth.register.passwordPlaceholder')}
                minLength={8}
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('auth.register.passwordHint')}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? t('auth.register.submittingButton') : t('auth.register.submitButton')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">{t('auth.register.haveAccount')} </span>
            <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              {t('auth.register.signInLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
