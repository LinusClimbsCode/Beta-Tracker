import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, FormError } from '@/components'
import { ROUTES } from '@/constants'

export function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate(ROUTES.HOME)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.login.errorFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          {t('auth.login.title')}
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <FormError message={error} />}

          <div className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label={t('auth.login.email')}
              value={email}
              onChange={setEmail}
              placeholder={t('auth.login.emailPlaceholder')}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label={t('auth.login.password')}
              value={password}
              onChange={setPassword}
              placeholder={t('auth.login.passwordPlaceholder')}
              required
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? t('auth.login.submittingButton') : t('auth.login.submitButton')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">{t('auth.login.noAccount')} </span>
            <Link to={ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              {t('auth.login.signUpLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
