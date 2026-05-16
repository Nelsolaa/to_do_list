import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/button'
import { createUser, loginUser } from '../../functions/auth'
import './index.css'

function Login() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  async function handleLogin(formData: FormData) {
    const username = String(formData.get('username') ?? '')
    const password = String(formData.get('password') ?? '')

    try {
      setErrorMessage('')
      await loginUser({ username, password })
      navigate('/home')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel fazer login.')
    }
  }

  async function handleSignUp(formData: FormData) {
    const username = String(formData.get('username') ?? '')
    const password = String(formData.get('password') ?? '')

    try {
      setErrorMessage('')
      await createUser({ username, password })
      await loginUser({ username, password })
      navigate('/home')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel criar a conta.')
    }
  }

  return (
    <main className="wrapper">
      <div className="switch">
        <input id="login-toggle" className="toggle" type="checkbox" />
        <label className="slider" htmlFor="login-toggle"></label>
        <label className="card-side" htmlFor="login-toggle"></label>

        <section className="flip-card__inner">
          <div className="flip-card__front">
            <h1 className="title">Log in</h1>

            <form className="flip-card__form" action={handleLogin}>
              <input
                className="flip-card__input"
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
              />

              <input
                className="flip-card__input"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />

              <Button type="submit">Entrar</Button>
            </form>
          </div>

          <div className="flip-card__back">
            <h1 className="title">Sign up</h1>

            <form className="flip-card__form" action={handleSignUp}>
              <input
                className="flip-card__input"
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
              />

              <input
                className="flip-card__input"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                required
              />

              <Button type="submit">Cadastrar</Button>
            </form>
          </div>
        </section>

        {errorMessage && <p className="login-error">{errorMessage}</p>}
      </div>
    </main>
  )
}

export default Login
