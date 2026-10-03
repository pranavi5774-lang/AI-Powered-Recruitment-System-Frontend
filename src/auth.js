const sessionKey = 'nexahire-demo-session'
export const demoPassword = 'hire-demo'
const validRoles = ['HR administrator', 'Candidate', 'Employee', 'Administrator']

function normalizeRole(value) {
  const role = String(value || '').trim().toLowerCase().replaceAll('_', ' ').replaceAll('-', ' ')
  if (['hr', 'hr admin', 'hr administrator', 'human resources'].includes(role)) return 'HR administrator'
  if (role === 'admin' || role === 'administrator') return 'Administrator'
  if (role === 'candidate') return 'Candidate'
  if (role === 'employee') return 'Employee'
  return value
}

export const demoAccounts = [
  { email: 'pranavi@nexahire.demo', name: 'Pranavi Jadhav', role: 'HR administrator' },
  { email: 'aarav@nexahire.demo', name: 'Aarav Mehta', role: 'Candidate' },
  { email: 'rohan@nexahire.demo', name: 'Rohan Deshmukh', role: 'Employee' },
  { email: 'admin@nexahire.demo', name: 'Pranavi Jadhav', role: 'Administrator' },
]

export function signIn(email, password) {
  const account = demoAccounts.find((item) => item.email === email.trim().toLowerCase())
  if (!account || password !== demoPassword) throw new Error('The email or password is incorrect.')

  return saveSession({ ...account, demo: true })
}

export function registerDemo({ name, email, role }) {
  if (!name.trim() || !email.trim() || !['Candidate', 'Employee'].includes(role)) {
    throw new Error('Enter your name, email, and a valid account type.')
  }
  return saveSession({ name: name.trim(), email: email.trim().toLowerCase(), role, demo: true })
}

export function saveSession(user, accessToken = null) {
  const role = normalizeRole(user.role)
  const email = String(user.email || '').trim().toLowerCase()
  if (!validRoles.includes(role) || !email || (!user.demo && !accessToken)) {
    throw new Error('The backend returned incomplete user or token data.')
  }
  const session = {
    email,
    name: String(user.name || user.full_name || email.split('@')[0]),
    role,
    demo: user.demo === true,
    ...(accessToken ? { accessToken } : {}),
  }
  sessionStorage.setItem(sessionKey, JSON.stringify(session))
  return session
}

export function getSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(sessionKey) || 'null')
    if (!session || !validRoles.includes(session.role) || !session.email) return null
    if (session.demo === true || typeof session.accessToken === 'string') return session
    return null
  } catch {
    return null
  }
}

export function getAccessToken() {
  return getSession()?.accessToken || null
}

export function signOut() {
  sessionStorage.removeItem(sessionKey)
}