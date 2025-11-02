import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import MenuList from './components/MenuList'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <MenuList />
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
            <p>Made with React, Tailwind CSS, and Supabase</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
