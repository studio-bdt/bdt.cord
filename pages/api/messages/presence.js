import pusher from '../../../lib/pusher'
import { getRoom, updateMembers } from '../../../lib/store'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { code, author, action } = req.body // action: 'join' | 'leave'
  const roomCode = code?.toUpperCase()
  if (!roomCode || !author || !getRoom(roomCode)) return res.status(400).end()

  const delta = action === 'join' ? 1 : -1
  const members = updateMembers(roomCode, delta)

  await pusher.trigger(`room-${roomCode}`, 'presence', { author, action, members })
  res.status(200).json({ members })
}
