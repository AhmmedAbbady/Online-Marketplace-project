const USERS_KEY = 'marketplace_users'
const CURRENT_USER_KEY = 'marketplace_current_user'

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}

    // Migrate legacy array format into an email-keyed object map.
    if (Array.isArray(parsed)) {
      return parsed.reduce((acc, entry) => {
        const email = String(entry?.email || '')
          .trim()
          .toLowerCase()
        if (!email) return acc

        acc[email] = {
          name: String(entry?.name || ''),
          email,
          password: String(entry?.password || ''),
          role: entry?.role === 'buyer' ? 'buyer' : 'seller',
          createdAt: entry?.createdAt || new Date().toISOString(),
        }
        return acc
      }, {})
    }

    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function signup({ name, email, password, role }) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanName = String(name || '').trim()

  if (!cleanName) throw new Error('Name is required')
  if (!cleanEmail) throw new Error('Email is required')
  if (!String(password || '').trim()) throw new Error('Password is required')
  if (role !== 'seller' && role !== 'buyer') throw new Error('Role is required')

  const users = readUsers()
  if (users[cleanEmail]) throw new Error('Email already exists')

  users[cleanEmail] = {
    name: cleanName,
    email: cleanEmail,
    password: String(password),
    role,
    createdAt: new Date().toISOString(),
  }

  writeUsers(users)

  const currentUser = {
    name: users[cleanEmail].name,
    email: users[cleanEmail].email,
    role: users[cleanEmail].role,
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))

  return currentUser
}

export function login({ email, password, role }) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanPassword = String(password || '')

  if (!cleanEmail) throw new Error('Email is required')
  if (!cleanPassword) throw new Error('Password is required')
  if (role !== 'seller' && role !== 'buyer') throw new Error('Role is required')

  const users = readUsers()
  const user = users[cleanEmail]

  if (!user || user.password !== cleanPassword) {
    throw new Error('Invalid email or password')
  }

  if (user.role !== role) {
    throw new Error(`This account is a ${user.role} account, not a ${role} account`)
  }

  const currentUser = { name: user.name, email: user.email, role: user.role }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))

  return currentUser
}
