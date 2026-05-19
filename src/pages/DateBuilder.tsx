import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, DateObj, Activity } from '../api'

export default function DateBuilder() {
  const { id } = useParams<{ id: string }>()
  const dateId = Number(id)
  const [date, setDate] = useState<DateObj | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [selected, setSelected] = useState<number | ''>('')
  const [custom, setCustom] = useState('')
  const [notes, setNotes] = useState('')

  async function refresh() {
    const [d, a] = await Promise.all([api.getDate(dateId), api.listActivities()])
    setDate(d)
    setActivities(a)
  }

  useEffect(() => {
    refresh()
  }, [dateId])

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    if (!selected && !custom.trim()) return
    await api.addItem(dateId, {
      activity_id: selected || undefined,
      custom_name: custom.trim() || undefined,
      order_index: (date?.items.length || 0) + 1,
      notes: notes.trim() || undefined,
    })
    setSelected('')
    setCustom('')
    setNotes('')
    refresh()
  }

  async function removeItem(itemId: number) {
    await api.deleteItem(itemId)
    refresh()
  }

  if (!date) return <p>Loading…</p>

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="text-sm text-rose-500 hover:underline">
          ← All dates
        </Link>
        <h1 className="text-2xl font-semibold mt-1">{date.title}</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-medium mb-3">Itinerary</h2>
        {date.items.length === 0 && (
          <p className="text-gray-500 text-sm">No activities yet.</p>
        )}
        <ol className="space-y-2">
          {date.items.map((item, i) => {
            const activity = activities.find((a) => a.id === item.activity_id)
            return (
              <li
                key={item.id}
                className="flex items-center justify-between border-l-4 border-rose-500 pl-3 py-2 bg-rose-50 rounded-r"
              >
                <div>
                  <span className="font-medium">
                    {i + 1}. {activity?.name || item.custom_name}
                  </span>
                  {activity && (
                    <span className="text-xs text-gray-500 ml-2">({activity.category})</span>
                  )}
                  {item.notes && <p className="text-sm text-gray-600">{item.notes}</p>}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <form onSubmit={addItem} className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="font-medium">Add activity</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value ? Number(e.target.value) : '')}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">— Pick from catalog or use custom below —</option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.category} · {a.name}
            </option>
          ))}
        </select>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Or custom activity name"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600">
          Add
        </button>
      </form>
    </div>
  )
}
