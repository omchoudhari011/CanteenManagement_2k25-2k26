import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, signOut } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Delicious Menu</h1>
                <p className="text-sm text-gray-500">Fresh food, delivered with love</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
