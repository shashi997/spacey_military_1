// client/src/components/LogInButton.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const LogInButton = () => {
  return (
    <Link to="/login">
      <button className="px-4 py-2 border border-gray-400 text-sm rounded-full hover:bg-white hover:text-black transition-all font-inter">
        Log In
      </button>
    </Link>
  )
}

export default LogInButton