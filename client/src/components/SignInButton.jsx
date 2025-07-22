// client/src/components/SignInButton.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const SignInButton = () => {
  return (
    <Link to="/signup">
        <button className="px-4 py-2 border border-gray-400 text-sm rounded-full hover:bg-white hover:text-black transition-all font-inter">
          Sign in
        </button>
    </Link>
    
  )
}

export default SignInButton
