import { getSession } from './auth.js'

const apiBaseKey = 'nexahire-api-base-url'
const defaultApiBase = 'http://127.0.0.1:5000/api'

export function getApiBaseUrl() {
  return (localStorage.getItem(apiBaseKey) || defaultApiBase).replace(/\/+$/, '')
}

export function setApiBaseUrl(url) {
  const normalized = url.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(normalized)) throw new Error('API URL must start with http:// or https://.')
  localStorage.setItem(apiBaseKey, normalized)
}

export async function apiRequest(path, { method = 'GET', body, token, headers = {}, signal } = {}) {
  const requestHeaders = new Headers(headers)
  const accessToken = token || getSession()?.accessToken
  if (accessToken) requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  if (body && !(body instanceof FormData)) requestHeaders.set('Content-Type', 'application/json')

  let response
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      headers: requestHeaders,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      signal: signal || AbortSignal.timeout(6500),
    })
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('The backend took too long to respond. Please try again.')
    }
    throw new Error(`Cannot reach the backend at ${getApiBaseUrl()}. Start Flask or use a demo account.`)
  }

  const responseType = response.headers.get('content-type') || ''
  const payload = response.status === 204 ? null : responseType.includes('application/json') ? await response.json() : await response.text()
  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || payload?.error || `Request failed (${response.status}).`
    throw new Error(message)
  }
  return payload
}

export async function apiLogin(email, password) {
  const response = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
  const accessToken = response?.access_token || response?.token
  const user = response?.user || response?.data?.user
  if (!accessToken || !user) throw new Error('The login response must include access_token and user details.')
  return { accessToken, user }
}

export async function apiRegister({ name, email, password, role }) {
  return apiRequest('/auth/register', { method: 'POST', body: { name, email, password, role } })
}

export function normalizeList(response, key) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.[key])) return response[key]
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.[key])) return response.data[key]
  return []
}