import { getRoom, getMessages } from '../../../lib/store'

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { code } = req.query
  const room = getRoom(code?.toUpperCase())
  if (!room) return res.status(404).json({ error: 'Room not found' })
  res.json({ ...room, messages: getMessages(code.toUpperCase()) })
}
