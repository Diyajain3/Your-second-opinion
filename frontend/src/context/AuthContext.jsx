import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

function readUser() {
  try { return JSON.parse(sessionStorage.getItem('second-opinion-user')) } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  function signIn(data) {
    sessionStorage.setItem('second-opinion-token', data.token)
    sessionStorage.setItem('second-opinion-user', JSON.stringify(data.user))
    setUser(data.user)
  }
  function signOut() {
    sessionStorage.removeItem('second-opinion-token')
    sessionStorage.removeItem('second-opinion-user')
    setUser(null)
  }
  const value = useMemo(() => ({ user, signIn, signOut }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
