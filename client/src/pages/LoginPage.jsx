// client/src/pages/LoginPage.jsx
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    // In a real app, you'd handle login logic here, e.g., API calls.
    // For this example, we'll just simulate a login process.
    setLoading(true)
    setError(null)
    console.log('Clicked Login:', { email, password }) // For now

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)
    // In a real app, you'd redirect on success.
    // For now, you might show a success message or clear the form.
    setEmail('')
    setPassword('')
  }

  return (
    <div className="relative min-h-screen bg-gray-800 text-gray-100">
      <Navbar />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_20%_40%,_rgba(128,0,128,0.2),_transparent_40%),radial-gradient(circle_at_80%_60%,_rgba(0,139,139,0.2),_transparent_40%)]"></div>
      <main className="relative z-20 flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 animate-[fadeIn_1s_ease-in-out]">
          <div className="text-center">
            <h1 className="text-3xl font-oswald font-bold text-gray-100">Welcome Back!</h1>
            <p className="text-gray-400 mt-2">Log in to continue your space mission.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-yellow-300 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-yellow-300 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            </div>
            {error && <p className="flex items-center gap-2 text-sm text-red-400"><AlertCircle size={16} />{error}</p>}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-gray-800 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-yellow-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging In...' : 'Continue'}
            </button>
          </form>
          <p className="text-sm text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
