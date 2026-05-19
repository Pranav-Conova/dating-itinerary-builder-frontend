const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

export type Activity = {
  id: number
  name: string
  category: string
  default_duration_min: number
  est_cost: number
}

export type ItineraryItem = {
  id: number
  activity_id: number | null
  custom_name: string | null
  start_time: string | null
  duration_min: number
  order_index: number
  notes: string | null
}

export type DateObj = {
  id: number
  user_id: number
  title: string
  scheduled_at: string | null
  mood: string | null
  budget: number | null
  notes: string | null
  created_at: string
  items: ItineraryItem[]
}

export const api = {
  createUser: (name: string, email: string) =>
    request<{ id: number; name: string; email: string }>('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    }),
  listActivities: () => request<Activity[]>('/activities'),
  listDates: (userId: number) => request<DateObj[]>(`/dates?user_id=${userId}`),
  getDate: (id: number) => request<DateObj>(`/dates/${id}`),
  createDate: (payload: { user_id: number; title: string; mood?: string; budget?: number }) =>
    request<DateObj>('/dates', { method: 'POST', body: JSON.stringify(payload) }),
  deleteDate: (id: number) => request<void>(`/dates/${id}`, { method: 'DELETE' }),
  addItem: (
    dateId: number,
    payload: {
      activity_id?: number
      custom_name?: string
      duration_min?: number
      order_index?: number
      notes?: string
    },
  ) =>
    request<ItineraryItem>(`/dates/${dateId}/items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteItem: (id: number) => request<void>(`/items/${id}`, { method: 'DELETE' }),
}
