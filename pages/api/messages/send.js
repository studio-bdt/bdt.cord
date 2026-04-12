import pusher from '../../../lib/pusher'
import { getRoom, addMessage } from '../../../lib/store'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code, author, text, color } = req.body
  const roomCode = code?.toUpperCase()

  if (!roomCode || !author || !text) {
    return res.status(400).json({ error: 'code, author, text required' })
  }

  const room = getRoom(roomCode)
  if (!room) return res.status(404).json({ error: 'Room not found' })

  const msg = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2),
    author,
    text: text.slice(0, 2000),
    color,
    ts: Date.now(),
  }

  addMessage(roomCode, msg)

  await pusher.trigger(`room-${roomCode}`, 'message', msg)

  res.status(201).json(msg)
}
