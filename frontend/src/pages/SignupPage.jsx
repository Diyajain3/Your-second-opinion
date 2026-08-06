import AuthPage from './AuthPage'

export default function SignupPage({ onAuth }) {
  return <AuthPage mode="signup" onAuth={onAuth} />
}
