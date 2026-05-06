import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../auth/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = useMemo(() => {
    const v = location.state?.from
    return typeof v === 'string' && v.startsWith('/') ? v : '/seller'
  }, [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <h1>Login</h1>
        <p className="muted">Use the account you created in Signup.</p>

        {error ? <div className="alert">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn" type="submit">
            Login
          </button>
        </form>

        <p className="muted">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
