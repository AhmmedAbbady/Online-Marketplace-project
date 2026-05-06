import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../auth/auth'

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('seller')
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      signup({ name, email, password, role })
      navigate('/seller', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <h1>Signup</h1>
        <p className="muted">Creates a local demo account (no backend yet).</p>

        {error ? <div className="alert">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              autoComplete="name"
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </label>

          <fieldset className="fieldset">
            <legend>Role</legend>
            <label className="radio">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={role === 'seller'}
                onChange={() => setRole('seller')}
              />
              Seller
            </label>
            <label className="radio">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={role === 'buyer'}
                onChange={() => setRole('buyer')}
              />
              Buyer
            </label>
          </fieldset>

          <button className="btn" type="submit">
            Create account
          </button>
        </form>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
