import React from 'react'
import SignInButton from './SignInButton'
import { Link } from 'react-router-dom'
import LogInButton from './LogInButton'

const Navbar = () => {
  return (
    <header>
      <nav className="flex items-center justify-between px-8 py-4 bg-transparent">
        <Link to="/">
          <div className="text-2xl font-oswald font-bold text-white">Spacey</div>
        </Link>
        <div className="block min-[1080px]:hidden">
          {/* No Sign In button here for smaller screens */}
        </div>
        <div className="hidden min-[1080px]:block space-x-4">
          <SignInButton />
          <LogInButton />
        </div>
      </nav>
    </header>
  )
}

export default Navbar