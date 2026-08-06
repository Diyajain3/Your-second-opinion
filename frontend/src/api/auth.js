import { request } from './client'

export const login = credentials => request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
export const signup = details => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(details) })
