import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, DateObj } from '../api'

const DEMO_USER_ID = 1

export default function Home() {
  const [dates, setDates] = useState<DateObj[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function load() {
    try {
      await api.createUser('Demo User', 'demo@example.com').catch(() => null)
      const list = await api.listDates(DEMO_USER_ID)
      setDates(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createDate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const created = await api.createDate({ user_id: DEMO_USER_ID, title })
    setTitle('')
    navigate(`/dates/${created.id}`)
  }

  async function remove(id: number) {
    if (!confirm('Delete this date?')) return
    await api.deleteDate(id)
    setDates(dates.filter((d) => d.id !== id))
  }

  if (loading) return <p>Loading…</p>

  return (
    <div className="space-y-6">
      <form onSubmit={createDate} className="bg-white p-4 rounded-lg shadow flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Plan a new date… e.g. Friday night out"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <button className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600">Create</button>
      </form>

      <div className="space-y-3">
        {dates.length === 0 && (
          <p className="text-gray-500">No dates yet — plan your first one above.</p>
        )}
        {dates.map((d) => (
          <div
            key={d.id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <Link to={`/dates/${d.id}`} className="text-lg font-medium hover:text-rose-500">
                {d.title}
              </Link>
              <p className="text-sm text-gray-500">
                {d.items.length} {d.items.length === 1 ? 'activity' : 'activities'}
                {d.scheduled_at && ` · ${new Date(d.scheduled_at).toLocaleDateString()}`}
              </p>
            </div>
            <button
              onClick={() => remove(d.id)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
