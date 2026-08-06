import AuthPage from './AuthPage'

export default function LoginPage({ onAuth }) {
  return <AuthPage mode="login" onAuth={onAuth} />
}
