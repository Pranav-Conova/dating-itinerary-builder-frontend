import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import DateBuilder from './pages/DateBuilder'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-rose-500">
            💞 Dating Itinerary Builder
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dates/:id" element={<DateBuilder />} />
        </Routes>
      </main>
    </div>
  )
}
